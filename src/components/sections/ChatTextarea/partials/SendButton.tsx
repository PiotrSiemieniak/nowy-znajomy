"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type Props = {
  disabled?: boolean;
};

export function SendButton({ disabled }: Props) {
  return (
    <motion.div
      className="w-full duration-500 m-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button disabled={disabled} className={cn("w-full")}>
        Wyślij wiadomość
      </Button>
    </motion.div>
  );
}
