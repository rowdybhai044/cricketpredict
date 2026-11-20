"use client";
import { create } from "zustand";
import {
  ME, INITIAL_BALANCE, initialMatches, initialBets, initialTxns, initialDeposits,
  initialWithdrawals, initialUsers,
  type Match, type Bet, type Txn, type DepositReq, type WithdrawalReq, type AdminUser,
} from "./mock-data";
import { nowLocalIso, optionLabel } from "./utils";

let seq = 100;
const id = (p: string) => `${p}${++seq}`;

type WithdrawInput = Omit<WithdrawalReq, "id" | "userId" | "userMobile" | "status" | "createdAt">;

type State = {
  balance: number;
  matches: Match[];
  bets: Bet[];
  txns: Txn[];
  deposits: DepositReq[];
  withdrawals: WithdrawalReq[];
  users: AdminUser[];
  qrUrl: string;
  qrUpdatedAt: string;
  // user actions
  placeBet: (matchId: string, pick: "A" | "B", stake: number) => void;
  submitDeposit: (amount: number, utr: string, hasScreenshot: boolean) => string;
  submitWithdrawal: (w: WithdrawInput) => string;
  // admin actions
  approveDeposit: (id: string) => void;
  rejectDeposit: (id: string) => void;
  markPaid: (id: string) => void;
  rejectWithdrawal: (id: string) => void;
  saveMatch: (m: Omit<Match, "id"> & { id?: string }) => void;
  setResult: (matchId: string, winner: "A" | "B") => void;
  cancelMatch: (matchId: string) => void;
  setQr: (url: string) => void;
};

