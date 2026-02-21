import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(function TableComponent({ className, ...props }, ref) {
  return (
    <table
      ref={ref}
      className={cn("w-full border-collapse text-sm text-slate-200", className)}
      {...props}
    />
  );
});

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableHeaderComponent({ className, ...props }, ref) {
  return (
    <thead
      ref={ref}
      className={cn("bg-slate-900/60 text-xs uppercase text-slate-400", className)}
      {...props}
    />
  );
});

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(function TableBodyComponent({ className, ...props }, ref) {
  return (
    <tbody
      ref={ref}
      className={cn("divide-y divide-slate-800", className)}
      {...props}
    />
  );
});

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(function TableRowComponent({ className, ...props }, ref) {
  return (
    <tr
      ref={ref}
      className={cn(
        "transition-colors hover:bg-slate-900/60 data-[status=open]:bg-amber-500/5 data-[status=completed]:bg-emerald-500/5 data-[status=cancelled]:bg-rose-500/5",
        className
      )}
      {...props}
    />
  );
});

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(function TableHeadComponent({ className, ...props }, ref) {
  return (
    <th
      ref={ref}
      className={cn(
        "px-3 py-2 text-left font-medium text-slate-400 first:rounded-l-lg last:rounded-r-lg",
        className
      )}
      {...props}
    />
  );
});

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(function TableCellComponent({ className, ...props }, ref) {
  return (
    <td
      ref={ref}
      className={cn("px-3 py-2 align-middle text-sm text-slate-200", className)}
      {...props}
    />
  );
});

