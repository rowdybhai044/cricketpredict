"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Check, Clock, Info } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { LIMITS } from "@/lib/mock-data";
import { cn, formatDateTime, inr, optionLabel } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { SuccessCheck } from "@/components/ui/success-check";
import { TeamLogo } from "@/components/team-logo";
import { EmptyState } from "@/components/empty-state";

function Countdown({ from = 8 * 60 + 42 }: { from?: number }) {
  const [s, setS] = useState(from);
  useEffect(() => {
    const t = setInterval(() => setS((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="font-semibold tabular-nums">{String(Math.floor(s / 60)).padStart(2, "0")}:{String(s % 60).padStart(2, "0")}</span>;
}

export default function PlaceBet() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const match = useStore((s) => s.matches.find((m) => m.id === id));
  const balance = useStore((s) => s.balance);
  const placeBet = useStore((s) => s.placeBet);

  const [pick, setPick] = useState<"A" | "B" | null>(null);
  const [stakeStr, setStakeStr] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);

  if (!match) {
    return (<><PageHeader title="Place bet" /><EmptyState icon={<Info className="h-7 w-7" />} title="Match not found" hint="It may have been removed." action={<Link href="/"><Button>Back to matches</Button></Link>} /></>);
  }

  const closed = match.status === "completed" || match.status === "cancelled";
  const stake = Number(stakeStr) || 0;
  const odds = pick ? (pick === "A" ? match.oddsA : match.oddsB) : 0;
  const payout = stake * odds;
  const insufficient = stake > balance;
  const error =
    stakeStr && stake < LIMITS.minStake ? `Minimum stake is ${inr(LIMITS.minStake, false)}.`
    : stake > LIMITS.maxStake ? `Maximum stake is ${inr(LIMITS.maxStake, false)}.`
    : insufficient ? "Insufficient balance."
    : "";
  const valid = !!pick && stake >= LIMITS.minStake && stake <= LIMITS.maxStake && !insufficient && !closed;
  const max = Math.min(balance, LIMITS.maxStake);

  const confirmBet = () => {
    if (!pick) return;
    placeBet(match.id, pick, stake);
    setDone(true);
    toast.success("Bet placed", { description: `${inr(stake, false)} on ${optionLabel(match, pick)}` });
    setTimeout(() => router.push("/bets"), 1600);
  };

  return (
    <>
      <PageHeader title="Place bet" />
      <div className="space-y-5 px-4 pb-32 pt-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted">{match.tournament} · {match.format}</p>
            <StatusBadge status={match.status} />
          </div>
          <div className="mt-4 flex items-center justify-around text-center">
            <div className="flex flex-col items-center gap-2"><TeamLogo team={match.teamA} className="h-14 w-14 text-sm" /><span className="max-w-[110px] text-sm font-semibold">{match.teamA.name}</span></div>
            <span className="text-xs font-medium text-muted">vs</span>
            <div className="flex flex-col items-center gap-2"><TeamLogo team={match.teamB} className="h-14 w-14 text-sm" /><span className="max-w-[110px] text-sm font-semibold">{match.teamB.name}</span></div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-elevated px-3 py-2.5 text-sm">
            <span className="flex items-center gap-1.5 text-muted"><Clock className="h-4 w-4" />{formatDateTime(match.startTime)}</span>
            {!closed && <span className="text-muted">Betting closes in <Countdown /></span>}
          </div>
        </Card>

        {closed ? (
          <EmptyState icon={<Info className="h-7 w-7" />} title="Betting is closed" hint="This match is no longer taking bets." />
        ) : (
          <>
            <section>
              <h2 className="mb-3 text-[17px] font-semibold">{match.tossType === "team" ? "Who wins the toss?" : "Heads or tails?"}</h2>
              <div className="grid grid-cols-2 gap-3">
                {(["A", "B"] as const).map((s) => {
                  const on = pick === s;
                  return (
                    <motion.button
                      key={s} whileTap={{ scale: 0.97 }} onClick={() => setPick(s)} aria-pressed={on}
                      className={cn("relative rounded-2xl border-2 p-4 text-left transition-colors", on ? "border-primary bg-primary/10" : "border-border bg-surface")}
                    >
                      {on && <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>}
                      {match.tossType === "team" ? <TeamLogo team={s === "A" ? match.teamA : match.teamB} /> : <div className="flex h-10 w-10 items-center justify-center rounded-full bg-elevated text-sm font-bold text-accent">{s === "A" ? "H" : "T"}</div>}
                      <p className="mt-3 line-clamp-1 text-sm font-medium">{optionLabel(match, s)}</p>
                      <p className="mt-0.5 text-2xl font-bold tabular-nums text-accent">{(s === "A" ? match.oddsA : match.oddsB).toFixed(2)}x</p>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-[17px] font-semibold">Your stake</h2>
              <div className={cn("flex items-center rounded-2xl border bg-elevated px-4", error ? "border-danger" : "border-border focus-within:border-primary")}>
                <span className="text-2xl font-semibold text-muted">₹</span>
                <input inputMode="numeric" aria-label="Stake amount" placeholder="0" value={stakeStr} onChange={(e) => setStakeStr(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="h-16 w-full bg-transparent px-2 text-3xl font-bold tabular-nums outline-none placeholder:text-muted/40 focus-visible:ring-0 focus-visible:ring-offset-0" />
              </div>
              <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
                {[100, 500, 1000, 2000].map((v) => (
                  <button key={v} onClick={() => setStakeStr(String(v))} className="shrink-0 rounded-full border border-border px-4 py-1.5 text-sm font-medium tabular-nums hover:bg-elevated">₹{v.toLocaleString("en-IN")}</button>
                ))}
                <button onClick={() => setStakeStr(String(max))} className="shrink-0 rounded-full border border-primary/50 px-4 py-1.5 text-sm font-semibold text-primary">Max</button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className={error ? "text-danger" : "text-muted"}>
                  {error || `Min ${inr(LIMITS.minStake, false)} · Max ${inr(LIMITS.maxStake, false)}`}
                  {insufficient && <> <Link href="/wallet/deposit" className="font-semibold underline">Deposit</Link></>}
                </span>
                <span className="text-muted">Available: <span className="tabular-nums">{inr(balance, false)}</span></span>
              </div>
            </section>

            <Card className="space-y-2.5 p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted">Stake</span><span className="tabular-nums">{inr(stake, false)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Odds</span><span className="tabular-nums">{odds ? `${odds.toFixed(2)}x` : "—"}</span></div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="font-medium">Potential win</span>
                <AnimatedNumber value={valid ? payout : 0} className="text-xl font-bold tabular-nums text-accent" />
              </div>
            </Card>
          </>
        )}
      </div>

      {!closed && (
        <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/95 p-4 pb-safe backdrop-blur">
          <Button className="w-full" disabled={!valid} onClick={() => setConfirm(true)}>
            Confirm bet{valid ? ` · ${inr(stake, false)}` : ""}
          </Button>
        </div>
      )}

      <Modal open={confirm} onClose={() => !done && setConfirm(false)} variant="drawer" title={done ? undefined : "Review your bet"}
        footer={!done && (<><Button variant="outline" className="flex-1" onClick={() => setConfirm(false)}>Edit</Button><Button className="flex-1" onClick={confirmBet}>Place bet</Button></>)}>
        {done ? (
          <div className="flex flex-col items-center py-8 text-center">
            <SuccessCheck />
            <p className="mt-4 text-lg font-semibold">Bet placed</p>
            <p className="mt-1 text-sm text-muted">Taking you to My Bets…</p>
          </div>
        ) : (
          <div className="space-y-3 pb-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Match</span><span className="font-medium">{match.teamA.code} vs {match.teamB.code}</span></div>
            <div className="flex justify-between"><span className="text-muted">Your pick</span><span className="font-medium">{pick && optionLabel(match, pick)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Stake</span><span className="tabular-nums">{inr(stake, false)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Odds</span><span className="tabular-nums">{odds.toFixed(2)}x</span></div>
            <div className="flex justify-between border-t border-border pt-3"><span className="font-medium">Potential win</span><span className="font-bold tabular-nums text-accent">{inr(payout)}</span></div>
            <p className="rounded-xl bg-warning/10 p-3 text-xs text-warning">Bets can&apos;t be cancelled after confirmation.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
