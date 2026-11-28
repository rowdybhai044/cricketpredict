"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { Copy, ImagePlus, Info, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { LIMITS, UPI_ID, ME } from "@/lib/mock-data";
import { cn, formatDateTime, inr } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { SuccessCheck } from "@/components/ui/success-check";

export default function Deposit() {
  const qrUrl = useStore((s) => s.qrUrl);
  const deposits = useStore((s) => s.deposits.filter((d) => d.userId === ME.id));
  const submitDeposit = useStore((s) => s.submitDeposit);

  const [amount, setAmount] = useState("");
  const [utr, setUtr] = useState("");
  const [file, setFile] = useState<{ name: string; url: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [refId, setRefId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const amt = Number(amount) || 0;
  const amtErr = amount && amt < LIMITS.minDeposit ? `Minimum deposit is ${inr(LIMITS.minDeposit, false)}.` : "";
  const utrErr = utr && utr.length !== 12 ? "UTR must be 12 digits." : "";
  const valid = amt >= LIMITS.minDeposit && utr.length === 12;

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      const id = submitDeposit(amt, utr, !!file);
      setRefId(id.toUpperCase());
      setLoading(false);
      toast.success("Deposit request submitted");
    }, 800);
  };

  if (refId) {
    return (
      <>
        <PageHeader title="Deposit" />
        <div className="flex flex-col items-center px-6 pt-16 text-center">
          <SuccessCheck />
          <h2 className="mt-6 text-xl font-semibold">Request submitted</h2>
          <StatusBadge status="pending" className="mt-3" />
          <p className="mt-4 max-w-xs text-sm text-muted">We&apos;ll credit {inr(amt, false)} once an admin verifies your payment. This usually takes 15–30 minutes.</p>
          <p className="mt-4 text-xs text-muted">Reference <span className="font-mono text-foreground">{refId}</span></p>
          <Link href="/wallet" className="mt-8 w-full"><Button className="w-full">Back to wallet</Button></Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Deposit" />
      <div className="space-y-5 px-4 pt-4">
        <Card className="p-5 text-center">
          <h2 className="font-semibold">Scan &amp; pay using any UPI app</h2>
          <div className="mx-auto mt-4 w-fit rounded-2xl border border-border bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="UPI payment QR code" className="h-48 w-48" />
          </div>
          <button onClick={() => { navigator.clipboard?.writeText(UPI_ID); toast.success("UPI ID copied"); }}
            className="mx-auto mt-4 flex items-center gap-2 rounded-full bg-elevated px-4 py-2 text-sm">
            <span className="font-mono">{UPI_ID}</span><Copy className="h-4 w-4 text-muted" />
          </button>
          <p className="mt-3 text-xs text-muted">Google Pay · PhonePe · Paytm · BHIM</p>
        </Card>

        <Card className="space-y-4 p-5">
          <h2 className="font-semibold">Then submit your payment details</h2>
          <div>
            <Field label="Amount" helper={`Minimum deposit ${inr(LIMITS.minDeposit, false)}`} error={amtErr}>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">₹</span>
                <Input className="pl-8 tabular-nums" inputMode="numeric" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 6))} />
              </div>
            </Field>
            <div className="mt-2 flex gap-2">
              {[500, 1000, 2000, 5000].map((v) => (
                <button key={v} onClick={() => setAmount(String(v))} className="rounded-full border border-border px-3 py-1 text-xs font-medium tabular-nums hover:bg-elevated">{v.toLocaleString("en-IN")}</button>
              ))}
            </div>
          </div>

          <Field label="UTR number" helper="Find it in your UPI app under transaction details." error={utrErr}>
            <Input className="font-mono tracking-wide" inputMode="numeric" placeholder="12-digit UTR" value={utr} onChange={(e) => setUtr(e.target.value.replace(/\D/g, "").slice(0, 12))} />
          </Field>

          <div>
            <span className="text-sm font-medium">Screenshot <span className="font-normal text-muted">(optional)</span></span>
            <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile({ name: f.name, url: URL.createObjectURL(f) });
            }} />
            {file ? (
              <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-border bg-elevated p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.url} alt="Payment screenshot preview" className="h-14 w-14 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm">{file.name}</span>
                <button aria-label="Remove screenshot" onClick={() => setFile(null)} className="rounded-full p-2 text-muted hover:bg-surface"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <button onClick={() => inputRef.current?.click()} className={cn("mt-1.5 flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed border-border py-6 text-sm text-muted hover:bg-elevated")}>
                <ImagePlus className="h-6 w-6" />Upload payment screenshot
              </button>
            )}
          </div>
        </Card>

        <div className="flex gap-3 rounded-xl bg-info/10 p-3 text-sm text-info">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Amount will be credited after admin verification. Usually within 15–30 minutes.</p>
        </div>

        <Button className="w-full" disabled={!valid} loading={loading} onClick={submit}>Submit request</Button>

        {deposits.length > 0 && (
          <section className="pb-4">
            <h2 className="mb-2 text-[17px] font-semibold">Recent deposit requests</h2>
            <Card className="divide-y divide-border px-4">
              {deposits.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3">
                  <div><p className="text-sm font-semibold tabular-nums">{inr(d.amount, false)}</p><p className="text-xs text-muted">{formatDateTime(d.createdAt)}</p></div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </Card>
          </section>
        )}
      </div>
    </>
  );
}
