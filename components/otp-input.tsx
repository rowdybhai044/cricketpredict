"use client";
import { useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  length?: number;
};

export function OtpInput({ value, onChange, disabled, length = 6 }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  const update = (i: number, raw: string) => {
    const c = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = c;
    onChange(next.join(""));
    if (c && i < length - 1) refs.current[i + 1]?.focus();
  };

  const onKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    e.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-between gap-2" onPaste={onPaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={d}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          disabled={disabled}
          onChange={(e) => update(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          className="h-14 w-full min-w-0 rounded-xl border border-border bg-elevated text-center text-xl font-semibold tabular-nums focus-visible:border-primary"
        />
      ))}
    </div>
  );
}