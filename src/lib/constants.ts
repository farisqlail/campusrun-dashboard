import type {
  AdminRole,
  DisbursementStatus,
  OrderStatus,
  ReportStatus,
  TransactionStatus,
  UserRole,
} from "./types";

export const THEME_PRIMARY = "#1A5276";
export const THEME_SECONDARY = "#2874A6";

export const USER_ROLES: UserRole[] = ["requester", "runner", "both"];

export const ADMIN_ROLES: AdminRole[] = ["superadmin", "admin", "support"];

export const ORDER_STATUSES: OrderStatus[] = [
  "open",
  "taken",
  "on_process",
  "delivered",
  "completed",
  "cancelled",
  "disputed",
];

export const TRANSACTION_STATUSES: TransactionStatus[] = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

export const DISBURSEMENT_STATUSES: DisbursementStatus[] = [
  "pending",
  "processing",
  "success",
  "failed",
];

export const REPORT_STATUSES: ReportStatus[] = [
  "open",
  "investigating",
  "resolved",
  "dismissed",
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  open: "Open",
  taken: "Taken",
  on_process: "On Process",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
};

export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  open: "bg-sky-500/10 text-sky-300",
  taken: "bg-violet-500/10 text-violet-300",
  on_process: "bg-amber-500/10 text-amber-300",
  delivered: "bg-orange-500/10 text-orange-300",
  completed: "bg-emerald-500/10 text-emerald-300",
  cancelled: "bg-rose-500/10 text-rose-300",
  disputed: "bg-rose-700/20 text-rose-300",
};

export const TRANSACTION_STATUS_LABEL: Record<TransactionStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export const TRANSACTION_STATUS_BADGE_CLASS: Record<TransactionStatus, string> =
  {
    pending: "bg-amber-500/10 text-amber-300",
    paid: "bg-emerald-500/10 text-emerald-300",
    failed: "bg-rose-500/10 text-rose-300",
    refunded: "bg-slate-700 text-slate-200",
  };

export const DISBURSEMENT_STATUS_LABEL: Record<DisbursementStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  success: "Success",
  failed: "Failed",
};

export const DISBURSEMENT_STATUS_BADGE_CLASS: Record<
  DisbursementStatus,
  string
> = {
  pending: "bg-amber-500/10 text-amber-300",
  processing: "bg-sky-500/10 text-sky-300",
  success: "bg-emerald-500/10 text-emerald-300",
  failed: "bg-rose-500/10 text-rose-300",
};

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  open: "Open",
  investigating: "Investigating",
  resolved: "Resolved",
  dismissed: "Dismissed",
};

export const REPORT_STATUS_BADGE_CLASS: Record<ReportStatus, string> = {
  open: "bg-rose-500/10 text-rose-300",
  investigating: "bg-amber-500/10 text-amber-300",
  resolved: "bg-emerald-500/10 text-emerald-300",
  dismissed: "bg-slate-700 text-slate-200",
};

export function formatCurrencyIDR(value: number): string {
  return (
    "Rp " +
    new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 0,
    }).format(value)
  );
}

export function formatDateTimeWIB(isoString: string): string {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  });

  return `${formatter.format(date)} WIB`;
}

