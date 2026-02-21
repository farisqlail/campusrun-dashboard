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

const sampleUsers = [
  {
    name: "Nadia Rahma",
    role: "requester",
    university: "Universitas Indonesia",
    isVerified: true,
    isRunnerOnline: false,
    totalOrders: 18,
  },
  {
    name: "Rizky Pratama",
    role: "runner",
    university: "Institut Teknologi Bandung",
    isVerified: true,
    isRunnerOnline: true,
    totalOrders: 73,
  },
  {
    name: "Putri Lestari",
    role: "both",
    university: "Universitas Gadjah Mada",
    isVerified: false,
    isRunnerOnline: false,
    totalOrders: 9,
  },
];

const roleLabel: Record<string, string> = {
  requester: "Requester",
  runner: "Runner",
  both: "Requester + Runner",
};

export default function UsersPage() {
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
          <CardTitle>Sample Data Pengguna</CardTitle>
          <CardDescription>
            Tabel ini nantinya diganti dengan data langsung dari Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Universitas</TableHead>
                  <TableHead>Status Verifikasi</TableHead>
                  <TableHead>Total Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleUsers.map((user) => (
                  <TableRow key={user.name}>
                    <TableCell className="font-medium text-slate-50">
                      {user.name}
                    </TableCell>
                    <TableCell>{roleLabel[user.role] ?? user.role}</TableCell>
                    <TableCell>{user.university}</TableCell>
                    <TableCell>
                      {user.isVerified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-300">
                          Terverifikasi
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/10 text-amber-300">
                          Perlu review
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{user.totalOrders}</TableCell>
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

