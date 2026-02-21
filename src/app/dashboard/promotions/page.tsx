"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Percent, Users, Rocket } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/data-table";
import { FilterBar } from "@/components/filter-bar";
import { ExportButton } from "@/components/export-button";
import { getSupabaseClient } from "@/lib/supabase";
import type { Promotion, PromotionType } from "@/lib/types";

type PromotionStatus = "active" | "scheduled" | "ended";

type DashboardPromotionRow = {
  id: string;
  name: string;
  type: PromotionType;
  target: string;
  budget: number;
  used: number;
  status: PromotionStatus;
};

type PromotionWithTarget = Promotion & {
  target_description?: string | null;
  budget?: number | null;
  used_amount?: number | null;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PromotionsPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: promotions,
    error,
    isLoading,
  } = useSWR<DashboardPromotionRow[]>("dashboard-promotions", async () => {
    const { data, error } = await supabase
      .from("promotions")
      .select(
        `
        id,
        code,
        title,
        type,
        value,
        is_percentage,
        min_transaction,
        max_usage,
        used_count,
        expired_at,
        is_active,
        target_description,
        budget,
        used_amount
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const typedRows = (data ?? []) as unknown as PromotionWithTarget[];

    return typedRows.map((row) => {
      let status: PromotionStatus = "scheduled";
      const now = new Date();
      const expiredAt = row.expired_at ? new Date(row.expired_at) : null;

      if (row.is_active) {
        if (!expiredAt || expiredAt >= now) {
          status = "active";
        } else {
          status = "ended";
        }
      } else if (expiredAt && expiredAt < now) {
        status = "ended";
      }

      const budget = typeof row.budget === "number" ? row.budget : row.value;
      const used = typeof row.used_amount === "number" ? row.used_amount : 0;

      return {
        id: row.id,
        name: row.title,
        type: row.type,
        target: row.target_description ?? "-",
        budget,
        used,
        status,
      };
    });
  });

  const totalBudget =
    promotions?.reduce((sum, promo) => sum + promo.budget, 0) ?? 0;

  const totalClaims =
    promotions?.reduce((sum, promo) => sum + promo.used, 0) ?? 0;

  const activeCampaigns =
    promotions?.filter((promo) => promo.status === "active").length ?? 0;

  const totalBudgetLabel = formatCurrency(totalBudget);
  const totalClaimsLabel = totalClaims.toLocaleString("id-ID");
  const activeCampaignsLabel = activeCampaigns.toLocaleString("id-ID");

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
          value={totalBudgetLabel}
          helperText="Termasuk voucher dan free delivery"
          icon={<Percent className="h-4 w-4" />}
          accent="emerald"
        />
        <StatCard
          title="Klaim Voucher"
          value={totalClaimsLabel}
          helperText="CTR rata-rata: 8,2%"
          icon={<Users className="h-4 w-4" />}
          accent="sky"
        />
        <StatCard
          title="Active Campaign"
          value={activeCampaignsLabel}
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
            rows={
              promotions?.map((promotion) => ({
                id: promotion.id,
                name: promotion.name,
                type: promotion.type,
                target: promotion.target,
                budget: promotion.budget,
                used: promotion.used,
                status: promotion.status,
              })) ?? []
            }
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
            data={promotions ?? []}
            searchPlaceholder="Cari nama campaign..."
            pageSize={10}
          />
          {isLoading && (
            <p className="mt-3 text-xs text-slate-400">
              Memuat data promosi dari Supabase...
            </p>
          )}
          {error && (
            <p className="mt-3 text-xs text-rose-300">
              Gagal memuat data promosi: {error.message}
            </p>
          )}
          {!isLoading && !error && promotions && promotions.length === 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Belum ada data promosi di Supabase.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
