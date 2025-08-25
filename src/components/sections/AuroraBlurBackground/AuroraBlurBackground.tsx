"use client";

import { useContextSelector } from "use-context-selector";
import { ChatStateCtx } from "@/components/providers/ChatProvider";
import { AnimatePresence } from "motion/react";
import { AuroraElement } from "./partials/AuroraElement";

export function AuroraBlurBackground() {
  // 🎯 UŻYWAMY use-context-selector dla performance!
  // Re-render TYLKO gdy bgColors się zmieni, nie gdy inne wartości w kontekście
  const bgColors = useContextSelector(ChatStateCtx, (ctx) => ctx.bgColors);

  console.log("🎨 AuroraBlurBackground re-render with use-context-selector:", {
    bgColors: bgColors?.slice(0, 3), // Pokaż tylko pierwsze 3 dla czytelności
    timestamp: new Date().toISOString(),
  });

  const mainColor = bgColors ? bgColors[7] : "transparent";

  return (
    <div className="absolute inset-0 w-full h-full -z-[9999] -translate-y-5">
      <div
        className="grid grid-cols-3 size-full grid-rows-5 bg-transparent dark:brightness-50"
        style={{
          filter: "blur(100px)",
          willChange: "transform", // iOS optimization
          transform: "translateZ(0)", // Force hardware acceleration
        }}
      >
        <div
          style={{ backgroundColor: mainColor }}
          className="-z-[9998] absolute size-full"
        />
        <AnimatePresence mode="popLayout">
          {Array.from({ length: 15 }).map((_, index) => {
            const bgColor = bgColors ? bgColors[index] : "transparent";

            return (
              <AuroraElement key={index} bgColor={bgColor} index={index} />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
