"use client";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { TEXTAREA_MAX_LENGTH } from "@/configs/chatTextarea";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState } from "react";
import { MessageSymbolsCounter } from "./partials/MessageSymbolsCounter";
import {
  useChatAction,
  useChatState,
} from "@/components/providers/ChatProvider";
import { ArrowDown } from "lucide-react";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { SearchStageButton } from "./partials/SearchStageButton";
import { SendButton } from "./partials/SendButton";

type Props = {
  onScrollToBottom: () => void;
  isAtBottom: boolean;
};

export function ChatTextarea({ isAtBottom, onScrollToBottom }: Props) {
  const { isChatActive, chatStage } = useChatState();
  const { changeChatState } = useChatAction();

  const [isTextareFocused, setTextareaFocused] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>("");

  const handleTextareaFocus = () => setTextareaFocused(true);
  const handleTextareaBlur = () => setTextareaFocused(false);
  const handleSetSearchingState = () => changeChatState(ChatStage.Searching);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(event.target.value);
  };

  const isChatInitial = chatStage === ChatStage.Initial;
  const isChatSearching = chatStage === ChatStage.Searching;
  const isTextareaEmpty = textareaValue.length === 0;
  const hiddenButtonCondition =
    (isTextareaEmpty && !isTextareFocused) || !isChatActive;

  return (
    <div className="flex flex-col gap-2 scroll-smooth justify-center items-center w-full min-h-10 h-fit fixed bottom-0 left-0">
      <div className="w-full relative ">
        {!isAtBottom && (
          <Button
            onClick={onScrollToBottom}
            size={"icon"}
            className="ml-auto mx-2"
          >
            <ArrowDown />
          </Button>
        )}
        <MessageSymbolsCounter messageLength={textareaValue.length} />
        {!hiddenButtonCondition && (
          <SendButton disabled={hiddenButtonCondition} />
        )}
        {isChatInitial && (
          <SearchStageButton onClick={handleSetSearchingState} />
        )}
        {isChatSearching && (
          <motion.div className="w-full h-fit p-2">
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
          </motion.div>
        )}
      </div>
    </div>
  );
}
