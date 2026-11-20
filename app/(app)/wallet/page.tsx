"use client";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, Receipt } from "lucide-react";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TxnRow } from "@/components/txn-row";
import { EmptyState } from "@/components/empty-state";

export default function Wallet() {
  const balance = useStore((s) => s.balance);
  const txns = useStore((s) => s.txns);
  return (
    <>
      <PageHeader title="Wallet" back={false} showWallet={false} />
      <div className="space-y-6 px-4 pt-6">
        <Card className="px-4 py-8 text-center">
          <p className="text-sm text-muted">Available balance</p>
          <p className="mt-2 text-[40px] font-bold leading-[48px] tabular-nums text-accent">{inr(balance)}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link href="/wallet/deposit"><Button className="w-full"><ArrowDownToLine className="h-5 w-5" />Deposit</Button></Link>
            <Link href="/wallet/withdraw"><Button variant="outline" className="w-full"><ArrowUpFromLine className="h-5 w-5" />Withdraw</Button></Link>
          </div>
        </Card>

        <section>
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-[17px] font-semibold">Recent transactions</h2>
            <Link href="/wallet/transactions" className="text-sm font-medium text-primary">View all</Link>
          </div>
          {txns.length === 0 ? (
            <EmptyState icon={<Receipt className="h-7 w-7" />} title="No transactions yet" hint="Deposits, withdrawals and bet results will appear here." />
          ) : (
            <Card className="divide-y divide-border px-4">{txns.slice(0, 5).map((t) => <TxnRow key={t.id} t={t} />)}</Card>
          )}
        </section>
      </div>
    </>
  );
}
