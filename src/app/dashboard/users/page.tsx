import { Users, CheckCircle2, ShieldCheck, Ban } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";

const users = [
  {
    id: "u1",
    name: "Nadia Rahma",
    email: "nadia@ui.ac.id",
    university: "Universitas Indonesia",
    role: "requester",
    isVerified: true,
    isActive: true,
    createdAt: "2025-01-03",
  },
  {
    id: "u2",
    name: "Rizky Pratama",
    email: "rizky@itb.ac.id",
    university: "Institut Teknologi Bandung",
    role: "runner",
    isVerified: true,
    isActive: true,
    createdAt: "2025-01-08",
  },
  {
    id: "u3",
    name: "Putri Lestari",
    email: "putri@ugm.ac.id",
    university: "Universitas Gadjah Mada",
    role: "both",
    isVerified: false,
    isActive: true,
    createdAt: "2025-01-15",
  },
  {
    id: "u4",
    name: "Andi Kurniawan",
    email: "andi@binus.ac.id",
    university: "Binus University",
    role: "requester",
    isVerified: true,
    isActive: false,
    createdAt: "2025-01-21",
  },
];

export default function UsersPage() {
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
            rows={users.map((user) => ({
              id: user.id,
              name: user.name,
              email: user.email,
              university: user.university,
              role: user.role,
              is_verified: user.isVerified,
              is_active: user.isActive,
              created_at: user.createdAt,
            }))}
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
            data={users}
            searchPlaceholder="Cari nama atau email..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}

