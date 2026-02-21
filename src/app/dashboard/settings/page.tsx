import { Settings, Bell, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
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
              <Input className="h-9 text-xs" defaultValue="CampusRun" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">
                Email Support Utama
              </label>
              <Input
                className="h-9 text-xs"
                defaultValue="support@campusrun.com"
              />
            </div>
            <Button className="mt-2 h-9 px-3 text-xs" type="button">
              Simpan Perubahan
            </Button>
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
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
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

