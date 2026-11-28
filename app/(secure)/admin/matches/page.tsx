"use client";
import { useState } from "react";
import { Ban, CircleDot, Pencil, Plus, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import type { Match, MatchStatus } from "@/lib/mock-data";
import { cn, formatDateTime, optionLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chips } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Field, Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { TeamLogo } from "@/components/team-logo";

type F = "all" | MatchStatus;
const COLORS = ["#2563EB", "#DC2626", "#7C3AED", "#0EA5E9", "#DB2777", "#F97316", "#0F766E", "#CA8A04"];
const colorFor = (s: string) => COLORS[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];

type Form = {
  id?: string; aName: string; aCode: string; bName: string; bCode: string; tossType: "team" | "headsTails";
  oddsA: string; oddsB: string; startTime: string; tournament: string; format: string; status: MatchStatus;
};
const emptyForm: Form = { aName: "", aCode: "", bName: "", bCode: "", tossType: "team", oddsA: "1.95", oddsB: "1.95", startTime: "2026-11-21T19:30", tournament: "IPL 2026", format: "T20", status: "upcoming" };

export default function AdminMatches() {
  const matches = useStore((s) => s.matches);
  const saveMatch = useStore((s) => s.saveMatch);
  const setResult = useStore((s) => s.setResult);
  const cancelMatch = useStore((s) => s.cancelMatch);

  const [f, setF] = useState<F>("all");
  const [form, setForm] = useState<Form | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resultFor, setResultFor] = useState<Match | null>(null);
  const [winner, setWinner] = useState<"A" | "B">("A");
  const [cancelFor, setCancelFor] = useState<Match | null>(null);

  const list = matches.filter((m) => f === "all" || m.status === f);
  const up = (p: Partial<Form>) => setForm((x) => (x ? { ...x, ...p } : x));
  const liveLocked = form?.status === "live" && !!form.id;

  const openEdit = (m: Match) => {
    setErrors({});
    setForm({ id: m.id, aName: m.teamA.name, aCode: m.teamA.code, bName: m.teamB.name, bCode: m.teamB.code, tossType: m.tossType, oddsA: String(m.oddsA), oddsB: String(m.oddsB), startTime: m.startTime, tournament: m.tournament, format: m.format, status: m.status });
  };

  const submit = () => {
    if (!form) return;
    const e: Record<string, string> = {};
    if (!form.aName.trim()) e.aName = "Enter Team A name.";
    if (!form.bName.trim()) e.bName = "Enter Team B name.";
    if (!form.aCode.trim()) e.aCode = "Add a short code.";
    if (!form.bCode.trim()) e.bCode = "Add a short code.";
    if (!(Number(form.oddsA) >= 1.01)) e.oddsA = "Odds must be at least 1.01.";
    if (!(Number(form.oddsB) >= 1.01)) e.oddsB = "Odds must be at least 1.01.";
    if (!form.startTime) e.startTime = "Pick a start time.";
    setErrors(e);
    if (Object.keys(e).length) return;
    saveMatch({
      id: form.id, tournament: form.tournament, format: form.format, tossType: form.tossType,
      teamA: { name: form.aName, code: form.aCode.toUpperCase(), color: colorFor(form.aName) },
      teamB: { name: form.bName, code: form.bCode.toUpperCase(), color: colorFor(form.bName) },
      oddsA: Number(form.oddsA), oddsB: Number(form.oddsB), startTime: form.startTime, status: form.status,
    });
    toast.success(form.id ? "Match updated" : "Match created");
    setForm(null);
  };

  const canResult = (m: Match) => m.status === "live" || (m.status === "completed" && !m.result);
  const canCancel = (m: Match) => m.status === "upcoming";

  const Actions = ({ m }: { m: Match }) => (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="secondary" onClick={() => openEdit(m)}><Pencil className="h-3.5 w-3.5" />Edit</Button>
      <Button size="sm" variant="secondary" disabled={!canResult(m)} title={canResult(m) ? "" : "Available once the match is live or completed"} onClick={() => { setWinner("A"); setResultFor(m); }}><Trophy className="h-3.5 w-3.5" />Set result</Button>
      <Button size="sm" variant="danger" disabled={!canCancel(m)} title={canCancel(m) ? "" : "Only matches that haven't started can be cancelled"} onClick={() => setCancelFor(m)}><Ban className="h-3.5 w-3.5" />Cancel</Button>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Matches</h1>
        <Button onClick={() => { setErrors({}); setForm({ ...emptyForm }); }}><Plus className="h-5 w-5" />Create match</Button>
      </div>
      <Chips<F> value={f} onChange={setF} items={(["all", "upcoming", "live", "completed", "cancelled"] as F[]).map((k) => ({ value: k, label: k[0].toUpperCase() + k.slice(1) }))} />

      {list.length === 0 ? (
        <Card><EmptyState icon={<CircleDot className="h-7 w-7" />} title="No matches yet" hint="Create your first match to start taking bets." action={<Button onClick={() => setForm({ ...emptyForm })}>Create match</Button>} /></Card>
      ) : (
        <>
          <Card className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-muted">
                <tr><th className="p-4 font-medium">Teams</th><th className="p-4 font-medium">Toss and odds</th><th className="p-4 font-medium">Start</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {list.map((m) => (
                  <tr key={m.id}>
                    <td className="p-4"><p className="font-semibold">{m.teamA.name}</p><p className="text-muted">vs {m.teamB.name}</p></td>
                    <td className="p-4"><p className="text-muted">{m.tossType === "team" ? "Team vs team" : "Heads / tails"}</p><p className="tabular-nums text-accent">{m.oddsA.toFixed(2)}x · {m.oddsB.toFixed(2)}x</p></td>
                    <td className="p-4 tabular-nums">{formatDateTime(m.startTime)}</td>
                    <td className="p-4"><StatusBadge status={m.status} />{m.result && <p className="mt-1 text-xs text-muted">Won toss: {optionLabel(m, m.result)}</p>}</td>
                    <td className="p-4"><Actions m={m} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="space-y-3 md:hidden">
            {list.map((m) => (
              <Card key={m.id} className="space-y-3 p-4">
                <div className="flex items-center justify-between"><p className="text-xs text-muted">{m.tournament} · {m.format}</p><StatusBadge status={m.status} /></div>
                <div className="flex items-center gap-3"><TeamLogo team={m.teamA} className="h-8 w-8" /><span className="font-semibold">{m.teamA.name}</span></div>
                <div className="flex items-center gap-3"><TeamLogo team={m.teamB} className="h-8 w-8" /><span className="font-semibold">{m.teamB.name}</span></div>
                <p className="text-sm text-muted">{formatDateTime(m.startTime)} · <span className="tabular-nums text-accent">{m.oddsA.toFixed(2)}x / {m.oddsB.toFixed(2)}x</span>{m.result && <> · Won toss: {optionLabel(m, m.result)}</>}</p>
                <Actions m={m} />
              </Card>
            ))}
          </div>
        </>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} variant="sheet" title={form?.id ? "Edit match" : "Create match"} description={liveLocked ? "This match is live. Teams and odds are locked." : undefined}
        footer={<><Button variant="outline" className="flex-1" onClick={() => setForm(null)}>Cancel</Button><Button className="flex-1" onClick={submit}>Save match</Button></>}>
        {form && (
          <div className="space-y-4 pb-2">
            <div className="grid grid-cols-[1fr_88px] gap-3">
              <Field label="Team A" error={errors.aName}><Input disabled={liveLocked} value={form.aName} onChange={(e) => up({ aName: e.target.value })} placeholder="Mumbai Indians" /></Field>
              <Field label="Code" error={errors.aCode}><Input disabled={liveLocked} maxLength={4} className="uppercase" value={form.aCode} onChange={(e) => up({ aCode: e.target.value })} placeholder="MI" /></Field>
            </div>
            <div className="grid grid-cols-[1fr_88px] gap-3">
              <Field label="Team B" error={errors.bName}><Input disabled={liveLocked} value={form.bName} onChange={(e) => up({ bName: e.target.value })} placeholder="Chennai Super Kings" /></Field>
              <Field label="Code" error={errors.bCode}><Input disabled={liveLocked} maxLength={4} className="uppercase" value={form.bCode} onChange={(e) => up({ bCode: e.target.value })} placeholder="CSK" /></Field>
            </div>

            <div>
              <span className="text-sm font-medium">Toss type</span>
              <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl bg-elevated p-1">
                {([["team", "Team vs team"], ["headsTails", "Heads vs tails"]] as const).map(([v, l]) => (
                  <button key={v} disabled={liveLocked} onClick={() => up({ tossType: v })} className={cn("rounded-lg py-2 text-sm font-semibold transition-colors", form.tossType === v ? "bg-surface text-foreground shadow-sm" : "text-muted")}>{l}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label={form.tossType === "team" ? "Odds · Team A" : "Odds · Heads"} error={errors.oddsA}><Input disabled={liveLocked} type="number" step="0.01" min="1.01" inputMode="decimal" value={form.oddsA} onChange={(e) => up({ oddsA: e.target.value })} /></Field>
              <Field label={form.tossType === "team" ? "Odds · Team B" : "Odds · Tails"} error={errors.oddsB}><Input disabled={liveLocked} type="number" step="0.01" min="1.01" inputMode="decimal" value={form.oddsB} onChange={(e) => up({ oddsB: e.target.value })} /></Field>
            </div>

            <Field label="Start date and time" error={errors.startTime}><Input type="datetime-local" value={form.startTime} onChange={(e) => up({ startTime: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tournament"><Input value={form.tournament} onChange={(e) => up({ tournament: e.target.value })} /></Field>
              <Field label="Format"><Input value={form.format} onChange={(e) => up({ format: e.target.value })} /></Field>
            </div>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => up({ status: e.target.value as MatchStatus })}>
                <option value="upcoming">Upcoming</option><option value="live">Live</option><option value="completed">Completed</option>
              </Select>
            </Field>
          </div>
        )}
      </Modal>

      <Modal open={!!resultFor} onClose={() => setResultFor(null)} title="Set result" description="Choose the toss winner. This will settle all pending bets."
        footer={<><Button variant="outline" className="flex-1" onClick={() => setResultFor(null)}>Cancel</Button><Button className="flex-1" onClick={() => { if (resultFor) { setResult(resultFor.id, winner); toast.success("Result saved", { description: "Pending bets have been settled." }); } setResultFor(null); }}>Confirm result</Button></>}>
        {resultFor && (
          <div className="space-y-2" role="radiogroup">
            {(["A", "B"] as const).map((s) => (
              <button key={s} role="radio" aria-checked={winner === s} onClick={() => setWinner(s)} className={cn("flex w-full items-center justify-between rounded-xl border-2 p-3.5 text-left text-sm font-medium", winner === s ? "border-primary bg-primary/10" : "border-border")}>
                {optionLabel(resultFor, s)}
                <span className={cn("h-4 w-4 rounded-full border-2", winner === s ? "border-primary bg-primary" : "border-border")} />
              </button>
            ))}
          </div>
        )}
      </Modal>

      <Modal open={!!cancelFor} onClose={() => setCancelFor(null)} title="Cancel this match?" description="All pending stakes will be refunded to users. This can't be undone."
        footer={<><Button variant="outline" className="flex-1" onClick={() => setCancelFor(null)}>Keep match</Button><Button variant="dangerSolid" className="flex-1" onClick={() => { if (cancelFor) { cancelMatch(cancelFor.id); toast.success("Match cancelled", { description: "Stakes refunded." }); } setCancelFor(null); }}>Cancel match</Button></>}>
        <span />
      </Modal>
    </div>
  );
}
