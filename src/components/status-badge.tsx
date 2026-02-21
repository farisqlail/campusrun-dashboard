import {
  DISBURSEMENT_STATUS_BADGE_CLASS,
  DISBURSEMENT_STATUS_LABEL,
  ORDER_STATUS_BADGE_CLASS,
  ORDER_STATUS_LABEL,
  REPORT_STATUS_BADGE_CLASS,
  REPORT_STATUS_LABEL,
  TRANSACTION_STATUS_BADGE_CLASS,
  TRANSACTION_STATUS_LABEL,
} from "@/lib/constants";
import type {
  DisbursementStatus,
  OrderStatus,
  ReportStatus,
  TransactionStatus,
} from "@/lib/types";

type StatusBadgeProps =
  | {
      kind: "order";
      value: OrderStatus;
    }
  | {
      kind: "transaction";
      value: TransactionStatus;
    }
  | {
      kind: "disbursement";
      value: DisbursementStatus;
    }
  | {
      kind: "report";
      value: ReportStatus;
    };

export function StatusBadge(props: StatusBadgeProps) {
  const { kind, value } = props;

  let label: string;
  let color: string;

  if (kind === "order") {
    label = ORDER_STATUS_LABEL[value];
    color = ORDER_STATUS_BADGE_CLASS[value];
  } else if (kind === "transaction") {
    label = TRANSACTION_STATUS_LABEL[value];
    color = TRANSACTION_STATUS_BADGE_CLASS[value];
  } else if (kind === "disbursement") {
    label = DISBURSEMENT_STATUS_LABEL[value];
    color = DISBURSEMENT_STATUS_BADGE_CLASS[value];
  } else {
    label = REPORT_STATUS_LABEL[value];
    color = REPORT_STATUS_BADGE_CLASS[value];
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}
