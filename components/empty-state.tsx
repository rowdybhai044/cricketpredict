import { cn } from "@/lib/utils";

export function EmptyState({
  icon, title, hint, action, className,
}: { icon: React.ReactNode; title: string; hint?: string; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-14 text-center", className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-elevated text-muted">{icon}</div>
      <p className="font-semibold">{title}</p>
      {hint && <p className="mt-1 max-w-[260px] text-sm text-muted">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
