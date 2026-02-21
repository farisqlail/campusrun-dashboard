import { Shield, UserPlus, Activity } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { ExportButton } from "@/components/export-button";

const admins = [
  {
    id: "a1",
    name: "Super Admin",
    email: "super@campusrun.com",
    role: "super_admin",
    lastLoginAt: "2025-02-18 08:10",
  },
  {
    id: "a2",
    name: "Finance Admin",
    email: "finance@campusrun.com",
    role: "finance_admin",
    lastLoginAt: "2025-02-18 09:31",
  },
  {
    id: "a3",
    name: "Support Admin",
    email: "support@campusrun.com",
    role: "support_admin",
    lastLoginAt: "2025-02-18 09:50",
  },
];

export default function AdminsPage() {
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
          value="6"
          helperText="Termasuk super admin"
          icon={<Shield className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Admin Aktif Hari Ini"
          value="4"
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
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Role</option>
          <option>Super Admin</option>
          <option>Finance Admin</option>
          <option>Support Admin</option>
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar Admin</CardTitle>
          <ExportButton
            filename="admins.csv"
            rows={admins.map((admin) => ({
              id: admin.id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
              last_login_at: admin.lastLoginAt,
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
                    {row.role.replace("_", " ")}
                  </span>
                ),
              },
              {
                key: "lastLoginAt",
                header: "Login Terakhir",
                sortable: true,
              },
            ]}
            data={admins}
            searchPlaceholder="Cari nama admin..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}

