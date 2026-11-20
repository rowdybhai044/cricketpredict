"use client";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function CopyButton({ value, label = "Copied" }: { value: string; label?: string }) {
  return (
    <button aria-label={`Copy ${value}`} onClick={() => { navigator.clipboard?.writeText(value); toast.success(label); }} className="rounded-md p-1.5 text-muted hover:bg-elevated hover:text-foreground">
      <Copy className="h-3.5 w-3.5" />
    </button>
  );
}
