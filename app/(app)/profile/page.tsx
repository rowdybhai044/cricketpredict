"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Bell, ChevronRight, Download, HelpCircle, LogOut, Moon, ShieldAlert, ShieldCheck, Sliders } from "lucide-react";
import { toast } from "sonner";
import { ME, LIMITS } from "@/lib/mock-data";
import { inr, maskMobile } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/ui/modal";

type BIPEvent = Event & { prompt: () => Promise<void> };

function Row({ icon: Icon, label, right, onClick }: { icon: React.ElementType; label: string; right?: React.ReactNode; onClick?: () => void }) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp onClick={onClick} className="flex w-full items-center gap-3 py-3.5 text-left">
      <Icon className="h-5 w-5 text-muted" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {right ?? (onClick && <ChevronRight className="h-4 w-4 text-muted" />)}
    </Comp>
  );
}

export default function Profile() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notif, setNotif] = useState(true);
  const [logout, setLogout] = useState(false);
  const [install, setInstall] = useState<BIPEvent | null>(null);

  useEffect(() => {
    setMounted(true);
    const h = (e: Event) => { e.preventDefault(); setInstall(e as BIPEvent); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);

  const handleLogout = () => {
    localStorage.clear()
    // router.push('/login');
    router.push("/login")
  }

  return (
    <>
      <PageHeader title="Profile" back={false} />
      <div className="space-y-5 px-4 pt-5">
        <Card className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">{ME.mobile[0]}</div>
          <div>
            <p className="font-semibold tabular-nums">{maskMobile(ME.mobile)}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-primary"><ShieldCheck className="h-3.5 w-3.5" />Mobile verified</p>
          </div>
        </Card>

        {install && (
          <Card className="flex items-center gap-3 border-primary/40 bg-primary/5 p-4">
            <Download className="h-5 w-5 text-primary" />
            <p className="flex-1 text-sm">Install TossWin for faster access.</p>
            <Button size="sm" onClick={() => install.prompt()}>Install</Button>
          </Card>
        )}

        <Card className="divide-y divide-border px-4">
          <Row icon={Moon} label="Dark theme" right={mounted ? <Switch label="Dark theme" checked={resolvedTheme !== "light"} onChange={(v) => setTheme(v ? "dark" : "light")} /> : null} />
          <Row icon={Bell} label="Notifications" right={<Switch label="Notifications" checked={notif} onChange={setNotif} />} />
        </Card>

        <section>
          <h2 className="mb-2 px-1 text-sm font-semibold text-muted">Responsible play</h2>
          <Card className="divide-y divide-border px-4">
            <Row icon={Sliders} label="Deposit and loss limits" onClick={() => toast.info("Limits are a UI placeholder in this demo")} />
            <Row icon={ShieldAlert} label="Take a break / self-exclude" onClick={() => toast.info("Self-exclusion is a UI placeholder in this demo")} />
          </Card>
          <p className="mt-2 px-1 text-xs text-muted">Stake {inr(LIMITS.minStake, false)}–{inr(LIMITS.maxStake, false)} · Min deposit {inr(LIMITS.minDeposit, false)} · Min withdrawal {inr(LIMITS.minWithdraw, false)}</p>
        </section>

        <Card className="divide-y divide-border px-4">
          <Row icon={HelpCircle} label="Help and support" onClick={() => toast.info("Support opens here")} />
          <Row icon={ShieldCheck} label="Terms and privacy" onClick={() => toast.info("Terms open here")} />
          <Row icon={LogOut} label="Log out" onClick={() => setLogout(true)} />
        </Card>

        <Link href="/admin" className="block text-center text-sm text-muted underline">Open admin panel (demo)</Link>
        <p className="pb-2 text-center text-xs text-muted">TossWin v1.0 · 18+ · Play responsibly</p>
      </div>

      <Modal
        open={logout}
        onClose={() => setLogout(false)}
        title="Log out?"
        description="You can log back in with an OTP anytime."
        footer={
          <>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setLogout(false)}
            >
              Stay
            </Button>
            <Button
              variant="dangerSolid"
              className="flex-1"
              onClick={handleLogout}
            >
              Log out
            </Button>
          </>
        }
      >
        <span />
      </Modal>
    </>
  );
}
