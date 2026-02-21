'use client';

import { GraduationCap, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { ExportButton } from "@/components/export-button";

const universities = [
  {
    id: "u1",
    name: "Universitas Indonesia",
    city: "Depok",
    province: "Jawa Barat",
    totalUsers: 1230,
    activeOrdersToday: 54,
  },
  {
    id: "u2",
    name: "Institut Teknologi Bandung",
    city: "Bandung",
    province: "Jawa Barat",
    totalUsers: 980,
    activeOrdersToday: 42,
  },
  {
    id: "u3",
    name: "Universitas Gadjah Mada",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    totalUsers: 840,
    activeOrdersToday: 39,
  },
];

export default function UniversitiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Universitas
          </h1>
          <p className="text-sm text-slate-400">
            Atur daftar kampus aktif, kota, dan performa operasional per kampus.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Universitas Aktif"
          value="12"
          helperText="Dengan minimal 10 order per hari"
          icon={<GraduationCap className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Kota Tercover"
          value="7"
          helperText="Target ekspansi: 4 kota baru"
          icon={<MapPin className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Total User"
          value="4.230"
          helperText="Mahasiswa requester dan runner"
          icon={<Users className="h-4 w-4" />}
          accent="violet"
        />
      </div>

      <FilterBar showDateRange={false}>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Provinsi</option>
          <option>Jawa Barat</option>
          <option>DKI Jakarta</option>
          <option>DI Yogyakarta</option>
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar Universitas</CardTitle>
          <ExportButton
            filename="universities.csv"
            rows={universities.map((university) => ({
              id: university.id,
              name: university.name,
              city: university.city,
              province: university.province,
              total_users: university.totalUsers,
              active_orders_today: university.activeOrdersToday,
            }))}
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                key: "name",
                header: "Nama Universitas",
                sortable: true,
              },
              {
                key: "city",
                header: "Kota",
                sortable: true,
              },
              {
                key: "province",
                header: "Provinsi",
                sortable: true,
              },
              {
                key: "totalUsers",
                header: "Total User",
                sortable: true,
              },
              {
                key: "activeOrdersToday",
                header: "Order Hari Ini",
                sortable: true,
              },
            ]}
            data={universities}
            searchPlaceholder="Cari nama universitas..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
