"use client";
import { useState } from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useFakeLoading } from "@/hooks/use-fake-loading";
import { formatDateTime, inr, optionLabel } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Chips } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

type F = "all" | "pending" | "won" | "lost";

export default function Bets() {
  const bets = useStore((s) => s.bets);
  const matches = useStore((s) => s.matches);
  const loading = useFakeLoading(500);
  const [f, setF] = useState<F>("all");
  const count = (k: F) => (k === "all" ? bets.length : bets.filter((b) => b.status === k).length);
  const list = bets.filter((b) => f === "all" || b.status === f);

  return (
    <>
      <PageHeader title="My bets" back={false} />
      <div className="space-y-4 px-4 pt-4">
        <Chips<F> value={f} onChange={setF} items={(["all", "pending", "won", "lost"] as F[]).map((k) => ({ value: k, label: `${k[0].toUpperCase()}${k.slice(1)} (${count(k)})` }))} />
        {loading ? (
          <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}</div>
        ) : list.length === 0 ? (
          <EmptyState icon={<Ticket className="h-7 w-7" />} title="No bets here yet" hint="Pick a match and predict the toss to get started." action={<Link href="/"><Button>Browse matches</Button></Link>} />
        ) : (
          <div className="space-y-3">
            {list.map((b, i) => {
              const m = matches.find((x) => x.id === b.matchId);
              if (!m) return null;
              return (
                <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <Card className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{m.teamA.code} vs {m.teamB.code}</p>
                        <p className="text-xs text-muted">{m.tournament} · {formatDateTime(b.createdAt)}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-elevated p-3 text-sm">
                      <div><p className="text-xs text-muted">Pick</p><p className="font-medium">{optionLabel(m, b.pick)}</p></div>
                      <div><p className="text-xs text-muted">Stake</p><p className="font-medium tabular-nums">{inr(b.stake, false)}</p></div>
                      <div><p className="text-xs text-muted">Odds</p><p className="font-medium tabular-nums">{b.odds.toFixed(2)}x</p></div>
                    </div>
                    <p className="mt-3 text-sm">
                      {b.status === "pending" && <span className="text-muted">Potential <b className="tabular-nums text-accent">{inr(b.stake * b.odds)}</b></span>}
                      {b.status === "won" && <span className="font-semibold text-primary">Won {inr(b.stake * b.odds)}</span>}
                      {b.status === "lost" && <span className="font-semibold text-danger/80">Lost {inr(b.stake)}</span>}
                      {b.status === "refunded" && <span className="text-info">Refunded {inr(b.stake)}</span>}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
