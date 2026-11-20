import { ArrowDownToLine, ArrowUpFromLine, Trophy, X, Undo2 } from "lucide-react";
import type { Txn } from "@/lib/mock-data";
import { StatusBadge } from "./ui/badge";
import { cn, formatDateTime, inr } from "@/lib/utils";

const meta = {
  deposit: { icon: ArrowDownToLine, tint: "bg-primary/15 text-primary" },
  withdrawal: { icon: ArrowUpFromLine, tint: "bg-info/15 text-info" },
  bet_win: { icon: Trophy, tint: "bg-accent/15 text-accent" },
  bet_loss: { icon: X, tint: "bg-danger/15 text-danger" },
  refund: { icon: Undo2, tint: "bg-info/15 text-info" },
} as const;

export function TxnRow({ t }: { t: Txn }) {
  const { icon: Icon, tint } = meta[t.type];
  const showBadge = t.type === "deposit" || t.type === "withdrawal";
  return (
    <div className="flex items-center gap-3 py-3">
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", tint)}><Icon className="h-5 w-5" /></div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{t.title}</p>
        <p className="text-xs text-muted">{formatDateTime(t.createdAt)}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={cn("text-sm font-semibold tabular-nums", t.amount >= 0 ? "text-primary" : "text-danger")}>
          {t.amount >= 0 ? "+" : "−"}{inr(Math.abs(t.amount), false)}
        </span>
        {showBadge && <StatusBadge status={t.status === "completed" ? "approved" : (t.status as "pending" | "approved" | "rejected")} />}
      </div>
    </div>
  );
}
