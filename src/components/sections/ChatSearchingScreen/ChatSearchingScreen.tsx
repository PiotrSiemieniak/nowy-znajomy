import { motion } from "motion/react";

export function ChatSearchingScreen() {
  const label = "Szukam...";
  const letterSx =
    "mix-blend-soft-light text-4xl text-center font-bold italic animate-bounce";

  return (
    <div className="size-full relative flex flex-col space-y-4 justify-center items-center">
      <div className="flex animate-pulse opacity-35">
        {label.split("").map((letter, idx) => (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
