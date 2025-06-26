import { TEXTAREA_MAX_LENGTH } from "@/configs/chatTextarea";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

const LENGTH_TO_SHOW = TEXTAREA_MAX_LENGTH * 0.75;
const LENGTH_TO_RED_500 = TEXTAREA_MAX_LENGTH * 0.9;
const LENGTH_TO_RED_400 = TEXTAREA_MAX_LENGTH * 0.85;
const LENGTH_TO_RED_300 = TEXTAREA_MAX_LENGTH * 0.8;

export function MessageSymbolsCounter({
  messageLength,
}: {
  messageLength: number;
}) {
  if (messageLength < LENGTH_TO_SHOW) return null;

  return (
    <motion.div
      className="mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <p
        className={cn(
          "text-xs text-amber-200 font-semibold shadow bg-black rounded-full py-1 px-2",
          {
            "text-amber-300": messageLength >= LENGTH_TO_RED_300,
            "text-amber-400": messageLength >= LENGTH_TO_RED_400,
            "text-amber-500": messageLength >= LENGTH_TO_RED_500,
            "text-amber-700": messageLength === TEXTAREA_MAX_LENGTH,
          }
        )}
      >
        Limit znaków {messageLength}/{TEXTAREA_MAX_LENGTH}
      </p>
    </motion.div>
  );
}
