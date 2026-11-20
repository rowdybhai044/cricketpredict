import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-xl border border-border bg-elevated px-4 text-[15px] text-foreground placeholder:text-muted/70 transition-colors focus-visible:border-primary disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export function Field({
  label, helper, error, children,
}: { label: string; helper?: string; error?: string | false; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="block text-xs text-danger">{error}</span> : helper ? <span className="block text-xs text-muted">{helper}</span> : null}
    </label>
  );
}
