"use client";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, CircleDot, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDateTime, inr } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";

export default function Dashboard() {
  const deposits = useStore((s) => s.deposits.filter((d) => d.status === "pending"));
  const withdrawals = useStore((s) => s.withdrawals.filter((w) => w.status === "pending"));
  const active = useStore((s) => s.matches.filter((m) => m.status === "live" || m.status === "upcoming").length);

  const stats = [
    { label: "Total users", value: "1,248", icon: Users, href: "/admin/users", tint: "text-info bg-info/15" },
    { label: "Pending deposits", value: deposits.length, icon: ArrowDownToLine, href: "/admin/deposits", tint: "text-warning bg-warning/15" },
    { label: "Pending withdrawals", value: withdrawals.length, icon: ArrowUpFromLine, href: "/admin/withdrawals", tint: "text-warning bg-warning/15" },
    { label: "Active matches", value: active, icon: CircleDot, href: "/admin/matches", tint: "text-primary bg-primary/15" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-4 transition-colors hover:bg-elevated">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.tint}`}><s.icon className="h-5 w-5" /></div>
              <p className="mt-3 text-3xl font-bold tabular-nums">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Deposits to review</h2><Link href="/admin/deposits" className="text-sm text-primary">View all</Link></div>
          {deposits.length === 0 ? <p className="py-6 text-center text-sm text-muted">All caught up.</p> : (
            <div className="divide-y divide-border">
              {deposits.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3 text-sm">
                  <div><p className="font-medium tabular-nums">+91 {d.userMobile}</p><p className="text-xs text-muted">{formatDateTime(d.createdAt)}</p></div>
                  <span className="font-semibold tabular-nums">{inr(d.amount, false)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between"><h2 className="font-semibold">Withdrawals to pay</h2><Link href="/admin/withdrawals" className="text-sm text-primary">View all</Link></div>
          {withdrawals.length === 0 ? <p className="py-6 text-center text-sm text-muted">All caught up.</p> : (
            <div className="divide-y divide-border">
              {withdrawals.slice(0, 4).map((w) => (
                <div key={w.id} className="flex items-center justify-between py-3 text-sm">
                  <div><p className="font-medium tabular-nums">+91 {w.userMobile}</p><p className="text-xs text-muted">{w.method === "upi" ? "UPI" : "Bank"} · {formatDateTime(w.createdAt)}</p></div>
                  <div className="flex items-center gap-2"><span className="font-semibold tabular-nums">{inr(w.amount, false)}</span><StatusBadge status="pending" /></div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
