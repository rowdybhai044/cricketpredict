"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

export default function SetPassword() {
  const router = useRouter();
  const [p, setP] = useState("");
  const [c, setC] = useState("");
  const s = strength(p);
  const labels = ["Too short", "Weak", "Fair", "Good", "Strong"];
  const ok = p.length >= 8 && p === c;

  return (
    <>
      <div className="flex-1 pt-10">
        <h1 className="text-2xl font-bold">Set a password</h1>
        <p className="mt-2 text-muted">Optional. You can always log in with an OTP instead.</p>
        <div className="mt-8 space-y-5">
          <div>
            <Field label="Password">
              <Input type="password" autoComplete="new-password" value={p} onChange={(e) => setP(e.target.value)} placeholder="At least 8 characters" />
            </Field>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className={cn("h-1 flex-1 rounded-full bg-border transition-colors", s >= n && (s <= 1 ? "bg-danger" : s <= 2 ? "bg-warning" : "bg-primary"))} />
                ))}
              </div>
              <span className="text-xs text-muted">{p ? labels[s] : ""}</span>
            </div>
          </div>
          <Field label="Confirm password" error={c.length > 0 && c !== p && "Passwords don't match."}>
            <Input type="password" autoComplete="new-password" value={c} onChange={(e) => setC(e.target.value)} />
          </Field>
        </div>
      </div>
      <div className="space-y-2">
        <Button className="w-full" disabled={!ok} onClick={() => { toast.success("Password saved"); router.push("/"); }}>Save password</Button>
        <Button className="w-full" variant="ghost" onClick={() => router.push("/")}>Skip for now</Button>
      </div>
    </>
  );
}
