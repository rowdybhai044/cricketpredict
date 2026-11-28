"use client";
import { useEffect, useState } from "react";
import { Bell, CircleDot } from "lucide-react";

import { WalletChip } from "@/components/wallet-chip";
import { Tabs } from "@/components/ui/tabs";
import { MatchCard } from "@/components/match-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearGetAllMatchesAction, getAllMatchesAction } from "@/store/actions";
import { GetAllMatchesResponse } from "@/types/matches/responses";
import { MATCHES } from "@/constants";

export default function Matches() {
  const dispatch = useAppDispatch()

  const [tab, setTab] = useState<"live" | "upcoming">("upcoming");

  const [error, setError] = useState('');
  const [matches, setMatches] = useState<GetAllMatchesResponse['matches']>()

  const {
    loading: getAllMatchesLoading,
    successData: getAllMatchesSuccessData,
    error: getAllMatchesError,
    errorInfo: getAllMatchesErrorInfo,
  } = useAppSelector((state) => state.getAllMatchesReducer);

  // handle success data
  useEffect(() => {
    if (getAllMatchesSuccessData) {
      const matchData = getAllMatchesSuccessData.matches || [];
      setMatches(matchData)
      dispatch(clearGetAllMatchesAction())
    }
  }, [getAllMatchesSuccessData, dispatch])

  // handle errors
  useEffect(() => {
    if (getAllMatchesError) {
      if (getAllMatchesErrorInfo) {
        setError(getAllMatchesErrorInfo)
      } else {
        setError("Unable to fetch matches. Please try again.")
      }
    }
  }, [getAllMatchesError, getAllMatchesErrorInfo])

  useEffect(() => {
    dispatch(
      getAllMatchesAction({
        endPoint: `${MATCHES}?status=${tab}`
      })
    )
  }, [dispatch, tab])

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/85 px-4 py-3 pt-safe backdrop-blur">
        <span className="text-xl font-bold tracking-tight">
          Toss<span className="text-primary">Win</span>
        </span>
        <div className="flex items-center gap-2">
          <WalletChip />
          <button
            aria-label="Notifications"
            className="rounded-full p-2 text-muted hover:bg-elevated"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="space-y-4 px-4 pt-5">
        <div>
          <h1 className="text-xl font-semibold">Matches</h1>
          <p className="text-sm text-muted">Predict the toss before the match starts.</p>
        </div>

        <Tabs
          id="home"
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "live", label: "Live" },
            { value: "upcoming", label: "Upcoming" }
          ]}
        />

        {getAllMatchesLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton
                key={i}
                className="h-64 w-full rounded-2xl"
              />
            ))}
          </div>
        ) : error ? (
          // Error
          <div className="py-8 text-center">
            <p className="text-sm text-danger">{error}</p>

            <button
              className="mt-3 text-sm font-semibold text-primary"
              onClick={() =>
                dispatch(
                  getAllMatchesAction({
                    endPoint: `${MATCHES}?status=${tab}`,
                  })
                )
              }
            >
              Try again
            </button>
          </div>
        ) : matches?.length === 0 ? (
          <EmptyState
            icon={<CircleDot className="h-7 w-7" />}
            title={
              tab === "live"
                ? "No live matches right now"
                : "No upcoming matches"
            }
            hint="New matches are added regularly. Check back soon."
          />
        ) : (
          <div className="space-y-4">
            {matches?.map((m, i) => (
              <MatchCard
                key={m.id}
                match={m}
                index={i}
              />
            ))}
          </div>
        )}

        <p className="pt-2 text-center text-xs text-muted">18+ · Play responsibly</p>
      </div>
    </>
  );
}
