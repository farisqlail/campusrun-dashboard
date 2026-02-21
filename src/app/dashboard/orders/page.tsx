"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import { getSupabaseClient } from "@/lib/supabase";
import type { Order, OrderStatus, ServiceType } from "@/lib/types";

type DashboardOrderRow = {
  id: string;
  code: string;
  requester: string;
  runner: string | null;
  university: string;
  serviceType: ServiceType | null;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
};

type OrderWithJoins = Order & {
  requester?: { full_name?: string | null } | null;
  runner?: { full_name?: string | null } | null;
  university?: { name?: string | null } | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function OrdersPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: orders,
    error,
    isLoading,
  } = useSWR<DashboardOrderRow[]>("dashboard-orders", async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_code,
        requester_id,
        runner_id,
        university_id,
        service_type,
        total_amount,
        status,
        created_at,
        requester:users!orders_requester_id_fkey(full_name),
        runner:users!orders_runner_id_fkey(full_name),
        university:universities(name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const typedRows = (data ?? []) as unknown as OrderWithJoins[];

    return typedRows.map((row) => {
      const requesterName =
        row.requester && typeof row.requester.full_name === "string"
          ? row.requester.full_name
          : "-";

      const runnerName =
        row.runner && typeof row.runner.full_name === "string"
          ? row.runner.full_name
          : null;

      const universityName =
        row.university && typeof row.university.name === "string"
          ? row.university.name
          : "-";

      return {
        id: row.id,
        code: row.order_code,
        requester: requesterName,
        runner: runnerName,
        university: universityName,
        serviceType: row.service_type,
        totalAmount: Number(row.total_amount),
        status: row.status,
        createdAt: row.created_at,
      };
    });
  });

  const activeOrdersCount =
    orders?.filter((order) =>
      ["open", "taken", "on_process"].includes(order.status)
    ).length ?? 0;

  const problematicOrdersCount =
    orders?.filter((order) =>
      ["disputed", "cancelled"].includes(order.status)
    ).length ?? 0;

  const totalOrders = orders?.length ?? 0;
  const completedOrdersCount =
    orders?.filter((order) => order.status === "completed").length ?? 0;
  const cancelledOrdersCount =
    orders?.filter((order) => order.status === "cancelled").length ?? 0;

  const completionRate =
    totalOrders > 0 ? (completedOrdersCount / totalOrders) * 100 : 0;

  const activeOrdersLabel = activeOrdersCount.toLocaleString("id-ID");
  const problematicOrdersLabel = problematicOrdersCount.toLocaleString("id-ID");
  const completionRateLabel = `${completionRate.toLocaleString("id-ID", {
    maximumFractionDigits: 1,
  })}%`;
  const cancelledOrdersLabel = cancelledOrdersCount.toLocaleString("id-ID");

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
          value={activeOrdersLabel}
          helperText="SLA median: 18 menit"
          icon={<Package className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Order Bermasalah"
          description="Dispute dan berisiko gagal"
          value={problematicOrdersLabel}
          helperText="Perlu eskalasi support"
          icon={<AlertTriangle className="h-4 w-4" />}
          accent="amber"
        />
        <StatCard
          title="Completion Rate"
          description="Order terselesaikan"
          value={completionRateLabel}
          helperText={`Cancel hari ini: ${cancelledOrdersLabel} order`}
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
            rows={
              orders?.map((order) => ({
                id: order.id,
                code: order.code,
                requester: order.requester,
                runner: order.runner,
                university: order.university,
                service_type: order.serviceType,
                total_amount: order.totalAmount,
                status: order.status,
                created_at: order.createdAt,
              })) ?? []
            }
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
            data={orders ?? []}
            searchPlaceholder="Cari kode order atau nama requester..."
            pageSize={10}
          />
          {isLoading && (
            <p className="mt-3 text-xs text-slate-400">
              Memuat data order dari Supabase...
            </p>
          )}
          {error && (
            <p className="mt-3 text-xs text-rose-300">
              Gagal memuat data order: {error.message}
            </p>
          )}
          {!isLoading && !error && orders && orders.length === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Belum ada data order di Supabase.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
