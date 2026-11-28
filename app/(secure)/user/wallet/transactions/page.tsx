"use client";
import { useState } from "react";
import { Receipt } from "lucide-react";
import { useStore } from "@/lib/store";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import { PageHeader } from "@/components/page-header";
import { Chips } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TxnRow } from "@/components/txn-row";
import { EmptyState } from "@/components/empty-state";

type F = "all" | "deposit" | "withdrawal" | "bets";

export default function Transactions() {
  const txns = useStore((s) => s.txns);
  const loading = useFakeLoading(500);
  const [f, setF] = useState<F>("all");
  const list = txns.filter((t) => f === "all" || (f === "bets" ? ["bet_win", "bet_loss", "refund"].includes(t.type) : t.type === f));
  return (
    <>
      <PageHeader title="Transactions" />
      <div className="space-y-4 px-4 pt-4">
        <Chips<F> value={f} onChange={setF} items={[{ value: "all", label: "All" }, { value: "deposit", label: "Deposits" }, { value: "withdrawal", label: "Withdrawals" }, { value: "bets", label: "Bet results" }]} />
        {loading ? <Skeleton className="h-72 w-full rounded-2xl" /> : list.length === 0 ? (
          <EmptyState icon={<Receipt className="h-7 w-7" />} title="No transactions" hint="Nothing matches this filter yet." />
        ) : (
          <Card className="divide-y divide-border px-4">{list.map((t) => <TxnRow key={t.id} t={t} />)}</Card>
        )}
      </div>
    </>
  );
}
