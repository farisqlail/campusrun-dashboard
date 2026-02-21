"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Wallet, Clock3, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import { getSupabaseClient } from "@/lib/supabase";
import type { Disbursement, DisbursementStatus } from "@/lib/types";

type DashboardDisbursementRow = {
  id: string;
  code: string;
  runner: string;
  bank: string;
  accountNumber: string;
  amount: number;
  fee: number;
  status: DisbursementStatus;
  createdAt: string;
};

type DisbursementWithRunner = Disbursement & {
  runner?: { full_name?: string | null } | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DisbursementsPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: disbursements,
    error,
    isLoading,
  } = useSWR<DashboardDisbursementRow[]>(
    "dashboard-disbursements",
    async () => {
      const { data, error } = await supabase
        .from("disbursements")
        .select(
          `
          id,
          runner_id,
          amount,
          bank_name,
          account_number,
          status,
          created_at,
          runner:users(full_name)
        `
        )
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      const typedRows = (data ?? []) as unknown as DisbursementWithRunner[];

      return typedRows.map((row) => {
        const runnerName =
          row.runner && typeof row.runner.full_name === "string"
            ? row.runner.full_name
            : "-";

        const accountNumber =
          typeof row.account_number === "string" &&
          row.account_number.length >= 4
            ? `**** ${row.account_number.slice(-4)}`
            : row.account_number ?? "-";

        const code = `DB-${row.id.slice(0, 8).toUpperCase()}`;

        return {
          id: row.id,
          code,
          runner: runnerName,
          bank: row.bank_name,
          accountNumber,
          amount: Number(row.amount),
          fee: 0,
          status: row.status,
          createdAt: row.created_at,
        };
      });
    }
  );

  const totalDisbursement =
    disbursements?.reduce((sum, item) => sum + item.amount, 0) ?? 0;

  const pendingApprovalCount =
    disbursements?.filter(
      (item) => item.status === "pending" || item.status === "processing"
    ).length ?? 0;

  const successThisMonthCount =
    disbursements?.filter((item) => item.status === "success").length ?? 0;

  const totalDisbursementLabel = formatCurrency(totalDisbursement);
  const pendingApprovalLabel = pendingApprovalCount.toLocaleString("id-ID");
  const successThisMonthLabel = successThisMonthCount.toLocaleString("id-ID");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Disbursement
          </h1>
          <p className="text-sm text-slate-400">
            Pantau semua pencairan saldo runner ke rekening bank.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Pencairan Hari Ini"
          value={totalDisbursementLabel}
          helperText="Total pencairan yang tercatat"
          icon={<Wallet className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Pending Approval"
          value={pendingApprovalLabel}
          helperText="Perlu dicek KYC dan aktivitas"
          icon={<Clock3 className="h-4 w-4" />}
          accent="amber"
        />
        <StatCard
          title="Berhasil Bulan Ini"
          value={successThisMonthLabel}
          helperText="Pencairan dengan status success"
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="sky"
        />
      </div>

      <FilterBar>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Status</option>
          <option>Pending</option>
          <option>Processing</option>
          <option>Success</option>
          <option>Failed</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Bank</option>
          <option>BCA</option>
          <option>Mandiri</option>
          <option>BNI</option>
          <option>BRI</option>
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar Disbursement</CardTitle>
          <ExportButton
            filename="disbursements.csv"
            rows={
              disbursements?.map((item) => ({
                id: item.id,
                code: item.code,
                runner: item.runner,
                bank: item.bank,
                account_number: item.accountNumber,
                amount: item.amount,
                fee: item.fee,
                status: item.status,
                created_at: item.createdAt,
              })) ?? []
            }
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                key: "code",
                header: "Kode",
                sortable: true,
              },
              {
                key: "runner",
                header: "Runner",
                sortable: true,
              },
              {
                key: "bank",
                header: "Bank",
              },
              {
                key: "accountNumber",
                header: "No Rekening",
              },
              {
                key: "amount",
                header: "Jumlah",
                sortable: true,
                render: (row) => formatCurrency(row.amount),
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <StatusBadge kind="disbursement" value={row.status} />
                ),
              },
              {
                key: "createdAt",
                header: "Tanggal",
                sortable: true,
              },
            ]}
            data={disbursements ?? []}
            searchPlaceholder="Cari kode pencairan atau nama runner..."
            pageSize={10}
          />
          {isLoading && (
            <p className="mt-3 text-xs text-slate-400">
              Memuat data disbursement dari Supabase...
            </p>
          )}
          {error && (
            <p className="mt-3 text-xs text-rose-300">
              Gagal memuat data disbursement: {error.message}
            </p>
          )}
          {!isLoading &&
            !error &&
            disbursements &&
            disbursements.length === 0 && (
              <p className="mt-3 text-xs text-slate-400">
                Belum ada data disbursement di Supabase.
              </p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
