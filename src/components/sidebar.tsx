'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  GraduationCap,
  Wallet,
  Receipt,
  FileWarning,
  Percent,
  Shield,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: Package,
  },
  {
    label: "Transactions",
    href: "/dashboard/transactions",
    icon: Receipt,
  },
  {
    label: "Disbursements",
    href: "/dashboard/disbursements",
    icon: Wallet,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    icon: FileWarning,
  },
  {
    label: "Universities",
    href: "/dashboard/universities",
    icon: GraduationCap,
  },
  {
    label: "Promotions",
    href: "/dashboard/promotions",
    icon: Percent,
  },
  {
    label: "Admins",
    href: "/dashboard/admins",
    icon: Shield,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/80 px-4 py-6 md:flex">
      <div className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-semibold text-slate-950">
          CR
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-50">CampusRun</span>
          <span className="text-xs text-slate-400">Admin Dashboard</span>
        </div>
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-50",
                isActive && "bg-slate-900 text-slate-50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span className="font-medium text-slate-200">Environment</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
            Production-ready
          </span>
        </div>
        <p className="mt-2">
          Pantau aktivitas marketplace hyperlocal CampusRun secara real-time.
        </p>
      </div>
    </aside>
  );
}
