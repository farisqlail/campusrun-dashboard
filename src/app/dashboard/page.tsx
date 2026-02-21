import { TrendingUp, Users, Package, Wallet, AlertCircle } from "lucide-react";
import { StatCard } from "@/components/stat-card";
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
import { OrdersChart } from "@/components/dashboard/orders-chart";
import { RevenueBarChart } from "@/components/dashboard/revenue-bar-chart";
import { ServiceTypePieChart } from "@/components/dashboard/service-type-pie-chart";
import { StatusBadge } from "@/components/status-badge";
import type { OrderStatus, ReportStatus } from "@/lib/types";

const latestOrders: Array<{
  code: string;
  university: string;
  serviceType: string;
  totalAmount: number;
  status: OrderStatus;
}> = [
  {
    code: "CR-2025-0018",
    university: "UI Depok",
    serviceType: "food",
    totalAmount: 48000,
    status: "completed",
  },
  {
    code: "CR-2025-0019",
    university: "ITB Ganesha",
    serviceType: "print",
    totalAmount: 26000,
    status: "on_process",
  },
  {
    code: "CR-2025-0020",
    university: "UGM Bulaksumur",
    serviceType: "document",
    totalAmount: 35000,
    status: "open",
  },
  {
    code: "CR-2025-0021",
    university: "Binus Alam Sutera",
    serviceType: "food",
    totalAmount: 52000,
    status: "cancelled",
  },
  {
    code: "CR-2025-0022",
    university: "IPB Dramaga",
    serviceType: "koperasi",
    totalAmount: 31000,
    status: "delivered",
  },
];

const pendingReports: Array<{
  id: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}> = [
  {
    id: "RP-0012",
    reporter: "Nadia Rahma",
    reportedUser: "Rizky Pratama",
    reason: "fraud",
    status: "open",
    createdAt: "2025-02-18 10:23",
  },
  {
    id: "RP-0013",
    reporter: "Bima Setiawan",
    reportedUser: "Agus Saputra",
    reason: "item_missing",
    status: "investigating",
    createdAt: "2025-02-18 09:11",
  },
  {
    id: "RP-0014",
    reporter: "Putri Lestari",
    reportedUser: "Rizky Pratama",
    reason: "fake_completion",
    status: "open",
    createdAt: "2025-02-17 22:03",
  },
  {
    id: "RP-0015",
    reporter: "Andi Kurniawan",
    reportedUser: "Unknown",
    reason: "other",
    status: "open",
    createdAt: "2025-02-17 19:44",
  },
  {
    id: "RP-0016",
    reporter: "Sari Dewi",
    reportedUser: "Iqbal Ramadhan",
    reason: "harassment",
    status: "investigating",
    createdAt: "2025-02-17 18:29",
  },
];

const pendingDisbursements = [
  {
    id: "DB-2025-0010",
    runner: "Rizky Pratama",
    bank: "BCA",
    amount: 450000,
  },
  {
    id: "DB-2025-0011",
    runner: "Nadia Rahma",
    bank: "Mandiri",
    amount: 210000,
  },
  {
    id: "DB-2025-0012",
    runner: "Bima Setiawan",
    bank: "BNI",
    amount: 165000,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            Ringkasan operasional CampusRun di semua universitas.
          </p>
        </div>
        <Badge className="bg-emerald-500/10 text-[11px] font-semibold uppercase tracking-wide text-emerald-300">
          Real-time monitoring marketplace hyperlocal antar mahasiswa
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Order Hari Ini"
          description="Semua universitas"
          value="178"
          helperText="+23 vs kemarin"
          icon={<Package className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Revenue Hari Ini"
          description="Commission + service fee"
          value={formatCurrency(3150000)}
          helperText="+18% vs rata-rata"
          icon={<Wallet className="h-4 w-4" />}
          accent="violet"
        />
        <StatCard
          title="User Aktif"
          description="30 hari terakhir"
          value="2.340"
          helperText="38% dari total terdaftar"
          icon={<Users className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Order Sedang Berjalan"
          description="Open • Taken • On process"
          value="32"
          helperText="4 dalam status dispute"
          icon={<TrendingUp className="h-4 w-4" />}
          accent="amber"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2.1fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pertumbuhan Order 7 Hari Terakhir</CardTitle>
                <CardDescription>Jumlah order per hari</CardDescription>
              </div>
              <Badge className="bg-slate-900/80 text-[11px] text-slate-300">
                Peak: Jumat • 18.00
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <OrdersChart />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Revenue 7 Hari Terakhir</CardTitle>
                  <CardDescription>
                    Nilai commission dan service fee per hari
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <RevenueBarChart />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Distribusi Tipe Layanan</CardTitle>
                  <CardDescription>Order 7 hari terakhir</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ServiceTypePieChart />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order Terbaru</CardTitle>
                <CardDescription>5 order terakhir masuk sistem</CardDescription>
              </div>
              <Badge className="bg-slate-900/80 text-[11px] text-slate-300">
                SLA median: 16 menit
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Universitas</TableHead>
                    <TableHead>Tipe Layanan</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestOrders.map((order) => (
                    <TableRow key={order.code} data-status={order.status}>
                      <TableCell className="font-medium text-slate-50">
                        {order.code}
                      </TableCell>
                      <TableCell>{order.university}</TableCell>
                      <TableCell>{order.serviceType}</TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell className="text-right">
                        <StatusBadge kind="order" value={order.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Laporan Belum Terselesaikan</CardTitle>
                  <CardDescription>5 laporan terakhir</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pelapor</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium text-slate-50">
                          {report.id}
                        </TableCell>
                        <TableCell>{report.reporter}</TableCell>
                        <TableCell>{report.reason}</TableCell>
                        <TableCell>
                          <StatusBadge kind="report" value={report.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-300" />
                  <div>
                    <CardTitle>Disbursement Pending</CardTitle>
                    <CardDescription>
                      Permintaan pencairan yang menunggu aksi admin
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingDisbursements.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-slate-900/70 px-3 py-2 text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-50">
                      {item.runner}
                    </span>
                    <span className="text-slate-400">
                      {item.bank} • {item.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-emerald-300">
                      {formatCurrency(item.amount)}
                    </div>
                    <span className="text-[11px] text-amber-300">
                      Menunggu proses
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

