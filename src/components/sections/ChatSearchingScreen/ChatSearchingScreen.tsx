import { motion } from "motion/react";

export function ChatSearchingScreen() {
  return (
    <div className="size-full relative flex justify-center items-center">
      <div className="flex gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            bounce: 1,
            delay: 1,
          }}
          className="size-10 bg-card rounded-full animate-bounce"
          style={{ animationDuration: "1.5s", animationDelay: "1s" }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            bounce: 1,
            delay: 1.25,
          }}
          className="size-10 bg-card rounded-full animate-bounce"
          style={{ animationDuration: "1.5s", animationDelay: "1.25s" }}
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            bounce: 1,
            delay: 1.5,
          }}
          className="size-10 bg-card rounded-full animate-bounce"
          style={{ animationDuration: "1.5s", animationDelay: "1.5s" }}
        />
      </div>
    </div>
  );
}
