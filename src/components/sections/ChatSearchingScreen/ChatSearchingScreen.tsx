"use client";

import { motion } from "motion/react";
import { useSearchPooling } from "./hooks";
import { useTranslations } from "next-intl";

const letterSx =
  "mix-blend-soft-light text-4xl text-center font-bold italic animate-bounce";

export function ChatSearchingScreen() {
  useSearchPooling();
  const t = useTranslations("chat.states");
  const label = t("searching");

  return (
    <div className="size-full relative px-4 py-16 flex flex-col space-y-4 justify-center items-center">
      <div className="flex animate-pulse opacity-35">
        {label.split("").map((letter, idx) => (
          <motion.span
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{
              bounce: 1,
              delay: idx * 0.1 + 1,
            }}
            className={letterSx}
            key={idx}
            style={{
              animationDuration: "3s",
              animationDelay: `${idx * 0.1 + 1}s`,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
