"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Landmark, Lock, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { selectActiveWithdrawal, useStore } from "@/lib/store";
import { LIMITS } from "@/lib/mock-data";
import { cn, formatDateTime, inr } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

export default function Withdraw() {
  const balance = useStore((s) => s.balance);
  const active = useStore(selectActiveWithdrawal);
  const submitWithdrawal = useStore((s) => s.submitWithdrawal);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"upi" | "bank">("upi");
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("");
  const [acc, setAcc] = useState("");
  const [acc2, setAcc2] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const amt = Number(amount) || 0;
  const amtErr = amount && amt < LIMITS.minWithdraw ? `Minimum withdrawal is ${inr(LIMITS.minWithdraw, false)}.` : amt > balance ? "Amount exceeds your balance." : "";
  const upiOk = /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upi);
  const ifscOk = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  const bankOk = bank.trim().length > 2 && /^\d{9,18}$/.test(acc) && acc === acc2 && ifscOk;
  const valid = amt >= LIMITS.minWithdraw && amt <= balance && (method === "upi" ? upiOk : bankOk);
  const locked = !!active;

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      submitWithdrawal(method === "upi" ? { amount: amt, method, upiId: upi } : { amount: amt, method, bankName: bank, accountNo: acc, ifsc });
      setLoading(false);
      setConfirm(false);
      setAmount(""); setUpi(""); setBank(""); setAcc(""); setAcc2(""); setIfsc("");
      toast.success("Withdrawal request submitted", { description: "Processing time: up to 24 hours." });
    }, 700);
  };

  return (
    <>
      <PageHeader title="Withdraw" />
      <div className="space-y-5 px-4 pt-4">
        <Card className="flex items-center justify-between p-4">
          <span className="text-sm text-muted">Withdrawable balance</span>
          <span className="text-xl font-bold tabular-nums text-accent">{inr(balance)}</span>
        </Card>

        {active && (
          <div className="rounded-2xl border border-warning/30 bg-warning/10 p-4">
            <div className="flex items-start gap-3 text-warning">
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm">You have a withdrawal in progress. You can request another once it&apos;s processed.</p>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl bg-surface p-3">
              <div>
                <p className="font-semibold tabular-nums">{inr(active.amount, false)}</p>
                <p className="text-xs text-muted">{active.method === "upi" ? `UPI · ${active.upiId}` : `Bank · ${active.bankName}`} · {formatDateTime(active.createdAt)}</p>
              </div>
              <StatusBadge status="pending" />
            </div>
          </div>
        )}

        <div className={cn("space-y-5 transition-opacity", locked && "pointer-events-none opacity-50")} aria-disabled={locked}>
          <Field label="Amount" helper={`Minimum withdrawal ${inr(LIMITS.minWithdraw, false)}`} error={amtErr}>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">₹</span>
              <Input className="pl-8 tabular-nums" inputMode="numeric" placeholder="0" disabled={locked} value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))} />
            </div>
          </Field>

          <div>
            <span className="text-sm font-medium">Method</span>
            <div className="mt-1.5 grid grid-cols-2 gap-3" role="radiogroup">
              {([["upi", "UPI", Smartphone], ["bank", "Bank transfer", Landmark]] as const).map(([v, label, Icon]) => (
                <button key={v} role="radio" aria-checked={method === v} disabled={locked} onClick={() => setMethod(v)}
                  className={cn("flex items-center gap-2 rounded-xl border-2 p-3.5 text-sm font-medium transition-colors", method === v ? "border-primary bg-primary/10" : "border-border")}>
                  <Icon className="h-5 w-5" />{label}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={method} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }} className="space-y-4">
              {method === "upi" ? (
                <Field label="UPI ID" helper="Example: name@bank" error={upi.length > 3 && !upiOk && "Enter a valid UPI ID."}>
                  <Input autoCapitalize="none" placeholder="name@bank" disabled={locked} value={upi} onChange={(e) => setUpi(e.target.value.trim())} />
                </Field>
              ) : (
                <>
                  <Field label="Bank name"><Input placeholder="e.g. State Bank of India" disabled={locked} value={bank} onChange={(e) => setBank(e.target.value)} /></Field>
                  <Field label="Account number"><Input className="font-mono" inputMode="numeric" disabled={locked} value={acc} onChange={(e) => setAcc(e.target.value.replace(/\D/g, "").slice(0, 18))} /></Field>
                  <Field label="Confirm account number" error={acc2 && acc !== acc2 && "Account numbers don't match."}>
                    <Input className="font-mono" inputMode="numeric" disabled={locked} value={acc2} onChange={(e) => setAcc2(e.target.value.replace(/\D/g, "").slice(0, 18))} />
                  </Field>
                  <Field label="IFSC code" helper="11 characters, e.g. SBIN0001234" error={ifsc.length === 11 && !ifscOk && "Enter a valid IFSC code."}>
                    <Input className="font-mono uppercase" maxLength={11} disabled={locked} value={ifsc} onChange={(e) => setIfsc(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} />
                  </Field>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <Card className="space-y-2 p-4 text-sm">
            <div className="flex justify-between"><span className="text-muted">Amount</span><span className="tabular-nums">{inr(amt, false)}</span></div>
            <div className="flex justify-between"><span className="text-muted">Method</span><span>{method === "upi" ? "UPI" : "Bank transfer"}</span></div>
            <div className="flex justify-between"><span className="text-muted">Processing time</span><span>Up to 24 hrs</span></div>
          </Card>
        </div>

        <Button className="mb-4 w-full" disabled={!valid || locked} onClick={() => setConfirm(true)}>Submit withdrawal request</Button>
      </div>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Confirm withdrawal" description={`${inr(amt, false)} will be sent to your ${method === "upi" ? upi : `${bank} account`} after review. Only one request can be active at a time.`}
        footer={<><Button variant="outline" className="flex-1" onClick={() => setConfirm(false)}>Cancel</Button><Button className="flex-1" loading={loading} onClick={submit}>Confirm</Button></>}>
        <span />
      </Modal>
    </>
  );
}
