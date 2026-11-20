"use client";
import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { formatDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AdminQr() {
  const qrUrl = useStore((s) => s.qrUrl);
  const updated = useStore((s) => s.qrUpdatedAt);
  const setQr = useStore((s) => s.setQr);
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);

  const take = (f?: File) => {
    if (!f || !f.type.startsWith("image/")) return toast.error("Choose an image file (PNG, JPG or SVG).");
    setQr(URL.createObjectURL(f));
    toast.success("QR code updated", { description: "Users will see it on the deposit page." });
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">QR code</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5 text-center">
          <p className="text-sm text-muted">Current deposit QR</p>
          <div className="mx-auto mt-4 w-fit rounded-2xl border border-border bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="Current deposit QR code" className="h-52 w-52" />
          </div>
          <p className="mt-4 text-xs text-muted">Last updated {formatDateTime(updated)}</p>
        </Card>

        <Card className="p-5">
          <p className="font-semibold">Replace QR code</p>
          <p className="mt-1 text-sm text-muted">Upload a clear image of your UPI QR. Check it scans correctly before saving.</p>
          <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => take(e.target.files?.[0])} />
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); take(e.dataTransfer.files[0]); }}
            className={`mt-4 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed py-10 text-sm text-muted transition-colors ${drag ? "border-primary bg-primary/5" : "border-border"}`}
          >
            <UploadCloud className="h-7 w-7" />Drag and drop an image here
          </div>
          <Button className="mt-4 w-full" onClick={() => ref.current?.click()}>Choose file</Button>
        </Card>
      </div>
    </div>
  );
}
