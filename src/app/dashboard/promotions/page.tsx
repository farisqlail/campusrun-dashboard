'use client';

import { Percent, Users, Rocket } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { ExportButton } from "@/components/export-button";

const promotions = [
  {
    id: "p1",
    name: "Free Delivery UI",
    type: "free_delivery",
    target: "Universitas Indonesia",
    budget: 500000,
    used: 320000,
    status: "active",
  },
  {
    id: "p2",
    name: "Diskon 20% Runner Baru",
    type: "percentage",
    target: "Runner baru 7 hari",
    budget: 700000,
    used: 210000,
    status: "scheduled",
  },
  {
    id: "p3",
    name: "Voucher 10k Mahasiswa Baru",
    type: "fixed_amount",
    target: "Mahasiswa angkatan 2025",
    budget: 1000000,
    used: 250000,
    status: "ended",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PromotionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Manajemen Promosi
          </h1>
          <p className="text-sm text-slate-400">
            Atur campaign promosi, budget, dan target user per kampus.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Budget Bulan Ini"
          value={formatCurrency(22000000)}
          helperText="Termasuk voucher dan free delivery"
          icon={<Percent className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Klaim Voucher"
          value="1.240"
          helperText="CTR rata-rata: 8,2%"
          icon={<Users className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Active Campaign"
          value="4"
          helperText="Di 3 universitas"
          icon={<Rocket className="h-4 w-4" />}
          accent="violet"
        />
      </div>

      <FilterBar showDateRange={false}>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Status</option>
          <option>Active</option>
          <option>Scheduled</option>
          <option>Ended</option>
        </select>
        <select className="h-8 rounded-md border border-slate-800 bg-slate-950 px-2 text-xs text-slate-200">
          <option>Tipe</option>
          <option>Free delivery</option>
          <option>Percentage</option>
          <option>Fixed amount</option>
        </select>
      </FilterBar>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle className="text-sm">Daftar Promosi</CardTitle>
          <ExportButton
            filename="promotions.csv"
            rows={promotions.map((promotion) => ({
              id: promotion.id,
              name: promotion.name,
              type: promotion.type,
              target: promotion.target,
              budget: promotion.budget,
              used: promotion.used,
              status: promotion.status,
            }))}
          />
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              {
                key: "name",
                header: "Nama Campaign",
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
                key: "target",
                header: "Target",
              },
              {
                key: "budget",
                header: "Budget",
                sortable: true,
                render: (row) => formatCurrency(row.budget),
              },
              {
                key: "used",
                header: "Terpakai",
                sortable: true,
                render: (row) => formatCurrency(row.used),
              },
              {
                key: "status",
                header: "Status",
              },
            ]}
            data={promotions}
            searchPlaceholder="Cari nama campaign..."
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
}
