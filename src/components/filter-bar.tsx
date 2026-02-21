'use client';

import { ReactNode } from "react";
import { Input } from "@/components/ui/input";

type FilterBarProps = {
  children?: ReactNode;
  showDateRange?: boolean;
};

export function FilterBar({ children, showDateRange = true }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      {showDateRange ? (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden md:inline">Periode:</span>
          <Input type="date" className="h-8 w-32 text-xs" />
          <span className="text-slate-500">s/d</span>
          <Input type="date" className="h-8 w-32 text-xs" />
        </div>
      ) : null}
    </div>
  );
}

