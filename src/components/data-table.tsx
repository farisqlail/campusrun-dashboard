'use client';

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Column<T> = {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  emptyMessage?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Cari...",
  pageSize = 10,
  emptyMessage = "Data tidak tersedia.",
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredAndSorted = useMemo(() => {
    let rows = data;

    if (search) {
      const query = search.toLowerCase();
      rows = rows.filter((row) =>
        Object.values(row).some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        )
      );
    }

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];

        if (av == null && bv == null) return 0;
        if (av == null) return 1;
        if (bv == null) return -1;

        if (typeof av === "number" && typeof bv === "number") {
          return sortDirection === "asc" ? av - bv : bv - av;
        }

        const as = String(av);
        const bs = String(bv);
        if (as === bs) return 0;
        if (sortDirection === "asc") return as > bs ? 1 : -1;
        return as < bs ? 1 : -1;
      });
    }

    return rows;
  }, [data, search, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const rows = filteredAndSorted.slice(start, start + pageSize);

  function handleSort(key: keyof T, sortable?: boolean) {
    if (!sortable) return;
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection("asc");
  }

  return (
    <div className="space-y-3">
      {searchable ? (
        <div className="flex items-center justify-between gap-3">
          <Input
            placeholder={searchPlaceholder}
            className="h-9 max-w-xs"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />
          <div className="text-xs text-slate-500">
            Menampilkan {rows.length} dari {filteredAndSorted.length} baris
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={String(column.key)}
                  onClick={() => handleSort(column.key, column.sortable)}
                  className={column.sortable ? "cursor-pointer select-none" : ""}
                >
                  <div className="flex items-center gap-1">
                    <span>{column.header}</span>
                    {sortKey === column.key ? (
                      <span className="text-[10px] text-slate-400">
                        {sortDirection === "asc" ? "▲" : "▼"}
                      </span>
                    ) : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <span className="text-sm text-slate-400">{emptyMessage}</span>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.render ? column.render(row) : String(row[column.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
          <span>
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              className="h-7 px-2 text-xs"
              disabled={currentPage === 1}
              onClick={() => setPage((old) => Math.max(1, old - 1))}
            >
              Sebelumnya
            </Button>
            <Button
              className="h-7 px-2 text-xs"
              disabled={currentPage === totalPages}
              onClick={() => setPage((old) => Math.min(totalPages, old + 1))}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
