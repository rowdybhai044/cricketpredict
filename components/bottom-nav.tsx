"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Ticket, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/bets", label: "My Bets", icon: Ticket },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const path = usePathname();
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-surface/95 pb-safe backdrop-blur" aria-label="Main">
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, icon: Icon }) => {
          const on = active(href);
          return (
            <li key={href}>
              <Link href={href} className={cn("relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors", on ? "text-primary" : "text-muted")}>
                {on && <motion.span layoutId="nav-pill" className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                <Icon className="h-5 w-5" strokeWidth={on ? 2.5 : 2} fill={on ? "currentColor" : "none"} fillOpacity={on ? 0.15 : 0} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
