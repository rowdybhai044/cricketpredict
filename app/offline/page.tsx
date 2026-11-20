import { WifiOff } from "lucide-react";

export default function Offline() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-elevated text-muted"><WifiOff className="h-7 w-7" /></div>
      <h1 className="text-xl font-semibold">You&apos;re offline</h1>
      <p className="max-w-xs text-sm text-muted">Check your connection. TossWin will reload as soon as you&apos;re back online.</p>
    </main>
  );
}
