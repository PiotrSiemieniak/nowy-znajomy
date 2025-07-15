"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  desc?: string;
  errorLabel?: string;
};

export function Desc({ desc, errorLabel }: Props) {
  const display = errorLabel ? "error" : desc ? "desc" : null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {display === "error" && errorLabel ? (
        <motion.p
          key="error"
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.3 }}
          className="text-xs text-destructive font-semibold"
        >
          {errorLabel}
        </motion.p>
      ) : display === "desc" && desc ? (
        <motion.p
          key="desc"
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.3 }}
          className="text-xs text-muted-foreground"
        >
          {desc}
        </motion.p>
      ) : null}
    </AnimatePresence>
  );
}
