type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <div className="h-10 w-10 rounded-full border border-dashed border-slate-700" />
      <div className="text-sm font-medium text-slate-200">{title}</div>
      {description ? (
        <div className="max-w-sm text-xs text-slate-500">{description}</div>
      ) : null}
    </div>
  );
}

