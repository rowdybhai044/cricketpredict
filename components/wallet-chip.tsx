"use client";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/utils";

export function WalletChip() {
  const balance = useStore((s) => s.balance);
  return (
    <Link href="/wallet" className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-2.5 pr-3.5 transition-colors hover:bg-elevated" aria-label="Open wallet">
      <Wallet className="h-4 w-4 text-accent" />
      <span className="text-sm font-semibold tabular-nums text-accent">{inr(balance)}</span>
    </Link>
  );
}
