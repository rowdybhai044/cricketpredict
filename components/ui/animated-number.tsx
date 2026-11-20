"use client";
import { useEffect } from "react";
import { animate, useMotionValue, useTransform, motion } from "framer-motion";
import { inr } from "@/lib/utils";

export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => inr(v));
  useEffect(() => {
    const c = animate(mv, value, { type: "spring", stiffness: 180, damping: 24 });
    return () => c.stop();
  }, [value, mv]);
  return <motion.span className={className}>{text}</motion.span>;
}
