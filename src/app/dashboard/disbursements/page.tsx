import { Wallet, Clock3, CheckCircle2 } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { StatusBadge } from "@/components/status-badge";
import { ExportButton } from "@/components/export-button";
import type { DisbursementStatus } from "@/lib/types";

const disbursements: Array<{
  id: string;
  code: string;
  runner: string;
  bank: string;
  accountNumber: string;
  amount: number;
  fee: number;
  status: DisbursementStatus;
  createdAt: string;
}> = [
  {
    id: "d1",
    code: "DB-2025-0010",
    runner: "Rizky Pratama",
    bank: "BCA",
    accountNumber: "**** 1234",
    amount: 450000,
    fee: 4000,
    status: "pending",
    createdAt: "2025-02-18 09:10",
  },
  {
    id: "d2",
    code: "DB-2025-0011",
    runner: "Nadia Rahma",
    bank: "Mandiri",
    accountNumber: "**** 5678",
    amount: 210000,
    fee: 4000,
    status: "processing",
    createdAt: "2025-02-18 09:05",
  },
  {
    id: "d3",
    code: "DB-2025-0012",
    runner: "Bima Setiawan",
    bank: "BNI",
    accountNumber: "**** 9876",
    amount: 165000,
    fee: 4000,
    status: "success",
    createdAt: "2025-02-18 08:55",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DisbursementsPage() {
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
          value={formatCurrency(735000)}
          helperText="3 disbursement berhasil"
          icon={<Wallet className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Pending Approval"
          value="6"
          helperText="Perlu dicek KYC dan aktivitas"
          icon={<Clock3 className="h-4 w-4" />}
          accent="amber"
        />
        <StatCard
          title="Berhasil Bulan Ini"
          value="124"
          helperText="Tanpa gagal dari bank"
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
            rows={disbursements.map((item) => ({
              id: item.id,
              code: item.code,
              runner: item.runner,
              bank: item.bank,
              account_number: item.accountNumber,
              amount: item.amount,
              fee: item.fee,
              status: item.status,
              created_at: item.createdAt,
            }))}
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
            data={disbursements}
            searchPlaceholder="Cari kode pencairan atau nama runner..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
