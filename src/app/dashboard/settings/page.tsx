"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Settings, Bell, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getSupabaseClient } from "@/lib/supabase";
import type { SystemSettings } from "@/lib/types";

export default function SettingsPage() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const {
    data: settings,
    error,
    isLoading,
    mutate,
  } = useSWR<SystemSettings | null>("system-settings", async () => {
    const { data, error } = await supabase
      .from("system_settings")
      .select(
        `
        id,
        platform_name,
        support_email,
        daily_summary_enabled,
        report_notification_enabled,
        enforce_admin_2fa,
        auto_logout_enabled
      `
      );

    if (error) {
      throw error;
    }

    const row = data?.[0] as SystemSettings | undefined;
    return row ?? null;
  });

  const [platformName, setPlatformName] = useState("CampusRun");
  const [supportEmail, setSupportEmail] = useState("support@campusrun.com");
  const [dailySummaryEnabled, setDailySummaryEnabled] = useState(true);
  const [reportNotificationEnabled, setReportNotificationEnabled] =
    useState(true);
  const [enforceAdmin2fa, setEnforceAdmin2fa] = useState(true);
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setPlatformName(settings.platform_name ?? "CampusRun");
      setSupportEmail(settings.support_email ?? "support@campusrun.com");
      setDailySummaryEnabled(
        typeof settings.daily_summary_enabled === "boolean"
          ? settings.daily_summary_enabled
          : true
      );
      setReportNotificationEnabled(
        typeof settings.report_notification_enabled === "boolean"
          ? settings.report_notification_enabled
          : true
      );
      setEnforceAdmin2fa(
        typeof settings.enforce_admin_2fa === "boolean"
          ? settings.enforce_admin_2fa
          : true
      );
      setAutoLogoutEnabled(
        typeof settings.auto_logout_enabled === "boolean"
          ? settings.auto_logout_enabled
          : true
      );
    }
  }, [settings]);

  async function handleSave() {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const payload = {
      platform_name: platformName,
      support_email: supportEmail,
      daily_summary_enabled: dailySummaryEnabled,
      report_notification_enabled: reportNotificationEnabled,
      enforce_admin_2fa: enforceAdmin2fa,
      auto_logout_enabled: autoLogoutEnabled,
    };

    try {
      if (settings && settings.id) {
        const { error } = await supabase
          .from("system_settings")
          .update(payload)
          .eq("id", settings.id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from("system_settings")
          .insert(payload);

        if (error) {
          throw error;
        }
      }

      await mutate();
      setSaveSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan pengaturan.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
            Pengaturan Sistem
          </h1>
          <p className="text-sm text-slate-400">
            Atur konfigurasi global dashboard dan platform CampusRun.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-400" />
              <CardTitle className="text-sm">General</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Nama Platform</label>
              <Input
                className="h-9 text-xs"
                value={platformName}
                onChange={(event) => setPlatformName(event.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">
                Email Support Utama
              </label>
              <Input
                className="h-9 text-xs"
                value={supportEmail}
                onChange={(event) => setSupportEmail(event.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="mt-2 h-9 px-3 text-xs"
                type="button"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              {saveSuccess && (
                <span className="mt-2 text-[11px] text-emerald-300">
                  Pengaturan tersimpan.
                </span>
              )}
              {saveError && (
                <span className="mt-2 text-[11px] text-rose-300">
                  {saveError}
                </span>
              )}
            </div>
            {isLoading && !settings && (
              <p className="text-[11px] text-slate-500">
                Memuat pengaturan dari Supabase...
              </p>
            )}
            {error && (
              <p className="text-[11px] text-rose-300">
                Gagal memuat pengaturan: {error.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-400" />
                <CardTitle className="text-sm">Notifikasi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-200">
                    Email ringkasan harian
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Kirim ringkasan performa harian ke admin.
                  </div>
                </div>
                <Switch
                  checked={dailySummaryEnabled}
                  onCheckedChange={setDailySummaryEnabled}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-200">
                    Notifikasi laporan baru
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Kirim notifikasi ketika ada laporan fraud atau dispute.
                  </div>
                </div>
                <Switch
                  checked={reportNotificationEnabled}
                  onCheckedChange={setReportNotificationEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                <CardTitle className="text-sm">Keamanan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-200">
                    Wajib 2FA untuk admin
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Semua admin harus mengaktifkan autentikasi dua faktor.
                  </div>
                </div>
                <Switch
                  checked={enforceAdmin2fa}
                  onCheckedChange={setEnforceAdmin2fa}
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-slate-200">
                    Auto-logout setelah idle
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Logout otomatis setelah 30 menit tidak ada aktivitas.
                  </div>
                </div>
                <Switch
                  checked={autoLogoutEnabled}
                  onCheckedChange={setAutoLogoutEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

