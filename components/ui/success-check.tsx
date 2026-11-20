"use client";
import { motion } from "framer-motion";

export function SuccessCheck({ className = "h-20 w-20" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 52 52" className={className} initial="h" animate="v">
      <motion.circle cx="26" cy="26" r="24" fill="none" stroke="rgb(var(--c-primary))" strokeWidth="2.5"
        variants={{ h: { pathLength: 0 }, v: { pathLength: 1 } }} transition={{ duration: 0.5 }} />
      <motion.path d="M15 27 l8 8 l14 -16" fill="none" stroke="rgb(var(--c-primary))" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
        variants={{ h: { pathLength: 0 }, v: { pathLength: 1 } }} transition={{ duration: 0.4, delay: 0.4 }} />
    </motion.svg>
  );
}
