"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Tabs<T extends string>({
  tabs, value, onChange, id = "tabs",
}: { tabs: { value: T; label: string }[]; value: T; onChange: (v: T) => void; id?: string }) {
  return (
    <div className="flex gap-1 rounded-xl bg-elevated p-1" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value} role="tab" aria-selected={value === t.value} onClick={() => onChange(t.value)}
          className={cn("relative flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors", value === t.value ? "text-foreground" : "text-muted")}
        >
          {value === t.value && (
            <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-lg bg-surface shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
          )}
          <span className="relative">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Chips<T extends string>({
  items, value, onChange,
}: { items: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {items.map((i) => (
        <button
          key={i.value} onClick={() => onChange(i.value)}
          className={cn("shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors", value === i.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:text-foreground")}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}
