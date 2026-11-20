import type { Team } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function TeamLogo({ team, className }: { team: string; className?: string }) {
  return (
    <div
      className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white", className)}
      style={{ backgroundColor: '#DC2626' }}
      aria-hidden
    >
      {team}
    </div>
  );
}
