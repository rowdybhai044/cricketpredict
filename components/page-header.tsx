"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WalletChip } from "./wallet-chip";

export function PageHeader({ title, back = true, showWallet = true }: { title: string; back?: boolean; showWallet?: boolean }) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 pt-safe backdrop-blur">
      {back && (
        <button onClick={() => router.back()} aria-label="Go back" className="-ml-1.5 rounded-full p-1.5 hover:bg-elevated">
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}
      <h1 className="flex-1 text-lg font-semibold">{title}</h1>
      {showWallet && <WalletChip />}
    </header>
  );
}
