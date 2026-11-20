"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Card } from "./ui/card";
import { StatusBadge } from "./ui/badge";
import { Button } from "./ui/button";
import { TeamLogo } from "./team-logo";
import { formatDateTime } from "@/lib/utils";
import { MatchData } from "@/types/matches/responses";

export function MatchCard({ match, index = 0 }: { match: MatchData; index?: number }) {
  const closed = match.status !== "upcoming";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.2 }}>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">{match.league_name} · {match.game_type}</p>
          <StatusBadge status={match.status} />
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3">
            <TeamLogo team={match.team_a_code} />
            <span className="font-semibold">{match.team_a}</span>
          </div>
          <div className="flex items-center gap-3">
            <TeamLogo team={match.team_b_code} />
            <span className="font-semibold">{match.team_b}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-sm text-muted">
          <Clock className="h-4 w-4" /> Bet Closes at {formatDateTime(match.bet_close_time)}
          {/* <span className="ml-1 rounded bg-elevated px-1.5 py-0.5 text-[11px]">{match.tossType === "team" ? "Toss winner" : "Heads / Tails"}</span> */}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {(["A", "B"] as const).map((s) => (
            <div key={s} className="flex items-center justify-between rounded-xl border border-border bg-elevated px-3 py-2.5">
              <span className="truncate pr-2 text-sm text-muted">{(s === "A" ? match.team_a_code : match.team_b_code)}</span>
              <span className="font-semibold tabular-nums text-accent">{(s === "A" ? match.odds_a : match.odds_b)}x</span>
            </div>
          ))}
        </div>

        {closed ? (
          <Button className="mt-3 w-full" variant="secondary" disabled>Betting closed</Button>
        ) : (
          <Link href={`/match/${match.id}`} className="mt-3 block">
            <Button className="w-full">Place bet</Button>
          </Link>
        )}
      </Card>
    </motion.div>
  );
}
