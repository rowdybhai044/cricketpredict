import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Match } from "./mock-data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function inr(n: number, decimals = true) {
  return (
    "₹" +
    n.toLocaleString("en-IN", {
      minimumFractionDigits: decimals ? 2 : 0,
      maximumFractionDigits: decimals ? 2 : 0,
    })
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MOCK_TODAY = "2026-11-15";

/** Deterministic (SSR-safe) formatting of "YYYY-MM-DDTHH:mm" strings. */
export function formatDateTime(iso: string) {
  const [d, t] = iso.split("T");
  const [, m, day] = d.split("-").map(Number);
  const [h, min] = t.split(":").map(Number);
  const time = `${h % 12 || 12}:${String(min).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  const date = d === MOCK_TODAY ? "Today" : `${day} ${MONTHS[m - 1]}`;
  return `${date}, ${time}`;
}

export function nowLocalIso() {
  const n = new Date();
  const p = (x: number) => String(x).padStart(2, "0");
  return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}T${p(n.getHours())}:${p(n.getMinutes())}`;
}

export function optionLabel(m: Match, side: "A" | "B") {
  if (m.tossType === "headsTails") return side === "A" ? "Heads" : "Tails";
  return side === "A" ? m.teamA.name : m.teamB.name;
}

export function maskMobile(m: string) {
  return `+91 ${m.slice(0, 2)}••••••${m.slice(-2)}`;
}
