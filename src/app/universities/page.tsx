import { GraduationCap, MapPinned, CheckCircle2 } from "lucide-react";
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
import { getSupabaseClient } from "@/lib/supabase";
import type { University } from "@/lib/types";

export default async function UniversitiesPage() {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("universities")
    .select("id, name, city, province, is_active, total_users")
    .order("name", { ascending: true });

  const universities = (data ?? []) as Array<
    Pick<
      University,
      "id" | "name" | "city" | "province" | "is_active" | "total_users"
    >
  >;

  const totalUniversities = universities.length;
  const activeUniversities = universities.filter(
    (univ) => univ.is_active
  ).length;
  const coveredCities = new Set(universities.map((univ) => univ.city)).size;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Universitas
          </h1>
          <p className="text-sm text-slate-400">
            Atur kampus yang sudah onboard, status aktivasi, dan performa
            marketplace.
          </p>
        </div>
        <Badge className="bg-slate-900/80 text-[11px] text-slate-300">
          Modul: aktivasi kampus, logo, dan pengaturan hyperlocal.
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Total Universitas</CardTitle>
                <CardDescription>Terdaftar di sistem</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                <GraduationCap className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">
              {totalUniversities}
            </div>
            <div className="text-xs text-slate-400">
              {activeUniversities} universitas sudah aktif
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Kota Ter-cover</CardTitle>
                <CardDescription>Domisili kampus</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
                <MapPinned className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">
              {coveredCities}
            </div>
            <div className="text-xs text-slate-400">
              Fokus awal: Jabodetabek, Bandung, Jogja
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Onboarding Selesai</CardTitle>
                <CardDescription>Siap menerima order</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">
              {activeUniversities}
            </div>
            <div className="text-xs text-slate-400">
              {totalUniversities - activeUniversities} kampus menunggu aktivasi
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Universitas</CardTitle>
          <CardDescription>
            Diambil langsung dari tabel universities di Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Universitas</TableHead>
                  <TableHead>Kota</TableHead>
                  <TableHead>Provinsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pengguna</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {universities.map((univ) => (
                  <TableRow key={univ.id}>
                    <TableCell className="font-medium text-slate-50">
                      {univ.name}
                    </TableCell>
                    <TableCell>{univ.city}</TableCell>
                    <TableCell>{univ.province}</TableCell>
                    <TableCell>
                      {univ.is_active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-300">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-800 text-slate-300">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{univ.total_users}</TableCell>
                  </TableRow>
                ))}
                {universities.length === 0 && !error && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-xs text-slate-400"
                    >
                      Belum ada data universitas di Supabase.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {error && (
              <p className="mt-3 text-xs text-rose-300">
                Gagal memuat data universitas: {error.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
