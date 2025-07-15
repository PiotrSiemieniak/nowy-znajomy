"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const AnimatePresence = dynamic(
  () => import("framer-motion").then((m) => m.AnimatePresence),
  { ssr: false }
);
const MotionP = dynamic(() => import("framer-motion").then((m) => m.motion.p), {
  ssr: false,
});

type Props = {
  desc?: string;
  errorLabel?: string;
};

export function Desc({ desc, errorLabel }: Props) {
  const [display, setDisplay] = useState<"desc" | "error" | null>(null);
  useEffect(() => {
    if (errorLabel) setDisplay("error");
    else if (desc) setDisplay("desc");
    else setDisplay(null);
  }, [desc, errorLabel]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {display === "error" && errorLabel ? (
        <MotionP
          key="error"
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.3 }}
          className="text-xs text-destructive"
        >
          {errorLabel}
        </MotionP>
      ) : display === "desc" && desc ? (
        <MotionP
          key="desc"
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.3 }}
          className="text-xs text-muted-foreground"
        >
          {desc}
        </MotionP>
      ) : null}
    </AnimatePresence>
  );
}