export const useStore = create<State>((set, get) => ({
  balance: INITIAL_BALANCE,
  matches: initialMatches,
  bets: initialBets,
  txns: initialTxns,
  deposits: initialDeposits,
  withdrawals: initialWithdrawals,
  users: initialUsers,
  qrUrl: "/qr.svg",
  qrUpdatedAt: "2026-11-01T10:00",

  placeBet: (matchId, pick, stake) => {
    const m = get().matches.find((x) => x.id === matchId);
    if (!m) return;
    const odds = pick === "A" ? m.oddsA : m.oddsB;
    set((s) => ({
      balance: s.balance - stake,
      bets: [{ id: id("b"), matchId, pick, stake, odds, status: "pending", createdAt: nowLocalIso() }, ...s.bets],
    }));
  },

  submitDeposit: (amount, utr, hasScreenshot) => {
    const rid = id("d");
    set((s) => ({
      deposits: [{ id: rid, userId: ME.id, userMobile: ME.mobile, amount, utr, hasScreenshot, status: "pending", createdAt: nowLocalIso() }, ...s.deposits],
      txns: [{ id: id("t"), type: "deposit", title: "Deposit via UPI", amount, status: "pending", createdAt: nowLocalIso() }, ...s.txns],
    }));
    return rid;
  },

  submitWithdrawal: (w) => {
    const rid = id("w");
    set((s) => ({
      balance: s.balance - w.amount,
      withdrawals: [{ ...w, id: rid, userId: ME.id, userMobile: ME.mobile, status: "pending", createdAt: nowLocalIso() }, ...s.withdrawals],
      txns: [{ id: id("t"), type: "withdrawal", title: `Withdrawal to ${w.method === "upi" ? "UPI" : "bank"}`, amount: -w.amount, status: "pending", createdAt: nowLocalIso() }, ...s.txns],
    }));
    return rid;
  },

  approveDeposit: (rid) =>
    set((s) => {
      const d = s.deposits.find((x) => x.id === rid);
      if (!d) return s;
      const mine = d.userId === ME.id;
      return {
        deposits: s.deposits.map((x) => (x.id === rid ? { ...x, status: "approved" as const } : x)),
        users: s.users.map((u) => (u.id === d.userId ? { ...u, balance: u.balance + d.amount } : u)),
        balance: mine ? s.balance + d.amount : s.balance,
        txns: mine ? s.txns.map((t, i) => (i === s.txns.findIndex((q) => q.type === "deposit" && q.status === "pending" && q.amount === d.amount) ? { ...t, status: "approved" as const } : t)) : s.txns,
      };
    }),

  rejectDeposit: (rid) =>
    set((s) => {
      const d = s.deposits.find((x) => x.id === rid);
      if (!d) return s;
      const mine = d.userId === ME.id;
      const idx = s.txns.findIndex((q) => q.type === "deposit" && q.status === "pending" && q.amount === d.amount);
      return {
        deposits: s.deposits.map((x) => (x.id === rid ? { ...x, status: "rejected" as const } : x)),
        txns: mine ? s.txns.map((t, i) => (i === idx ? { ...t, status: "rejected" as const } : t)) : s.txns,
      };
    }),

  markPaid: (rid) =>
    set((s) => {
      const w = s.withdrawals.find((x) => x.id === rid);
      if (!w) return s;
      const idx = s.txns.findIndex((q) => q.type === "withdrawal" && q.status === "pending" && q.amount === -w.amount);
      return {
        withdrawals: s.withdrawals.map((x) => (x.id === rid ? { ...x, status: "paid" as const } : x)),
        txns: w.userId === ME.id ? s.txns.map((t, i) => (i === idx ? { ...t, status: "completed" as const } : t)) : s.txns,
      };
    }),

  rejectWithdrawal: (rid) =>
    set((s) => {
      const w = s.withdrawals.find((x) => x.id === rid);
      if (!w) return s;
      const mine = w.userId === ME.id;
      const idx = s.txns.findIndex((q) => q.type === "withdrawal" && q.status === "pending" && q.amount === -w.amount);
      return {
        withdrawals: s.withdrawals.map((x) => (x.id === rid ? { ...x, status: "rejected" as const } : x)),
        balance: mine ? s.balance + w.amount : s.balance,
        txns: mine ? s.txns.map((t, i) => (i === idx ? { ...t, status: "rejected" as const } : t)) : s.txns,
      };
    }),

  saveMatch: (m) =>
    set((s) => {
      if (m.id) return { matches: s.matches.map((x) => (x.id === m.id ? ({ ...x, ...m } as Match) : x)) };
      return { matches: [{ ...m, id: id("m") } as Match, ...s.matches] };
    }),

  setResult: (matchId, winner) =>
    set((s) => {
      const m = s.matches.find((x) => x.id === matchId);
      if (!m) return s;
      let balance = s.balance;
      const newTxns: Txn[] = [];
      const bets = s.bets.map((b) => {
        if (b.matchId !== matchId || b.status !== "pending") return b;
        const label = `${m.teamA.code} vs ${m.teamB.code}`;
        if (b.pick === winner) {
          const payout = Math.round(b.stake * b.odds * 100) / 100;
          balance += payout;
          newTxns.push({ id: id("t"), type: "bet_win", title: `Won · ${label} (${optionLabel(m, b.pick)})`, amount: payout, status: "completed", createdAt: nowLocalIso() });
          return { ...b, status: "won" as const };
        }
        newTxns.push({ id: id("t"), type: "bet_loss", title: `Lost · ${label} (${optionLabel(m, b.pick)})`, amount: -b.stake, status: "completed", createdAt: nowLocalIso() });
        return { ...b, status: "lost" as const };
      });
      return {
        balance,
        bets,
        txns: [...newTxns, ...s.txns],
        matches: s.matches.map((x) => (x.id === matchId ? { ...x, status: "completed" as const, result: winner } : x)),
      };
    }),

  cancelMatch: (matchId) =>
    set((s) => {
      let balance = s.balance;
      const newTxns: Txn[] = [];
      const m = s.matches.find((x) => x.id === matchId);
      const bets = s.bets.map((b) => {
        if (b.matchId !== matchId || b.status !== "pending") return b;
        balance += b.stake;
        newTxns.push({ id: id("t"), type: "refund", title: `Refund · ${m ? `${m.teamA.code} vs ${m.teamB.code}` : "match"} cancelled`, amount: b.stake, status: "completed", createdAt: nowLocalIso() });
        return { ...b, status: "refunded" as const };
      });
      return {
        balance,
        bets,
        txns: [...newTxns, ...s.txns],
        matches: s.matches.map((x) => (x.id === matchId ? { ...x, status: "cancelled" as const } : x)),
      };
    }),

  setQr: (url) => set({ qrUrl: url, qrUpdatedAt: nowLocalIso() }),
}));

export const selectActiveWithdrawal = (s: State) =>
  s.withdrawals.find((w) => w.userId === ME.id && w.status === "pending");
