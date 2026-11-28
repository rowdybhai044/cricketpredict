"use client";
import { useState } from "react";
import { ArrowDownToLine, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { DepositReq } from "@/lib/mock-data";
import { formatDateTime, inr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/copy-button";
import { EmptyState } from "@/components/empty-state";

export default function AdminDeposits() {
  const deposits = useStore((s) => s.deposits);
  const approve = useStore((s) => s.approveDeposit);
  const reject = useStore((s) => s.rejectDeposit);
  const [tab, setTab] = useState<"pending" | "history">("pending");
  const [shot, setShot] = useState<DepositReq | null>(null);
  const [rej, setRej] = useState<DepositReq | null>(null);
  const [reason, setReason] = useState("");

  const pending = deposits.filter((d) => d.status === "pending");
  const list = tab === "pending" ? pending : deposits.filter((d) => d.status !== "pending");

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Deposit requests</h1>
      <div className="max-w-xs">
        <Tabs id="dep" value={tab} onChange={setTab} tabs={[{ value: "pending", label: `Pending (${pending.length})` }, { value: "history", label: "History" }]} />
      </div>

      {list.length === 0 ? (
        <Card><EmptyState icon={<ArrowDownToLine className="h-7 w-7" />} title={tab === "pending" ? "No pending deposits" : "No history yet"} hint="New requests show up here." /></Card>
      ) : (
        <Card className="divide-y divide-border">
          {list.map((d) => (
            <div key={d.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
              <div className="min-w-0 flex-1">
                <p className="font-semibold tabular-nums">+91 {d.userMobile}</p>
                <p className="text-xs text-muted">{formatDateTime(d.createdAt)}</p>
              </div>
              <p className="text-xl font-bold tabular-nums md:w-28">{inr(d.amount, false)}</p>
              <div className="flex items-center gap-1 font-mono text-sm md:w-48">{d.utr}<CopyButton value={d.utr} label="UTR copied" /></div>
              <div className="md:w-28">
                {d.hasScreenshot ? (
                  <button onClick={() => setShot(d)} className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-2.5 py-1.5 text-xs text-muted hover:text-foreground"><ImageIcon className="h-4 w-4" />View</button>
                ) : <span className="text-xs text-muted">No screenshot</span>}
              </div>
              {d.status === "pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => { approve(d.id); toast.success("Deposit approved", { description: `${inr(d.amount, false)} credited.` }); }}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => { setReason(""); setRej(d); }}>Reject</Button>
                </div>
              ) : <StatusBadge status={d.status} />}
            </div>
          ))}
        </Card>
      )}

      <Modal open={!!shot} onClose={() => setShot(null)} title="Payment screenshot" description={shot ? `${inr(shot.amount, false)} · UTR ${shot.utr}` : undefined}>
        <div className="mb-2 flex aspect-[3/4] items-center justify-center rounded-xl border border-dashed border-border bg-elevated text-muted">
          <div className="text-center"><ImageIcon className="mx-auto h-10 w-10" /><p className="mt-2 text-sm">Mock screenshot preview</p></div>
        </div>
      </Modal>

      <Modal open={!!rej} onClose={() => setRej(null)} title="Reject deposit?" description="The user will see this request as rejected."
        footer={<><Button variant="outline" className="flex-1" onClick={() => setRej(null)}>Cancel</Button><Button variant="dangerSolid" className="flex-1" onClick={() => { if (rej) { reject(rej.id); toast.error("Deposit rejected"); } setRej(null); }}>Reject</Button></>}>
        <Input placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
      </Modal>
    </div>
  );
}
