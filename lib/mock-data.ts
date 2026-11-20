export type Team = { name: string; code: string; color: string };
export type MatchStatus = "upcoming" | "live" | "completed" | "cancelled";
export type Match = {
  id: string;
  tournament: string;
  format: string;
  teamA: Team;
  teamB: Team;
  tossType: "team" | "headsTails";
  oddsA: number;
  oddsB: number;
  startTime: string; // YYYY-MM-DDTHH:mm
  status: MatchStatus;
  result?: "A" | "B";
};
export type Bet = {
  id: string;
  matchId: string;
  pick: "A" | "B";
  stake: number;
  odds: number;
  status: "pending" | "won" | "lost" | "refunded";
  createdAt: string;
};
export type Txn = {
  id: string;
  type: "deposit" | "withdrawal" | "bet_win" | "bet_loss" | "refund";
  title: string;
  amount: number; // signed
  status: "pending" | "approved" | "rejected" | "completed";
  createdAt: string;
};
export type DepositReq = {
  id: string;
  userId: string;
  userMobile: string;
  amount: number;
  utr: string;
  hasScreenshot: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};
export type WithdrawalReq = {
  id: string;
  userId: string;
  userMobile: string;
  amount: number;
  method: "upi" | "bank";
  upiId?: string;
  bankName?: string;
  accountNo?: string;
  ifsc?: string;
  status: "pending" | "paid" | "rejected";
  createdAt: string;
};
export type AdminUser = {
  id: string;
  mobile: string;
  balance: number;
  status: "active" | "blocked";
  joined: string;
  bets: number;
};

export const LIMITS = {
  minDeposit: 200,
  minWithdraw: 500,
  minStake: 100,
  maxStake: 10000,
};

export const ME = { id: "me", mobile: "9876543212" };
export const UPI_ID = "tosswin@okaxis";

const T = (name: string, code: string, color: string): Team => ({ name, code, color });
export const TEAMS = {
  MI: T("Mumbai Indians", "MI", "#2563EB"),
  CSK: T("Chennai Super Kings", "CSK", "#EAB308"),
  RCB: T("Royal Challengers", "RCB", "#DC2626"),
  KKR: T("Kolkata Knight Riders", "KKR", "#7C3AED"),
  DC: T("Delhi Capitals", "DC", "#0EA5E9"),
  RR: T("Rajasthan Royals", "RR", "#DB2777"),
  SRH: T("Sunrisers Hyderabad", "SRH", "#F97316"),
  GT: T("Gujarat Titans", "GT", "#0F766E"),
  PBKS: T("Punjab Kings", "PBKS", "#E11D48"),
  LSG: T("Lucknow Super Giants", "LSG", "#06B6D4"),
  IND: T("India", "IND", "#1D4ED8"),
  AUS: T("Australia", "AUS", "#CA8A04"),
};

export const initialMatches: Match[] = [
  { id: "m1", tournament: "IPL 2026", format: "T20", teamA: TEAMS.MI, teamB: TEAMS.CSK, tossType: "team", oddsA: 1.95, oddsB: 1.95, startTime: "2026-11-15T19:30", status: "live" },
  { id: "m2", tournament: "IPL 2026", format: "T20", teamA: TEAMS.RCB, teamB: TEAMS.KKR, tossType: "headsTails", oddsA: 1.9, oddsB: 1.9, startTime: "2026-11-15T15:30", status: "live" },
  { id: "m3", tournament: "IPL 2026", format: "T20", teamA: TEAMS.DC, teamB: TEAMS.RR, tossType: "team", oddsA: 1.92, oddsB: 1.98, startTime: "2026-11-16T19:30", status: "upcoming" },
  { id: "m4", tournament: "IPL 2026", format: "T20", teamA: TEAMS.SRH, teamB: TEAMS.GT, tossType: "team", oddsA: 1.97, oddsB: 1.93, startTime: "2026-11-17T19:30", status: "upcoming" },
  { id: "m5", tournament: "IPL 2026", format: "T20", teamA: TEAMS.PBKS, teamB: TEAMS.LSG, tossType: "headsTails", oddsA: 1.9, oddsB: 1.9, startTime: "2026-11-18T15:30", status: "upcoming" },
  { id: "m6", tournament: "Border-Gavaskar Series", format: "ODI", teamA: TEAMS.IND, teamB: TEAMS.AUS, tossType: "team", oddsA: 1.94, oddsB: 1.94, startTime: "2026-11-20T09:00", status: "upcoming" },
  { id: "m7", tournament: "IPL 2026", format: "T20", teamA: TEAMS.KKR, teamB: TEAMS.MI, tossType: "team", oddsA: 1.95, oddsB: 1.95, startTime: "2026-11-13T19:30", status: "completed", result: "A" },
  { id: "m8", tournament: "IPL 2026", format: "T20", teamA: TEAMS.GT, teamB: TEAMS.DC, tossType: "team", oddsA: 1.95, oddsB: 1.95, startTime: "2026-11-14T19:30", status: "cancelled" },
];

