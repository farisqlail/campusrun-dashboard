import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

type UserDetailPageProps = {
  params: {
    id: string;
  };
};

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const userId = params.id;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-50 md:text-2xl">
          Detail User
        </h1>
        <p className="text-sm text-slate-400">
          Profil lengkap, riwayat order, dan review untuk user {userId}.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-slate-400">Nama Lengkap</div>
              <div className="text-slate-50">Nadia Rahma</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Email</div>
              <div className="text-slate-50">nadia@ui.ac.id</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-400">Universitas</div>
                <div className="text-slate-50">Universitas Indonesia</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Fakultas</div>
                <div className="text-slate-50">Ilmu Komputer</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-slate-400">Role</div>
                <div className="text-slate-50">Requester</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Status Akun</div>
                <StatusBadge kind="report" value="resolved" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Aktivitas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Order sebagai Requester</div>
              <div className="text-lg font-semibold text-slate-50">18</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Order sebagai Runner</div>
              <div className="text-lg font-semibold text-slate-50">0</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Total Transaksi</div>
              <div className="text-lg font-semibold text-slate-50">
                Rp 1.250.000
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Saldo Saat Ini</div>
              <div className="text-lg font-semibold text-slate-50">Rp 75.000</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Order</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            Placeholder riwayat order. Nanti akan diisi dari tabel orders dengan
            filter requester_id dan runner_id.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review yang Diterima</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-400">
            Placeholder review. Data diambil dari tabel reviews dengan reviewee_id
            sama dengan user ini.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

