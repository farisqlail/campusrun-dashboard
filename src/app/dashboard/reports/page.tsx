"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { FileWarning, ShieldAlert, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import { getSupabaseClient } from "@/lib/supabase";
import type { Report, ReportStatus, ReportReason } from "@/lib/types";

type DashboardReportRow = {
  id: string;
  code: string;
  reporter: string;
  reportedUser: string;
  reason: ReportReason | null;
  status: ReportStatus;
  createdAt: string;
};

type ReportWithJoins = Report & {
  reporter?: { full_name?: string | null } | null;
  reported_user?: { full_name?: string | null } | null;
};

export default function ReportsPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: reports,
    error,
    isLoading,
  } = useSWR<DashboardReportRow[]>("dashboard-reports", async () => {
    const { data, error } = await supabase
      .from("reports")
      .select(
        `
        id,
        reporter_id,
        reported_user_id,
        reason,
        status,
        created_at,
        reporter:users!reports_reporter_id_fkey(full_name),
        reported_user:users!reports_reported_user_id_fkey(full_name)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const typedRows = (data ?? []) as unknown as ReportWithJoins[];

    return typedRows.map((row) => {
      const reporterName =
        row.reporter && typeof row.reporter.full_name === "string"
          ? row.reporter.full_name
          : "-";

      const reportedUserName =
        row.reported_user && typeof row.reported_user.full_name === "string"
          ? row.reported_user.full_name
          : "-";

      const code = `RP-${row.id.slice(0, 8).toUpperCase()}`;

      return {
        id: row.id,
        code,
        reporter: reporterName,
        reportedUser: reportedUserName,
        reason: row.reason,
        status: row.status,
        createdAt: row.created_at,
      };
    });
  });

  const activeReportsCount =
    reports?.filter(
      (report) => report.status === "open" || report.status === "investigating"
    ).length ?? 0;

  const resolvedReportsCount =
    reports?.filter((report) => report.status === "resolved").length ?? 0;

  const bannedUsersCount =
    reports?.filter(
      (report) =>
        report.status === "resolved" &&
        (report.reason === "fraud" || report.reason === "harassment")
    ).length ?? 0;

  const activeReportsLabel = activeReportsCount.toLocaleString("id-ID");
  const resolvedReportsLabel = resolvedReportsCount.toLocaleString("id-ID");
  const bannedUsersLabel = bannedUsersCount.toLocaleString("id-ID");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Laporan
          </h1>
          <p className="text-sm text-slate-400">
            Kelola laporan fraud, dispute, dan pelanggaran komunitas.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Laporan Aktif"
          value={activeReportsLabel}
          helperText="Open dan sedang investigasi"
          icon={<FileWarning className="h-4 w-4" />}
          accent="amber"
        />
        <StatCard
          title="Resolved 30 Hari"
          value={resolvedReportsLabel}
          helperText="Diselesaikan tanpa eskalasi hukum"
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="User di-banned"
          value={bannedUsersLabel}
          helperText="Karena pelanggaran berat"
          icon={<ShieldAlert className="h-4 w-4" />}
          accent="sky"
        />
      </div>

      <FilterBar showDateRange={false}>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Status</option>
          <option>Open</option>
          <option>Investigating</option>
          <option>Resolved</option>
          <option>Dismissed</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Kategori</option>
          <option>Fraud</option>
          <option>Harassment</option>
          <option>Item missing</option>
          <option>Lainnya</option>
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar Laporan</CardTitle>
          <ExportButton
            filename="reports.csv"
            rows={
              reports?.map((report) => ({
                id: report.id,
                code: report.code,
                reporter: report.reporter,
                reported_user: report.reportedUser,
                reason: report.reason,
                status: report.status,
                created_at: report.createdAt,
              })) ?? []
            }
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                key: "code",
                header: "ID Laporan",
                sortable: true,
              },
              {
                key: "reporter",
                header: "Pelapor",
                sortable: true,
              },
              {
                key: "reportedUser",
                header: "Terlapor",
                sortable: true,
              },
              {
                key: "reason",
                header: "Reason",
              },
              {
                key: "status",
                header: "Status",
                render: (row) => (
                  <StatusBadge kind="report" value={row.status} />
                ),
              },
              {
                key: "createdAt",
                header: "Tanggal",
                sortable: true,
              },
            ]}
            data={reports ?? []}
            searchPlaceholder="Cari laporan atau nama user..."
            pageSize={10}
          />
          {isLoading && (
            <p className="mt-3 text-xs text-slate-400">
              Memuat data laporan dari Supabase...
            </p>
          )}
          {error && (
            <p className="mt-3 text-xs text-rose-300">
              Gagal memuat data laporan: {error.message}
            </p>
          )}
          {!isLoading && !error && reports && reports.length === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Belum ada data laporan di Supabase.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
