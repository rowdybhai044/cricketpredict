"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/use-fake-loading";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  /** dialog = centered; sheet = bottom (mobile) / right (desktop); drawer = bottom on all sizes */
  variant?: "dialog" | "sheet" | "drawer";
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, onClose, title, description, variant = "dialog", children, footer }: Props) {
  const [mounted, setMounted] = useState(false);
  const desktop = useIsDesktop();
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!mounted) return null;

  const side = variant === "sheet" && desktop;
  const centered = variant === "dialog";

  const panelClass = centered
    ? "left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-sm rounded-2xl"
    : side
    ? "right-0 top-0 h-full w-[460px] rounded-l-2xl"
    : "inset-x-0 bottom-0 mx-auto max-h-[92dvh] w-full max-w-md rounded-t-3xl";

  const initial = centered ? { opacity: 0, x: "-50%", y: "-46%" } : side ? { x: "100%" } : { y: "100%" };
  const animate = centered ? { opacity: 1, x: "-50%", y: "-50%" } : side ? { x: 0 } : { y: 0 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog" aria-modal="true" aria-label={title}
            className={cn("absolute flex flex-col border border-border bg-surface shadow-2xl", panelClass)}
            initial={initial} animate={animate} exit={initial}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
          >
            <div className="flex items-start justify-between gap-3 p-5 pb-2">
              <div>
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                {description && <p className="mt-1 text-sm text-muted">{description}</p>}
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-muted hover:bg-elevated">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3">{children}</div>
            {footer && <div className="flex gap-3 border-t border-border p-4 pb-safe">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