export const initialBets: Bet[] = [
  { id: "b1", matchId: "m1", pick: "A", stake: 500, odds: 1.95, status: "pending", createdAt: "2026-11-15T18:45" },
  { id: "b2", matchId: "m7", pick: "A", stake: 1000, odds: 1.95, status: "won", createdAt: "2026-11-13T18:10" },
  { id: "b3", matchId: "m7", pick: "B", stake: 300, odds: 1.95, status: "lost", createdAt: "2026-11-13T18:12" },
];

export const initialTxns: Txn[] = [
  { id: "t1", type: "deposit", title: "Deposit via UPI", amount: 2000, status: "approved", createdAt: "2026-11-12T11:20" },
  { id: "t2", type: "bet_win", title: "Won · KKR vs MI", amount: 1950, status: "completed", createdAt: "2026-11-13T19:50" },
  { id: "t3", type: "bet_loss", title: "Lost · KKR vs MI", amount: -300, status: "completed", createdAt: "2026-11-13T19:50" },
  { id: "t4", type: "withdrawal", title: "Withdrawal to UPI", amount: -1000, status: "completed", createdAt: "2026-11-14T10:05" },
  { id: "t5", type: "deposit", title: "Deposit via UPI", amount: 500, status: "rejected", createdAt: "2026-11-14T16:40" },
];

export const initialDeposits: DepositReq[] = [
  { id: "d1", userId: "u1", userMobile: "9812345678", amount: 1000, utr: "412398765012", hasScreenshot: true, status: "pending", createdAt: "2026-11-15T17:30" },
  { id: "d2", userId: "u2", userMobile: "9900112233", amount: 2500, utr: "412398761144", hasScreenshot: false, status: "pending", createdAt: "2026-11-15T17:52" },
  { id: "d3", userId: "u3", userMobile: "9988776655", amount: 500, utr: "412398760078", hasScreenshot: true, status: "pending", createdAt: "2026-11-15T18:05" },
  { id: "d4", userId: "u4", userMobile: "9123456780", amount: 5000, utr: "412398750021", hasScreenshot: true, status: "approved", createdAt: "2026-11-15T12:10" },
];

export const initialWithdrawals: WithdrawalReq[] = [
  { id: "w1", userId: "u1", userMobile: "9812345678", amount: 1500, method: "upi", upiId: "rahul.k@okhdfcbank", status: "pending", createdAt: "2026-11-15T16:10" },
  { id: "w2", userId: "u5", userMobile: "9701234567", amount: 3000, method: "bank", bankName: "State Bank of India", accountNo: "30124567890", ifsc: "SBIN0001234", status: "pending", createdAt: "2026-11-15T17:00" },
  { id: "w3", userId: "u2", userMobile: "9900112233", amount: 800, method: "upi", upiId: "anita@ybl", status: "paid", createdAt: "2026-11-14T13:00" },
];

export const initialUsers: AdminUser[] = [
  { id: "me", mobile: ME.mobile, balance: 2450, status: "active", joined: "2026-10-02", bets: 3 },
  { id: "u1", mobile: "9812345678", balance: 5120, status: "active", joined: "2026-09-18", bets: 42 },
  { id: "u2", mobile: "9900112233", balance: 310, status: "active", joined: "2026-10-11", bets: 17 },
  { id: "u3", mobile: "9988776655", balance: 0, status: "active", joined: "2026-11-01", bets: 4 },
  { id: "u4", mobile: "9123456780", balance: 8800, status: "active", joined: "2026-08-22", bets: 98 },
  { id: "u5", mobile: "9701234567", balance: 3200, status: "blocked", joined: "2026-07-30", bets: 61 },
];

export const INITIAL_BALANCE = 2450;
