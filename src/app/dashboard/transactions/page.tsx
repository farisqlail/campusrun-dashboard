'use client';

import { Receipt, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import type { TransactionStatus } from "@/lib/types";

const transactions: Array<{
  id: string;
  code: string;
  orderCode: string;
  user: string;
  type: string;
  method: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
}> = [
  {
    id: "t1",
    code: "TRX-2025-0001",
    orderCode: "CR-2025-0018",
    user: "Nadia Rahma",
    type: "topup",
    method: "midtrans",
    amount: 100000,
    status: "paid",
    createdAt: "2025-02-18 09:50",
  },
  {
    id: "t2",
    code: "TRX-2025-0002",
    orderCode: "CR-2025-0019",
    user: "Bima Setiawan",
    type: "order_payment",
    method: "xendit",
    amount: 26000,
    status: "pending",
    createdAt: "2025-02-18 10:01",
  },
  {
    id: "t3",
    code: "TRX-2025-0003",
    orderCode: "CR-2025-0020",
    user: "Andi Kurniawan",
    type: "order_payment",
    method: "ovo",
    amount: 35000,
    status: "failed",
    createdAt: "2025-02-18 10:05",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function TransactionsPage() {
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
          value={formatCurrency(4350000)}
          helperText="Termasuk top-up dan pembayaran order"
          icon={<Receipt className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Top-up Berhasil"
          value="124"
          helperText="Gateway: Midtrans, Xendit, E-Wallet"
          icon={<ArrowDownCircle className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Refund / Failed"
          value="7"
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
            rows={transactions.map((transaction) => ({
              id: transaction.id,
              code: transaction.code,
              order_code: transaction.orderCode,
              user: transaction.user,
              type: transaction.type,
              method: transaction.method,
              amount: transaction.amount,
              status: transaction.status,
              created_at: transaction.createdAt,
            }))}
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
            data={transactions}
            searchPlaceholder="Cari kode transaksi atau user..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
