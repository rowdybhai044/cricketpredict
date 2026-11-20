"use client";
import { useState } from "react";
import { Search, Users as UsersIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import type { AdminUser } from "@/lib/mock-data";
import { formatDateTime, inr } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { TxnRow } from "@/components/txn-row";
import { EmptyState } from "@/components/empty-state";

export default function AdminUsers() {
  const users = useStore((s) => s.users);
  const bets = useStore((s) => s.bets);
  const txns = useStore((s) => s.txns);
  const deposits = useStore((s) => s.deposits);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<"bets" | "txns">("bets");

  const list = users.filter((u) => u.mobile.includes(q.replace(/\D/g, "")));
  // Mock-only: real data for the demo user, synthetic samples for everyone else.
  const userBets = sel?.id === "me" ? bets.slice(0, 5).map((b) => ({ id: b.id, label: "KKR vs MI", stake: b.stake, status: b.status, at: b.createdAt })) : sel ? [0, 1, 2].map((i) => ({ id: `${sel.id}${i}`, label: ["MI vs CSK", "RCB vs KKR", "DC vs RR"][i], stake: 200 * (i + 1), status: (["won", "lost", "pending"] as const)[i], at: "2026-11-14T18:00" })) : [];
  const userTxns = sel?.id === "me" ? txns.slice(0, 6) : deposits.filter((d) => d.userId === sel?.id).map((d) => ({ id: d.id, type: "deposit" as const, title: "Deposit via UPI", amount: d.amount, status: d.status, createdAt: d.createdAt }));

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="relative max-w-sm">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <Input className="pl-10" inputMode="numeric" placeholder="Search by mobile number" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {list.length === 0 ? (
        <Card><EmptyState icon={<UsersIcon className="h-7 w-7" />} title="No users found" hint="Try a different number." /></Card>
      ) : (
        <Card className="divide-y divide-border">
          {list.map((u) => (
            <button key={u.id} onClick={() => { setTab("bets"); setSel(u); }} className="flex w-full items-center gap-3 p-4 text-left hover:bg-elevated">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">{u.mobile[0]}</div>
              <div className="min-w-0 flex-1"><p className="font-semibold tabular-nums">+91 {u.mobile}</p><p className="text-xs text-muted">{u.bets} bets · joined {u.joined}</p></div>
              <div className="text-right"><p className="font-semibold tabular-nums">{inr(u.balance, false)}</p><StatusBadge status={u.status} className="mt-1" /></div>
            </button>
          ))}
        </Card>
      )}

      <Modal open={!!sel} onClose={() => setSel(null)} variant="sheet" title={sel ? `+91 ${sel.mobile}` : ""} description={sel ? `Joined ${sel.joined}` : undefined}>
        {sel && (
          <div className="space-y-4">
            <Card className="p-4 text-center"><p className="text-sm text-muted">Wallet balance</p><p className="text-3xl font-bold tabular-nums text-accent">{inr(sel.id === "me" ? useStore.getState().balance : sel.balance)}</p></Card>
            <Tabs id="usr" value={tab} onChange={setTab} tabs={[{ value: "bets", label: "Bets" }, { value: "txns", label: "Transactions" }]} />
            {tab === "bets" ? (
              <div className="divide-y divide-border">
                {userBets.map((b) => (
                  <div key={b.id} className="flex items-center justify-between py-3 text-sm">
                    <div><p className="font-medium">{b.label}</p><p className="text-xs text-muted">{formatDateTime(b.at)} · {inr(b.stake, false)}</p></div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            ) : userTxns.length ? (
              <div className="divide-y divide-border">{userTxns.map((t) => <TxnRow key={t.id} t={t} />)}</div>
            ) : <p className="py-8 text-center text-sm text-muted">No transactions yet.</p>}
            {sel.id !== "me" && <p className="text-xs text-muted">Sample history for demo purposes.</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
