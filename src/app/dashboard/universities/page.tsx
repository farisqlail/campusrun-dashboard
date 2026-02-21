"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { GraduationCap, MapPin, Users } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { ExportButton } from "@/components/export-button";
import { getSupabaseClient } from "@/lib/supabase";
import type { University } from "@/lib/types";

type DashboardUniversityRow = {
  id: string;
  name: string;
  city: string;
  province: string;
  totalUsers: number;
  activeOrdersToday: number;
};

export default function UniversitiesPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: universities,
    error,
    isLoading,
  } = useSWR<DashboardUniversityRow[]>("dashboard-universities", async () => {
    const { data, error } = await supabase
      .from("universities")
      .select("id, name, city, province, total_users")
      .order("name", { ascending: true });

    if (error) {
      throw error;
    }

    const typedRows = (data ?? []) as Array<
      Pick<University, "id" | "name" | "city" | "province" | "total_users">
    >;

    return typedRows.map((row) => ({
      id: row.id,
      name: row.name,
      city: row.city,
      province: row.province,
      totalUsers: row.total_users,
      activeOrdersToday: 0,
    }));
  });

  const totalUniversities = universities?.length ?? 0;
  const coveredCities = new Set(
    (universities ?? []).map((univ) => univ.city)
  ).size;
  const totalUsers =
    universities?.reduce((sum, univ) => sum + univ.totalUsers, 0) ?? 0;

  const totalUniversitiesLabel = totalUniversities.toLocaleString("id-ID");
  const coveredCitiesLabel = coveredCities.toLocaleString("id-ID");
  const totalUsersLabel = totalUsers.toLocaleString("id-ID");

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
          value={totalUniversitiesLabel}
          helperText="Terdaftar di sistem"
          icon={<GraduationCap className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Kota Tercover"
          value={coveredCitiesLabel}
          helperText="Target ekspansi: 4 kota baru"
          icon={<MapPin className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Total User"
          value={totalUsersLabel}
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
            rows={
              universities?.map((university) => ({
                id: university.id,
                name: university.name,
                city: university.city,
                province: university.province,
                total_users: university.totalUsers,
                active_orders_today: university.activeOrdersToday,
              })) ?? []
            }
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
            data={universities ?? []}
            searchPlaceholder="Cari nama universitas..."
            pageSize={10}
          />
          {isLoading && (
            <p className="mt-3 text-xs text-slate-400">
              Memuat data universitas dari Supabase...
            </p>
          )}
          {error && (
            <p className="mt-3 text-xs text-rose-300">
              Gagal memuat data universitas: {error.message}
            </p>
          )}
          {!isLoading && !error && universities && universities.length === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Belum ada data universitas di Supabase.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
