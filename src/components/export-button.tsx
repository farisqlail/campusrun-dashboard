'use client';

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type ExportButtonProps = {
  filename: string;
  rows: Record<string, unknown>[];
};

export function ExportButton({ filename, rows }: ExportButtonProps) {
  function handleExport() {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            if (value == null) return "";
            const text = String(value).replace(/"/g, '""');
            if (text.includes(",") || text.includes("\n")) {
              return `"${text}"`;
            }
            return text;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      type="button"
      className="flex h-9 items-center gap-2 bg-slate-900 px-3 text-xs text-white hover:bg-slate-800"
      onClick={handleExport}
      disabled={!rows.length}
    >
      <Download className="h-3.5 w-3.5" />
      <span>Export CSV</span>
    </Button>
  );
}
