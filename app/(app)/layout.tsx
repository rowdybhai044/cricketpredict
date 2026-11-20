"use client";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { PageTransition } from "@/components/page-transition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const hideNav = path.startsWith("/match/") || path === "/wallet/deposit" || path === "/wallet/withdraw";
  return (
    <div className="min-h-dvh bg-elevated/40">
      <div className="relative mx-auto min-h-dvh max-w-md border-x border-border bg-background">
        <div className={hideNav ? "pb-8" : "pb-24"}>
          <PageTransition>{children}</PageTransition>
        </div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}
