"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, CircleDot, LayoutDashboard, Menu, QrCode, Users, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageTransition } from "@/components/page-transition";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/matches", label: "Matches", icon: CircleDot },
  { href: "/admin/deposits", label: "Deposits", icon: ArrowDownToLine },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpFromLine },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/qr", label: "QR code", icon: QrCode },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <nav className="space-y-1" aria-label="Admin">
      {nav.map(({ href, label, icon: Icon }) => {
        const on = href === "/admin" ? path === href : path.startsWith(href);
        return (
          <Link key={href} href={href} onClick={onNavigate} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", on ? "bg-primary/10 text-primary" : "text-muted hover:bg-elevated hover:text-foreground")}>
            <Icon className="h-5 w-5" />{label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <div className="mb-6 px-3">
      <span className="text-xl font-bold tracking-tight">Toss<span className="text-primary">Win</span></span>
      <span className="ml-2 rounded bg-elevated px-1.5 py-0.5 text-[11px] font-medium text-muted">Admin</span>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-border bg-surface p-4 md:flex">
        <Brand />
        <NavList />
        <Link href="/" className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-foreground"><ArrowLeft className="h-4 w-4" />Back to app</Link>
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 pt-safe backdrop-blur md:hidden">
        <button aria-label="Open menu" onClick={() => setOpen(true)} className="-ml-1.5 rounded-full p-1.5 hover:bg-elevated"><Menu className="h-5 w-5" /></button>
        <span className="font-bold tracking-tight">Toss<span className="text-primary">Win</span> <span className="text-xs font-medium text-muted">Admin</span></span>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div className="absolute inset-0 bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-surface p-4 pt-safe" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 320 }}>
              <div className="flex items-start justify-between"><Brand /><button aria-label="Close menu" onClick={() => setOpen(false)} className="rounded-full p-1.5 hover:bg-elevated"><X className="h-5 w-5" /></button></div>
              <NavList onNavigate={() => setOpen(false)} />
              <Link href="/" className="mt-auto flex items-center gap-2 px-3 py-2 text-sm text-muted"><ArrowLeft className="h-4 w-4" />Back to app</Link>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main className="md:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8"><PageTransition>{children}</PageTransition></div>
      </main>
    </div>
  );
}
