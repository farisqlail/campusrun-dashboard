'use client';

import { useMemo } from "react";
import useSWR from "swr";
import { Users, CheckCircle2, ShieldCheck, Ban } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import { getSupabaseClient } from "@/lib/supabase";
import type { User } from "@/lib/types";

type DashboardUserRow = {
  id: string;
  name: string;
  email: string;
  university: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
};

type UserWithUniversity = User & {
  university?: { name?: string | null }[] | null;
};

export default function UsersPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: users,
    error,
    isLoading,
  } = useSWR<DashboardUserRow[]>("dashboard-users", async () => {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        id,
        full_name,
        email,
        role,
        is_active,
        is_verified,
        created_at,
        university:universities(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const typedRows = (data ?? []) as unknown as UserWithUniversity[];

    return typedRows.map((row) => {
      const universityName =
        Array.isArray(row.university) &&
        typeof row.university[0]?.name === "string"
          ? row.university[0]!.name!
          : "-";

      return {
        id: row.id,
        name: row.full_name,
        email: row.email,
        university: universityName,
        role: row.role,
        isVerified: Boolean(row.is_verified ?? false),
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
      };
    });
  });
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen User
          </h1>
          <p className="text-sm text-slate-400">
            Kelola akun requester dan runner, verifikasi identitas, dan status
            keaktifan.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total User Terdaftar"
          value="4.230"
          helperText="Sejak awal operasi"
          icon={<Users className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="KTM Terverifikasi"
          value="1.890"
          helperText="Runner butuh verifikasi: 94"
          icon={<ShieldCheck className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Akun Disuspend"
          value="14"
          helperText="Karena fraud atau abuse"
          icon={<Ban className="h-4 w-4" />}
          accent="amber"
        />
      </div>

      <FilterBar>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Semua Kampus</option>
          <option>Universitas Indonesia</option>
          <option>Institut Teknologi Bandung</option>
          <option>Universitas Gadjah Mada</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Semua Role</option>
          <option>Requester</option>
          <option>Runner</option>
          <option>Requester + Runner</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Verifikasi (semua)</option>
          <option>Hanya terverifikasi</option>
          <option>Perlu review</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Status akun (semua)</option>
          <option>Aktif</option>
          <option>Disuspend</option>
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar User</CardTitle>
          <ExportButton
            filename="users.csv"
            rows={
              users?.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                university: user.university,
                role: user.role,
                is_verified: user.isVerified,
                is_active: user.isActive,
                created_at: user.createdAt,
              })) ?? []
            }
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                key: "name",
                header: "Nama",
                sortable: true,
                render: (row) => (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-50">
                      {row.name}
                    </span>
                    <span className="text-xs text-slate-400">{row.email}</span>
                  </div>
                ),
              },
              {
                key: "university",
                header: "Kampus",
                sortable: true,
              },
              {
                key: "role",
                header: "Role",
                sortable: true,
                render: (row) => (
                  <span className="text-xs capitalize text-slate-200">
                    {row.role}
                  </span>
                ),
              },
              {
                key: "isVerified",
                header: "Verifikasi",
                render: (row) =>
                  row.isVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-300">
                      <ShieldCheck className="h-3 w-3" />
                      Perlu review
                    </span>
                  ),
              },
              {
                key: "isActive",
                header: "Status",
                render: (row) => (
                  <StatusBadge
                    kind="report"
                    value={row.isActive ? "resolved" : "dismissed"}
                  />
                ),
              },
              {
                key: "createdAt",
                header: "Tanggal Daftar",
                sortable: true,
              },
            ]}
            data={users ?? []}
            searchPlaceholder="Cari nama atau email..."
            pageSize={10}
          />
          {isLoading && (
            <p className="mt-3 text-xs text-slate-400">
              Memuat data user dari Supabase...
            </p>
          )}
          {error && (
            <p className="mt-3 text-xs text-rose-300">
              Gagal memuat data user: {error.message}
            </p>
          )}
          {!isLoading && !error && users && users.length === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Belum ada data user di Supabase.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
