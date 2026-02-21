import { FileWarning, ShieldAlert, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import type { ReportStatus } from "@/lib/types";

const reports: Array<{
  id: string;
  code: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}> = [
  {
    id: "r1",
    code: "RP-0012",
    reporter: "Nadia Rahma",
    reportedUser: "Rizky Pratama",
    reason: "fraud",
    status: "open",
    createdAt: "2025-02-18 10:23",
  },
  {
    id: "r2",
    code: "RP-0013",
    reporter: "Bima Setiawan",
    reportedUser: "Agus Saputra",
    reason: "item_missing",
    status: "investigating",
    createdAt: "2025-02-18 09:11",
  },
  {
    id: "r3",
    code: "RP-0014",
    reporter: "Putri Lestari",
    reportedUser: "Rizky Pratama",
    reason: "fake_completion",
    status: "resolved",
    createdAt: "2025-02-17 22:03",
  },
];

export default function ReportsPage() {
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
          value="9"
          helperText="Open dan sedang investigasi"
          icon={<FileWarning className="h-4 w-4" />}
          accent="amber"
        />
        <StatCard
          title="Resolved 30 Hari"
          value="42"
          helperText="Diselesaikan tanpa eskalasi hukum"
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="User di-banned"
          value="14"
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
            rows={reports.map((report) => ({
              id: report.id,
              code: report.code,
              reporter: report.reporter,
              reported_user: report.reportedUser,
              reason: report.reason,
              status: report.status,
              created_at: report.createdAt,
            }))}
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
            data={reports}
            searchPlaceholder="Cari laporan atau nama user..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
