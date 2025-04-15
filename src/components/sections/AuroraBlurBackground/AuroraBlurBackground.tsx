"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { AnimatePresence } from "motion/react";
import { AuroraElement } from "./partials/AuroraElement";

export function AuroraBlurBackground() {
  const { bgColors } = useChatState();

  const mainColor = bgColors ? bgColors[7] : "transparent";

  return (
    <AnimatePresence mode="wait">
      <div
        className="grid grid-cols-3 absolute size-screen
     grid-rows-5 w-full h-full -z-40 -translate-y-5 bg-transparent dark:brightness-50"
      >
        <div
          style={{ backgroundColor: mainColor }}
          className="-z-40 absolute size-full"
        />
        {Array.from({ length: 15 }).map((_, index) => {
          const bgColor = bgColors ? bgColors[index] : "transparent";

          return <AuroraElement key={index} bgColor={bgColor} index={index} />;
        })}
      </div>
    </AnimatePresence>
  );
}
