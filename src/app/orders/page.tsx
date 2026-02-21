import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
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

const sampleOrders = [
  {
    code: "CR-2025-0012",
    university: "Universitas Indonesia",
    serviceType: "food",
    pickup: "Kantin Fasilkom",
    delivery: "Kost Margonda",
    status: "completed",
  },
  {
    code: "CR-2025-0013",
    university: "Institut Teknologi Bandung",
    serviceType: "print",
    pickup: "Print Shop Kutub",
    delivery: "Gedung CC Barat",
    status: "on_process",
  },
  {
    code: "CR-2025-0014",
    university: "Universitas Gadjah Mada",
    serviceType: "document",
    pickup: "Rektorat",
    delivery: "Fakultas Kedokteran",
    status: "open",
  },
];

const statusLabel: Record<string, string> = {
  open: "Open",
  taken: "Taken",
  on_process: "On Process",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

const statusColor: Record<string, string> = {
  open: "bg-amber-500/10 text-amber-300",
  taken: "bg-sky-500/10 text-sky-300",
  on_process: "bg-sky-500/10 text-sky-300",
  delivered: "bg-emerald-500/10 text-emerald-300",
  completed: "bg-emerald-500/10 text-emerald-300",
  cancelled: "bg-rose-500/10 text-rose-300",
  disputed: "bg-rose-500/10 text-rose-300",
};

const serviceTypeLabel: Record<string, string> = {
  food: "Food Delivery",
  print: "Print & Fotokopi",
  document: "Dokumen Kampus",
  koperasi: "Koperasi",
  other: "Lainnya",
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Order
          </h1>
          <p className="text-sm text-slate-400">
            Monitor lifecycle order dari status open hingga completed atau
            cancelled.
          </p>
        </div>
        <Badge className="bg-slate-900/80 text-[11px] text-slate-300">
          Modul: monitoring SLA, dispute handling, dan pembatalan oleh admin.
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order Aktif</CardTitle>
                <CardDescription>Open, taken, on process</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
                <Package className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">32</div>
            <div className="text-xs text-slate-400">
              SLA median pengantaran: 18 menit
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order Bermasalah</CardTitle>
                <CardDescription>Dispute dan berisiko gagal</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">4</div>
            <div className="text-xs text-slate-400">
              Perlu eskalasi tim operasional
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Completion Rate</CardTitle>
                <CardDescription>Order berhasil diselesaikan</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">
              93,4%
            </div>
            <div className="text-xs text-slate-400">
              Cancelled hari ini: 7 order
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sample Data Order Aktif</CardTitle>
          <CardDescription>
            Nantinya terhubung ke tabel orders, order_proofs, dan chats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Order</TableHead>
                  <TableHead>Universitas</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Pickup</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleOrders.map((order) => (
                  <TableRow key={order.code} data-status={order.status}>
                    <TableCell className="font-medium text-slate-50">
                      {order.code}
                    </TableCell>
                    <TableCell>{order.university}</TableCell>
                    <TableCell>
                      {serviceTypeLabel[order.serviceType] ?? order.serviceType}
                    </TableCell>
                    <TableCell>{order.pickup}</TableCell>
                    <TableCell>{order.delivery}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColor[order.status]
                        }`}
                      >
                        {statusLabel[order.status]}
                      </span>
                    </TableCell>
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

