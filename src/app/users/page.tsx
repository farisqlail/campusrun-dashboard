'use client';

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSupabaseClient } from "@/lib/supabase";
import type { User, UserRole } from "@/lib/types";

const ROLE_LABEL: Record<UserRole, string> = {
  requester: "Requester",
  runner: "Runner",
  both: "Requester + Runner",
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "requester", label: "Requester" },
  { value: "runner", label: "Runner" },
  { value: "both", label: "Requester + Runner" },
];

type UsersRow = Pick<User, "id" | "full_name" | "email" | "role" | "is_active">;

export default function UsersPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: users,
    error,
    isLoading,
    mutate,
  } = useSWR<UsersRow[]>("users", async () => {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, is_active")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data ?? [];
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("requester");
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditMode = Boolean(editingId);

  function resetForm() {
    setFullName("");
    setEmail("");
    setRole("requester");
    setIsActive(true);
    setEditingId(null);
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!fullName || !email) {
      setFormError("Nama dan email wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    if (isEditMode && editingId) {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          email,
          role,
          is_active: isActive,
        })
        .eq("id", editingId);

      if (error) {
        setFormError(error.message);
        setIsSubmitting(false);
        return;
      }
    } else {
      const { error } = await supabase.from("users").insert({
        full_name: fullName,
        email,
        role,
        is_active: isActive,
      });

      if (error) {
        setFormError(error.message);
        setIsSubmitting(false);
        return;
      }
    }

    await mutate();
    resetForm();
    setIsSubmitting(false);
  }

  function handleEdit(user: UsersRow) {
    setEditingId(user.id);
    setFullName(user.full_name);
    setEmail(user.email);
    setRole(user.role);
    setIsActive(Boolean(user.is_active));
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Hapus user ini? Tindakan ini tidak dapat dibatalkan."
    );
    if (!confirmed) return;

    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      alert(deleteError.message);
      return;
    }

    await mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-slate-400">
            Kelola mahasiswa requester dan runner dari seluruh universitas.
          </p>
        </div>
        <Badge className="bg-slate-900/80 text-[11px] text-slate-300">
          Modul: verifikasi identitas, suspensi akun, dan saldo user.
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pengguna Aktif</CardTitle>
                <CardDescription>Login 30 hari terakhir</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">2.340</div>
            <div className="text-xs text-slate-400">38% dari total terdaftar</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>KYC Terverifikasi</CardTitle>
                <CardDescription>KTM dan data kampus valid</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">1.890</div>
            <div className="text-xs text-slate-400">
              94 runner belum melengkapi KYC
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Runner Aktif Hari Ini</CardTitle>
                <CardDescription>Sedang online menerima order</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">87</div>
            <div className="text-xs text-slate-400">
              Median rating runner: 4,82
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kelola Pengguna</CardTitle>
          <CardDescription>
            Tambah, ubah, dan hapus data user langsung dari Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Nama Lengkap
              </label>
              <Input
                placeholder="Nama user"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Email
              </label>
              <Input
                type="email"
                placeholder="user@kampus.ac.id"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Role
              </label>
              <select
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200"
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Status
              </label>
              <select
                className="h-9 w-full rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200"
                value={isActive ? "active" : "inactive"}
                onChange={(event) => setIsActive(event.target.value === "active")}
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
            <div className="flex items-end gap-2 md:col-span-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 bg-emerald-500 text-xs font-semibold text-slate-950 hover:bg-emerald-400"
              >
                {isEditMode ? "Simpan Perubahan" : "Tambah User"}
              </Button>
              {isEditMode && (
                <Button
                  type="button"
                  className="h-9 border border-slate-700 bg-transparent text-xs text-slate-200 hover:bg-slate-900/60"
                  onClick={resetForm}
                >
                  Batal Edit
                </Button>
              )}
              {formError && (
                <div className="text-xs text-rose-300">{formError}</div>
              )}
            </div>
          </form>

          <div className="overflow-x-auto">
            {error && (
              <div className="mb-3 rounded-md border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-xs text-rose-200">
                Gagal memuat data user: {error.message}
              </div>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-xs text-slate-400">
                      Memuat data pengguna...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading &&
                  users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-slate-50">
                        {user.full_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {ROLE_LABEL[user.role] ?? user.role}
                      </TableCell>
                      <TableCell>
                        {user.is_active ? (
                          <Badge className="bg-emerald-500/10 text-emerald-300">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-800 text-slate-300">
                            Nonaktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="space-x-2 text-right">
                        <Button
                          type="button"
                          className="h-7 border border-slate-700 bg-transparent px-2 text-[11px] text-slate-200 hover:bg-slate-900/60"
                          onClick={() => handleEdit(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          className="h-7 border border-rose-500/60 bg-transparent px-2 text-[11px] text-rose-300 hover:bg-rose-500/10"
                          onClick={() => handleDelete(user.id)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                {!isLoading && users && users.length === 0 && !error && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-xs text-slate-400">
                      Belum ada data pengguna. Tambahkan user baru melalui form
                      di atas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
