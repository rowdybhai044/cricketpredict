import { cn } from "@/lib/utils";

export type BadgeKind =
  | "live"
  | "upcoming"
  | "completed"
  | "cancelled"
  | "pending"
  | "approved"
  | "rejected"
  | "won"
  | "lost"
  | "paid"
  | "refunded"
  | "active"
  | "blocked";

const styles: Record<BadgeKind, string> = {
  live: "bg-danger/15 text-danger",
  upcoming: "bg-info/15 text-info",
  completed: "bg-elevated text-muted",
  cancelled: "bg-elevated text-muted",
  pending: "bg-warning/15 text-warning",
  approved: "bg-primary/15 text-primary",
  paid: "bg-primary/15 text-primary",
  won: "bg-primary/15 text-primary",
  lost: "bg-danger/10 text-danger",
  rejected: "bg-danger/15 text-danger",
  refunded: "bg-info/15 text-info",
  active: "bg-primary/15 text-primary",
  blocked: "bg-danger/15 text-danger",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const normalizedStatus = status.toLowerCase();

  const isValidStatus = normalizedStatus in styles;

  const badgeStyle = isValidStatus
    ? styles[normalizedStatus as BadgeKind]
    : "bg-elevated text-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        badgeStyle,
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          normalizedStatus === "live" && "animate-pulse"
        )}
      />
      {status}
    </span>
  );
}