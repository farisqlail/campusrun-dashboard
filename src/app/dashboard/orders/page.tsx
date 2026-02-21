import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import type { OrderStatus } from "@/lib/types";

const orders: Array<{
  id: string;
  code: string;
  requester: string;
  runner: string | null;
  university: string;
  serviceType: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}> = [
  {
    id: "o1",
    code: "CR-2025-0018",
    requester: "Nadia Rahma",
    runner: "Rizky Pratama",
    university: "UI Depok",
    serviceType: "food",
    totalAmount: 48000,
    status: "completed",
    createdAt: "2025-02-18 10:12",
  },
  {
    id: "o2",
    code: "CR-2025-0019",
    requester: "Bima Setiawan",
    runner: "Putri Lestari",
    university: "ITB Ganesha",
    serviceType: "print",
    totalAmount: 26000,
    status: "on_process",
    createdAt: "2025-02-18 10:09",
  },
  {
    id: "o3",
    code: "CR-2025-0020",
    requester: "Andi Kurniawan",
    runner: null,
    university: "UGM Bulaksumur",
    serviceType: "document",
    totalAmount: 35000,
    status: "open",
    createdAt: "2025-02-18 09:51",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Order
          </h1>
          <p className="text-sm text-slate-400">
            Pantau semua order dan lakukan intervensi jika terjadi kendala.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Order Aktif"
          description="Open • Taken • On process"
          value="32"
          helperText="SLA median: 18 menit"
          icon={<Package className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Order Bermasalah"
          description="Dispute dan berisiko gagal"
          value="4"
          helperText="Perlu eskalasi support"
          icon={<AlertTriangle className="h-4 w-4" />}
          accent="amber"
        />
        <StatCard
          title="Completion Rate"
          description="Order terselesaikan"
          value="93,4%"
          helperText="Cancel hari ini: 7 order"
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="emerald"
        />
      </div>

      <FilterBar>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Status (semua)</option>
          <option>Open</option>
          <option>Taken</option>
          <option>On Process</option>
          <option>Delivered</option>
          <option>Completed</option>
          <option>Cancelled</option>
          <option>Disputed</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Service Type (semua)</option>
          <option>Food</option>
          <option>Print</option>
          <option>Dokumen</option>
          <option>Koperasi</option>
          <option>Lainnya</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Kampus (semua)</option>
          <option>UI Depok</option>
          <option>ITB Ganesha</option>
          <option>UGM Bulaksumur</option>
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar Order</CardTitle>
          <ExportButton
            filename="orders.csv"
            rows={orders.map((order) => ({
              id: order.id,
              code: order.code,
              requester: order.requester,
              runner: order.runner,
              university: order.university,
              service_type: order.serviceType,
              total_amount: order.totalAmount,
              status: order.status,
              created_at: order.createdAt,
            }))}
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                key: "code",
                header: "Kode Order",
                sortable: true,
              },
              {
                key: "requester",
                header: "Requester",
                sortable: true,
              },
              {
                key: "runner",
                header: "Runner",
                render: (row) => row.runner ?? "-",
              },
              {
                key: "university",
                header: "Kampus",
                sortable: true,
              },
              {
                key: "serviceType",
                header: "Layanan",
              },
              {
                key: "totalAmount",
                header: "Total",
                sortable: true,
                render: (row) => formatCurrency(row.totalAmount),
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <StatusBadge kind="order" value={row.status} />
                ),
              },
              {
                key: "createdAt",
                header: "Tanggal",
                sortable: true,
              },
            ]}
            data={orders}
            searchPlaceholder="Cari kode order atau nama requester..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
