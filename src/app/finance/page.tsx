import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
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

const sampleTransactions = [
  {
    code: "INV-2025-0001",
    method: "qris",
    gateway: "Xendit",
    amount: 52000,
    status: "paid",
  },
  {
    code: "INV-2025-0002",
    method: "gopay",
    gateway: "Midtrans",
    amount: 74000,
    status: "pending",
  },
  {
    code: "INV-2025-0003",
    method: "bank_transfer",
    gateway: "Xendit",
    amount: 150000,
    status: "failed",
  },
];

const sampleDisbursements = [
  {
    code: "DB-2025-0008",
    runner: "Rizky Pratama",
    bank: "BCA",
    amount: 450000,
    status: "processing",
  },
  {
    code: "DB-2025-0009",
    runner: "Nadia Rahma",
    bank: "Mandiri",
    amount: 210000,
    status: "success",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

const transactionStatus: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

const transactionStatusColor: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300",
  paid: "bg-emerald-500/10 text-emerald-300",
  failed: "bg-rose-500/10 text-rose-300",
  refunded: "bg-slate-800 text-slate-300",
};

const paymentMethodLabel: Record<string, string> = {
  qris: "QRIS",
  gopay: "GoPay",
  ovo: "OVO",
  dana: "DANA",
  bank_transfer: "Bank Transfer",
};

const disbursementStatus: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  success: "Success",
  failed: "Failed",
};

const disbursementStatusColor: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-300",
  processing: "bg-sky-500/10 text-sky-300",
  success: "bg-emerald-500/10 text-emerald-300",
  failed: "bg-rose-500/10 text-rose-300",
};

export default function FinancePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Finance & Settlement
          </h1>
          <p className="text-sm text-slate-400">
            Pantau arus masuk transaksi dan pencairan saldo runner.
          </p>
        </div>
        <Badge className="bg-slate-900/80 text-[11px] text-slate-300">
          Modul: transaksi, disbursement, dan saldo platform.
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>GMV Hari Ini</CardTitle>
                <CardDescription>Nominal semua order</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">
              {formatCurrency(8150000)}
            </div>
            <div className="text-xs text-slate-400">
              Platform commission: {formatCurrency(3150000)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transaksi Berhasil</CardTitle>
                <CardDescription>Gateway pembayaran</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-300">
                <ArrowDownLeft className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">162</div>
            <div className="text-xs text-slate-400">
              Success rate: 97,1%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Disbursement Hari Ini</CardTitle>
                <CardDescription>Pencairan ke runner</CardDescription>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-50">
              {formatCurrency(1240000)}
            </div>
            <div className="text-xs text-slate-400">
              9 request pending approval admin
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sample Data Transaksi</CardTitle>
            <CardDescription>
              Diambil dari tabel transactions dan terkait dengan orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Transaksi</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleTransactions.map((tx) => (
                    <TableRow key={tx.code}>
                      <TableCell className="font-medium text-slate-50">
                        {tx.code}
                      </TableCell>
                      <TableCell>
                        {paymentMethodLabel[tx.method] ?? tx.method}
                      </TableCell>
                      <TableCell>{tx.gateway}</TableCell>
                      <TableCell>{formatCurrency(tx.amount)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            transactionStatusColor[tx.status]
                          }`}
                        >
                          {transactionStatus[tx.status]}
                        </span>
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
            <CardTitle>Sample Data Disbursement</CardTitle>
            <CardDescription>
              Diambil dari tabel disbursements dan terkait dengan runner.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Runner</TableHead>
                    <TableHead>Bank</TableHead>
                    <TableHead>Nominal</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleDisbursements.map((db) => (
                    <TableRow key={db.code}>
                      <TableCell className="font-medium text-slate-50">
                        {db.code}
                      </TableCell>
                      <TableCell>{db.runner}</TableCell>
                      <TableCell>{db.bank}</TableCell>
                      <TableCell>{formatCurrency(db.amount)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            disbursementStatusColor[db.status]
                          }`}
                        >
                          {disbursementStatus[db.status]}
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
    </div>
  );
}

