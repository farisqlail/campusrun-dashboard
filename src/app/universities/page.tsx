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

const sampleUniversities = [
  {
    name: "Universitas Indonesia",
    city: "Depok",
    province: "Jawa Barat",
    isActive: true,
    totalUsers: 820,
    totalOrders: 1420,
  },
  {
    name: "Institut Teknologi Bandung",
    city: "Bandung",
    province: "Jawa Barat",
    isActive: true,
    totalUsers: 640,
    totalOrders: 1180,
  },
  {
    name: "Universitas Gadjah Mada",
    city: "Yogyakarta",
    province: "DI Yogyakarta",
    isActive: false,
    totalUsers: 0,
    totalOrders: 0,
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
            <div className="text-2xl font-semibold text-slate-50">24</div>
            <div className="text-xs text-slate-400">
              12 universitas sudah aktif
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
            <div className="text-2xl font-semibold text-slate-50">10</div>
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
            <div className="text-2xl font-semibold text-slate-50">12</div>
            <div className="text-xs text-slate-400">
              3 kampus menunggu verifikasi kerjasama
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample Data Universitas</CardTitle>
          <CardDescription>
            Nantinya diambil dari tabel universities dan dihubungkan ke orders
            dan users.
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
                  <TableHead>Total Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleUniversities.map((univ) => (
                  <TableRow key={univ.name}>
                    <TableCell className="font-medium text-slate-50">
                      {univ.name}
                    </TableCell>
                    <TableCell>{univ.city}</TableCell>
                    <TableCell>{univ.province}</TableCell>
                    <TableCell>
                      {univ.isActive ? (
                        <Badge className="bg-emerald-500/10 text-emerald-300">
                          Aktif
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-800 text-slate-300">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{univ.totalUsers}</TableCell>
                    <TableCell>{univ.totalOrders}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

