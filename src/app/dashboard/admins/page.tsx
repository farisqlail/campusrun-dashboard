"use client";

import { useMemo, useState, type FormEvent } from "react";
import useSWR from "swr";
import { Shield, UserPlus, Activity, Pencil, Trash2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { ExportButton } from "@/components/export-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/confirm-modal";
import { getSupabaseClient } from "@/lib/supabase";
import type { AdminRole, AdminUser } from "@/lib/types";

type DashboardAdminRow = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLoginAt: string | null;
};

const roleLabelMap: Record<AdminRole, string> = {
  superadmin: "Super Admin",
  admin: "Admin",
  support: "Support",
};

const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "superadmin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "support", label: "Support" },
];

export default function AdminsPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: admins,
    error,
    isLoading,
    mutate,
  } = useSWR<DashboardAdminRow[]>("dashboard-admins", async () => {
    const { data, error } = await supabase
      .from("admin_users")
      .select(
        `
        id,
        name,
        email,
        role,
        last_login_at,
        created_at
      `
      )
      .order("created_at", { ascending: true });

    if (error) {
      throw error;
    }

    const typedRows = (data ?? []) as unknown as AdminUser[];

    return typedRows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      lastLoginAt: row.last_login_at,
    }));
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("admin");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<AdminRole | "">("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DashboardAdminRow | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<
    | {
        type: "success" | "error";
        message: string;
      }
    | null
  >(null);

  const isEditMode = Boolean(editingId);

  const totalAdmins = admins?.length ?? 0;

  const now = new Date();
  const activeTodayCount =
    admins?.filter((admin) => {
      if (!admin.lastLoginAt) {
        return false;
      }
      const lastLogin = new Date(admin.lastLoginAt);
      const diffMs = now.getTime() - lastLogin.getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;
      return diffMs <= oneDayMs && diffMs >= 0;
    }).length ?? 0;

  const totalAdminsLabel = totalAdmins.toLocaleString("id-ID");
  const activeTodayLabel = activeTodayCount.toLocaleString("id-ID");

  const filteredAdmins: DashboardAdminRow[] =
    admins && roleFilter
      ? admins.filter((admin) => admin.role === roleFilter)
      : admins ?? [];

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setRole("admin");
    setEditingId(null);
    setFormError(null);
  }

  function openCreateForm() {
    resetForm();
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
  }

  async function hashPassword(plain: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!name || !email) {
      const message = "Nama dan email wajib diisi.";
      setFormError(message);
      setToast({
        type: "error",
        message,
      });
      return;
    }

    if (!isEditMode) {
      if (!password) {
        const message = "Password wajib diisi saat membuat admin baru.";
        setFormError(message);
        setToast({
          type: "error",
          message,
        });
        return;
      }
      if (password.length < 8) {
        const message = "Password minimal 8 karakter.";
        setFormError(message);
        setToast({
          type: "error",
          message,
        });
        return;
      }
    }

    setIsSubmitting(true);

    if (isEditMode && editingId) {
      const updatePayload: Partial<AdminUser> = {
        name,
        email,
        role,
      };

      if (password) {
        const hashed = await hashPassword(password);
        (updatePayload as AdminUser).password_hash = hashed;
      }

      const { error: updateError } = await supabase
        .from("admin_users")
        .update(updatePayload)
        .eq("id", editingId);

      if (updateError) {
        setFormError(updateError.message);
        setToast({
          type: "error",
          message: updateError.message,
        });
        setIsSubmitting(false);
        return;
      }
    } else {
      const hashed = await hashPassword(password);

      const { error: insertError } = await supabase
        .from("admin_users")
        .insert({
          name,
          email,
          role,
          password_hash: hashed,
        });

      if (insertError) {
        setFormError(insertError.message);
         setToast({
           type: "error",
           message: insertError.message,
         });
        setIsSubmitting(false);
        return;
      }
    }

    await mutate();
    resetForm();
    setIsSubmitting(false);
    setIsFormOpen(false);
    setToast({
      type: "success",
      message: isEditMode
        ? "Admin berhasil diperbarui."
        : "Admin berhasil ditambahkan.",
    });
  }

  function handleEdit(admin: DashboardAdminRow) {
    setEditingId(admin.id);
    setName(admin.name);
    setEmail(admin.email);
    setRole(admin.role);
    setFormError(null);
    setIsFormOpen(true);
  }

  function openDeleteModal(admin: DashboardAdminRow) {
    setDeleteTarget(admin);
  }

  function closeDeleteModal() {
    if (isDeleting) return;
    setDeleteTarget(null);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);

    const { error: deleteError } = await supabase
      .from("admin_users")
      .delete()
      .eq("id", deleteTarget.id);

    if (deleteError) {
      setToast({
        type: "error",
        message: deleteError.message,
      });
      setIsDeleting(false);
      return;
    }

    await mutate();
    setIsDeleting(false);
    setDeleteTarget(null);
    setToast({
      type: "success",
      message: "Admin berhasil dihapus.",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Admin
          </h1>
          <p className="text-sm text-slate-400">
            Atur akun internal admin dan hak akses dashboard.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Admin"
          value={totalAdminsLabel}
          helperText="Termasuk super admin"
          icon={<Shield className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Admin Aktif Hari Ini"
          value={activeTodayLabel}
          helperText="Login dalam 24 jam terakhir"
          icon={<Activity className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Permintaan Akses Baru"
          value="1"
          helperText="Menunggu approval super admin"
          icon={<UserPlus className="h-4 w-4" />}
          accent="violet"
        />
      </div>

      <FilterBar showDateRange={false}>
        <select
          className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200"
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value as AdminRole | "")
          }
        >
          <option value="">Semua role</option>
          {ROLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar Admin</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              className="h-8 bg-emerald-500 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
              onClick={openCreateForm}
            >
              Tambah Admin
            </Button>
            <ExportButton
              filename="admins.csv"
              rows={
                filteredAdmins?.map((admin) => ({
                  id: admin.id,
                  name: admin.name,
                  email: admin.email,
                  role: admin.role,
                  last_login_at: admin.lastLoginAt,
                })) ?? []
              }
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <DataTable
            columns={[
              {
                key: "name",
                header: "Nama",
                sortable: true,
              },
              {
                key: "email",
                header: "Email",
              },
              {
                key: "role",
                header: "Role",
                render: (row) => (
                  <span className="text-xs capitalize text-slate-200">
                    {roleLabelMap[row.role as AdminRole] ?? row.role}
                  </span>
                ),
              },
              {
                key: "lastLoginAt",
                header: "Login Terakhir",
                sortable: true,
              },
              {
                key: "id",
                header: "Aksi",
                render: (row) => (
                  <div className="flex justify-end gap-1.5">
                    <Button
                      type="button"
                      className="h-10 w-10 border border-slate-700 bg-transparent p-0 text-slate-200 hover:bg-slate-900/60"
                      onClick={() => handleEdit(row)}
                      aria-label="Edit admin"
                    >
                      <Pencil className="h-10 w-10 text-slate-200" />
                    </Button>
                    <Button
                      type="button"
                      className="h-10 w-10 border border-rose-500/60 bg-transparent p-0 text-rose-300 hover:bg-rose-500/10"
                      onClick={() => openDeleteModal(row)}
                      aria-label="Hapus admin"
                    >
                      <Trash2 className="h-10 w-10 text-rose-300" />
                    </Button>
                  </div>
                ),
              },
            ]}
            data={filteredAdmins}
            searchPlaceholder="Cari nama admin..."
            pageSize={10}
          />
          {isLoading && (
            <p className="mt-3 text-xs text-slate-400">
              Memuat data admin dari Supabase...
            </p>
          )}
          {error && (
            <p className="mt-3 text-xs text-rose-300">
              Gagal memuat data admin: {error.message}
            </p>
          )}
          {!isLoading && !error && admins && admins.length === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Belum ada data admin di Supabase.
            </p>
          )}
        </CardContent>
      </Card>
      {toast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-xs shadow-lg ${
              toast.type === "success"
                ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-100"
                : "border-rose-500/60 bg-rose-500/10 text-rose-100"
            }`}
          >
            <div className="flex-1">{toast.message}</div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-2 text-[10px] text-slate-300 hover:text-slate-50"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
          onClick={closeForm}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-slate-1000 bg-slate-950/95 p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-50">
                {isEditMode ? "Edit Admin" : "Tambah Admin"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Tutup
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="grid gap-3 md:grid-cols-4"
            >
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Nama
                </label>
                <Input
                  placeholder="Nama admin"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="admin@campusrun.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Minimal 8 karakter"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Role
                </label>
                <select
                  className="flex h-9 w-full rounded-md border border-slate-800 bg-slate-900 px-3 text-sm text-slate-100 outline-none ring-offset-slate-950 placeholder:text-slate-500 focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as AdminRole)
                  }
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end gap-2 md:col-span-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-9 bg-emerald-500 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
                >
                  {isEditMode ? "Simpan Perubahan" : "Tambah Admin"}
                </Button>
                {isEditMode && (
                  <Button
                    type="button"
                    className="h-9 border border-red-500 bg-transparent text-xs text-red-500"
                    onClick={() => {
                      resetForm();
                      closeForm();
                    }}
                  >
                    <span className="text-red-500">Batal</span>
                  </Button>
                )}
                {formError && (
                  <div className="text-xs text-rose-300">{formError}</div>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Hapus Admin"
        description={
          deleteTarget
            ? `Anda yakin ingin menghapus admin "${deleteTarget.name}"? Tindakan ini tidak dapat dibatalkan.`
            : ""
        }
        confirmLabel={isDeleting ? "Menghapus..." : "Ya, hapus"}
        cancelLabel="Batal"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}
