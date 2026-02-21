"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SwitchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(
    defaultChecked ?? false
  );

  const isControlled = typeof checked === "boolean";
  const value = isControlled ? checked : internalChecked;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.checked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full border border-slate-600 bg-slate-900 transition-colors",
        value && "border-emerald-400 bg-emerald-500/20",
        className
      )}
      onClick={() =>
        handleChange({
          target: { checked: !value },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-slate-300 transition-transform",
          value && "translate-x-3.5 bg-emerald-300",
          !value && "translate-x-1"
        )}
      />
      <input
        type="checkbox"
        className="sr-only"
        checked={value}
        onChange={handleChange}
        {...props}
      />
    </button>
  );
}
