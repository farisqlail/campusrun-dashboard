import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type StatCardProps = {
  title: string;
  description?: string;
  value: string;
  helperText?: string;
  icon?: ReactNode;
  accent?: "default" | "emerald" | "sky" | "violet" | "amber";
};

const accentClassName: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "bg-slate-800/70 text-slate-200",
  emerald: "bg-emerald-500/10 text-emerald-300",
  sky: "bg-sky-500/10 text-sky-300",
  violet: "bg-violet-500/10 text-violet-300",
  amber: "bg-amber-500/10 text-amber-300",
};

export function StatCard({
  title,
  description,
  value,
  helperText,
  icon,
  accent = "default",
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {icon ? (
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm ${accentClassName[accent]}`}
            >
              {icon}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-slate-50">{value}</span>
          {helperText ? (
            <span className="text-xs text-slate-400">{helperText}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

