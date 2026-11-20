"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, Wallet, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  { icon: Zap, title: "Predict the toss", text: "Pick a side, set your stake, and see your potential win before you confirm." },
  { icon: Wallet, title: "A wallet you can read", text: "Deposit by UPI, withdraw to UPI or bank. Every movement is listed in your ledger." },
  { icon: ShieldCheck, title: "Clear and fair", text: "Odds are shown up front. Results are settled by our team and visible in My Bets." },
];

export default function Welcome() {
  const [i, setI] = useState(0);
  const last = i === slides.length - 1;
  const S = slides[i];
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">Toss<span className="text-primary">Win</span></span>
        <Link href="/login" className="text-sm text-muted hover:text-foreground">Skip</Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }} className="flex flex-col items-center">
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-3xl border border-border bg-surface">
              <S.icon className="h-12 w-12 text-primary" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold">{S.title}</h1>
            <p className="mt-3 max-w-xs text-muted">{S.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, n) => (
          <button key={n} aria-label={`Slide ${n + 1}`} onClick={() => setI(n)} className={`h-1.5 rounded-full transition-all ${n === i ? "w-6 bg-primary" : "w-1.5 bg-border"}`} />
        ))}
      </div>
      {last ? (
        <Link href="/login"><Button className="w-full">Get started</Button></Link>
      ) : (
        <Button className="w-full" onClick={() => setI(i + 1)}>Next</Button>
      )}
      <p className="mt-5 text-center text-xs text-muted">18+ only · Play responsibly</p>
    </>
  );
}
