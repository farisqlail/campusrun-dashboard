"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Receipt, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import { getSupabaseClient } from "@/lib/supabase";
import type { Transaction, TransactionStatus } from "@/lib/types";

type DashboardTransactionRow = {
  id: string;
  code: string;
  orderCode: string;
  user: string;
  type: string;
  method: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
};

type TransactionWithJoins = Transaction & {
  order?: { order_code?: string | null } | null;
  user?: { full_name?: string | null } | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TransactionsPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: transactions,
    error,
    isLoading,
  } = useSWR<DashboardTransactionRow[]>("dashboard-transactions", async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        id,
        order_id,
        user_id,
        transaction_code,
        payment_method,
        payment_gateway,
        amount,
        status,
        created_at,
        order:orders(order_code),
        user:users(full_name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const typedRows = (data ?? []) as unknown as TransactionWithJoins[];

    return typedRows.map((row) => {
      const hasOrder = Boolean(row.order_id);
      const status = row.status;

      let type: string;
      if (status === "refunded") {
        type = "refund";
      } else {
        type = hasOrder ? "order_payment" : "topup";
      }

      const method =
        row.payment_method ?? row.payment_gateway ?? "unknown";

      const orderCode =
        row.order && typeof row.order.order_code === "string"
          ? row.order.order_code
          : "-";

      const userName =
        row.user && typeof row.user.full_name === "string"
          ? row.user.full_name
          : "-";

      return {
        id: row.id,
        code: row.transaction_code ?? "-",
        orderCode,
        user: userName,
        type,
        method,
        amount: row.amount,
        status: row.status,
        createdAt: row.created_at,
      };
    });
  });

  const totalVolume =
    transactions?.reduce((sum, trx) => sum + trx.amount, 0) ?? 0;

  const totalTopupPaid =
    transactions?.filter(
      (trx) => trx.type === "topup" && trx.status === "paid"
    ).length ?? 0;

  const totalRefundFailed =
    transactions?.filter(
      (trx) => trx.status === "failed" || trx.status === "refunded"
    ).length ?? 0;

  const totalVolumeLabel = formatCurrency(totalVolume);
  const totalTopupPaidLabel = totalTopupPaid.toLocaleString("id-ID");
  const totalRefundFailedLabel = totalRefundFailed.toLocaleString("id-ID");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Transaksi
          </h1>
          <p className="text-sm text-slate-400">
            Monitor semua transaksi top-up, pembayaran order, dan refund.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Volume Transaksi Hari Ini"
          value={totalVolumeLabel}
          helperText="Termasuk top-up dan pembayaran order"
          icon={<Receipt className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Top-up Berhasil"
          value={totalTopupPaidLabel}
          helperText="Gateway: Midtrans, Xendit, E-Wallet"
          icon={<ArrowDownCircle className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Refund / Failed"
          value={totalRefundFailedLabel}
          helperText="Perlu cek lebih lanjut"
          icon={<ArrowUpCircle className="h-4 w-4" />}
          accent="amber"
        />
      </div>

      <FilterBar>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Tipe Transaksi</option>
          <option>Top-up</option>
          <option>Pembayaran Order</option>
          <option>Refund</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Status</option>
          <option>Pending</option>
          <option>Paid</option>
          <option>Failed</option>
          <option>Refunded</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Payment Method</option>
          <option>Midtrans</option>
          <option>Xendit</option>
          <option>OVO</option>
          <option>GoPay</option>
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar Transaksi</CardTitle>
          <ExportButton
            filename="transactions.csv"
            rows={
              transactions?.map((transaction) => ({
                id: transaction.id,
                code: transaction.code,
                order_code: transaction.orderCode,
                user: transaction.user,
                type: transaction.type,
                method: transaction.method,
                amount: transaction.amount,
                status: transaction.status,
                created_at: transaction.createdAt,
              })) ?? []
            }
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                key: "code",
                header: "Kode Transaksi",
                sortable: true,
              },
              {
                key: "orderCode",
                header: "Kode Order",
              },
              {
                key: "user",
                header: "User",
                sortable: true,
              },
              {
                key: "type",
                header: "Tipe",
                render: (row) => (
                  <span className="text-xs capitalize text-slate-200">
                    {row.type.replace("_", " ")}
                  </span>
                ),
              },
              {
                key: "method",
                header: "Metode",
                sortable: true,
              },
              {
                key: "amount",
                header: "Nominal",
                sortable: true,
                render: (row) => formatCurrency(row.amount),
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <StatusBadge kind="transaction" value={row.status} />
                ),
              },
              {
                key: "createdAt",
                header: "Tanggal",
                sortable: true,
              },
            ]}
            data={transactions ?? []}
            searchPlaceholder="Cari kode transaksi atau user..."
            pageSize={10}
          />
          {isLoading && (
            <p className="mt-3 text-xs text-slate-400">
              Memuat data transaksi dari Supabase...
            </p>
          )}
          {error && (
            <p className="mt-3 text-xs text-rose-300">
              Gagal memuat data transaksi: {error.message}
            </p>
          )}
          {!isLoading &&
            !error &&
            transactions &&
            transactions.length === 0 && (
              <p className="mt-3 text-xs text-slate-400">
                Belum ada data transaksi di Supabase.
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
