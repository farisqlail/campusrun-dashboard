type ConfirmModalProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  confirmVariant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmClasses =
    confirmVariant === "danger"
      ? "bg-rose-500 text-slate-950 hover:bg-rose-400"
      : "bg-emerald-500 text-slate-950 hover:bg-emerald-400";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/95 p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-50">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            Tutup
          </button>
        </div>
        {description ? (
          <p className="mb-4 text-xs text-slate-300">{description}</p>
        ) : null}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-8 rounded-md border border-slate-700 bg-transparent px-3 text-xs text-slate-300 hover:bg-slate-900/60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-8 rounded-md px-3 text-xs font-semibold ${confirmClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
