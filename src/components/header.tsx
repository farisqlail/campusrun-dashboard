'use client';

import { Search, Bell, UserCircle, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  function handleLogout() {
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <div className="relative hidden items-center md:flex">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Cari user, order, transaksi..."
            className="h-9 w-72 pl-9"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-50">
            Dashboard Admin
          </span>
          <span className="text-xs text-slate-400">
            Ringkasan operasional marketplace hari ini
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-200">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-emerald-500 px-0.5 text-[10px] font-semibold text-slate-950">
            3
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-2 py-1">
            <UserCircle className="h-5 w-5 text-slate-300" />
            <div className="hidden flex-col text-xs leading-tight md:flex">
              <span className="font-medium text-slate-50">Super Admin</span>
              <span className="text-slate-400">campusrun@admin.com</span>
            </div>
            <Badge className="ml-1 bg-emerald-500/10 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
              Online
            </Badge>
          </div>
          <Button
            type="button"
            className="flex h-8 items-center gap-1 border border-slate-700 bg-transparent px-2 text-[11px] text-slate-200 hover:bg-slate-900"
            onClick={handleLogout}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
