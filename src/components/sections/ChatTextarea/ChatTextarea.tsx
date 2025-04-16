"use client";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { TEXTAREA_MAX_LENGTH } from "@/configs/chatTextarea";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { MessageSymbolsCounter } from "./partials/MessageSymbolsCounter";
import { useChatState } from "@/components/providers/ChatProvider";

export function ChatTextarea() {
  const { isChatActive } = useChatState();

  const [isTextareFocused, setTextareaFocused] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>("");

  const handleTextareaFocus = () => setTextareaFocused(true);
  const handleTextareaBlur = () => setTextareaFocused(false);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(event.target.value);
  };

  const isTextareaEmpty = textareaValue.length === 0;
  const hiddenButtonCondition =
    (isTextareaEmpty && !isTextareFocused) || !isChatActive;

  return (
    <div className="flex flex-col gap-2 justify-center items-center w-full min-h-10 h-fit fixed bottom-0 left-0 backdrop-blur-xs">
      <div className="w-full relative p-2">
        <MessageSymbolsCounter messageLength={textareaValue.length} />
        {!hiddenButtonCondition && (
          <motion.div
            className="w-full duration-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button disabled={isTextareaEmpty} className={cn("w-full")}>
              Wyślij wiadomość
            </Button>
          </motion.div>
        )}
        <Textarea
          disabled={!isChatActive}
          value={textareaValue}
          onChange={handleTextareaChange}
          onFocus={handleTextareaFocus}
          onBlur={handleTextareaBlur}
          maxLength={TEXTAREA_MAX_LENGTH}
          placeholder="Type your message here..."
          className="max-h-48 bg-card/50 min-h-[2.5rem] h-10 backdrop-blur-sm"
        />
      </div>
    </div>
  );
}
