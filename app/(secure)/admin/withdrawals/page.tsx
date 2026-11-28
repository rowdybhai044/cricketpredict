"use client";
import { useState } from "react";
import { ChevronDown, ArrowUpFromLine } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { WithdrawalReq } from "@/lib/mock-data";
import { cn, formatDateTime, inr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { EmptyState } from "@/components/empty-state";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="flex items-center gap-1 font-mono">{value}<CopyButton value={value} label={`${label} copied`} /></span>
    </div>
  );
}

export default function AdminWithdrawals() {
  const withdrawals = useStore((s) => s.withdrawals);
  const markPaid = useStore((s) => s.markPaid);
  const rejectW = useStore((s) => s.rejectWithdrawal);
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [open, setOpen] = useState<string | null>("w1");
  const [paid, setPaid] = useState<WithdrawalReq | null>(null);
  const [ref, setRef] = useState("");
  const [rej, setRej] = useState<WithdrawalReq | null>(null);

  const pending = withdrawals.filter((w) => w.status === "pending");
  const list = tab === "pending" ? pending : withdrawals.filter((w) => w.status !== "pending");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Withdrawal requests</h1>
      <div className="max-w-xs">
        <Tabs id="wd" value={tab} onChange={setTab} tabs={[{ value: "pending", label: `Pending (${pending.length})` }, { value: "history", label: "History" }]} />
      </div>

      {list.length === 0 ? (
        <Card><EmptyState icon={<ArrowUpFromLine className="h-7 w-7" />} title={tab === "pending" ? "No pending withdrawals" : "No history yet"} hint="New requests show up here." /></Card>
      ) : (
        <div className="space-y-3">
          {list.map((w) => {
            const on = open === w.id;
            return (
              <Card key={w.id} className="overflow-hidden">
                <button onClick={() => setOpen(on ? null : w.id)} aria-expanded={on} className="flex w-full items-center gap-3 p-4 text-left">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold tabular-nums">+91 {w.userMobile}</p>
                    <p className="text-xs text-muted">{w.method === "upi" ? "UPI" : "Bank transfer"} · {formatDateTime(w.createdAt)}</p>
                  </div>
                  <span className="text-xl font-bold tabular-nums">{inr(w.amount, false)}</span>
                  <StatusBadge status={w.status} className="hidden sm:inline-flex" />
                  <ChevronDown className={cn("h-5 w-5 text-muted transition-transform", on && "rotate-180")} />
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="border-t border-border px-4 py-3">
                        {w.method === "upi" ? <Detail label="UPI ID" value={w.upiId ?? ""} /> : (<><Detail label="Bank name" value={w.bankName ?? ""} /><Detail label="Account number" value={w.accountNo ?? ""} /><Detail label="IFSC" value={w.ifsc ?? ""} /></>)}
                        <Detail label="Amount" value={String(w.amount)} />
                        {w.status === "pending" && (
                          <div className="mt-3 flex gap-2">
                            <Button size="sm" onClick={() => { setRef(""); setPaid(w); }}>Mark as paid</Button>
                            <Button size="sm" variant="danger" onClick={() => setRej(w)}>Reject</Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={!!paid} onClose={() => setPaid(null)} title="Mark as paid" description={paid ? `Confirm you've sent ${inr(paid.amount, false)}.` : undefined}
        footer={<><Button variant="outline" className="flex-1" onClick={() => setPaid(null)}>Cancel</Button><Button className="flex-1" onClick={() => { if (paid) { markPaid(paid.id); toast.success("Marked as paid"); } setPaid(null); }}>Confirm paid</Button></>}>
        <Input placeholder="Payout reference (optional)" value={ref} onChange={(e) => setRef(e.target.value)} />
      </Modal>

      <Modal open={!!rej} onClose={() => setRej(null)} title="Reject withdrawal?" description="The amount will return to the user's wallet."
        footer={<><Button variant="outline" className="flex-1" onClick={() => setRej(null)}>Cancel</Button><Button variant="dangerSolid" className="flex-1" onClick={() => { if (rej) { rejectW(rej.id); toast.error("Withdrawal rejected"); } setRej(null); }}>Reject</Button></>}>
        <span />
      </Modal>
    </div>
  );
}
