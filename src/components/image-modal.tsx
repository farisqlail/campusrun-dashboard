'use client';

type ImageModalProps = {
  open: boolean;
  title?: string;
  src: string | null;
  onClose: () => void;
};

export function ImageModal({ open, title, src, onClose }: ImageModalProps) {
  if (!open || !src) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] max-w-3xl rounded-xl border border-slate-800 bg-slate-950/95 p-4"
        onClick={(event) => event.stopPropagation()}
      >
        {title ? (
          <div className="mb-3 text-sm font-medium text-slate-50">{title}</div>
        ) : null}
        <img
          src={src}
          alt={title ?? "Preview"}
          className="max-h-[70vh] w-full rounded-lg object-contain"
        />
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-xs text-slate-400 hover:text-slate-200"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

