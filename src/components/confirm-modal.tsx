'use client';

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  placeholder?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  reason: string;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  placeholder = "Tuliskan alasan di sini...",
  confirmLabel = "Konfirmasi",
  cancelLabel = "Batal",
  reason,
  onReasonChange,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950 p-5 shadow-xl">
        <h2 className="text-sm font-semibold text-slate-50">{title}</h2>
        {description ? (
          <p className="mt-1 text-xs text-slate-400">{description}</p>
        ) : null}
        <div className="mt-3 space-y-1.5">
          <label className="text-xs font-medium text-slate-300">Alasan</label>
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            className="h-8 border border-slate-700 bg-transparent px-3 text-xs text-slate-200 hover:bg-slate-900"
            type="button"
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            className="h-8 bg-rose-500 px-3 text-xs font-semibold text-slate-950 hover:bg-rose-400 disabled:opacity-60"
            type="button"
            onClick={onConfirm}
            disabled={!reason}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

