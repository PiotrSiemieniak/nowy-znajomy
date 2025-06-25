"use client";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea/Textarea";
import { TEXTAREA_MAX_LENGTH } from "@/configs/chatTextarea";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
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
import { useMessages } from "@ably/chat/react";

type Props = {
  onScrollToBottom: () => void;
  isAtBottom: boolean;
};

export function ChatTextarea({ isAtBottom, onScrollToBottom }: Props) {
  const { isChatActive, chatStage } = useChatState();
  const { changeChatState } = useChatAction();
  const { send: sendMessage } = useMessages({
    listener: (payload) => {
      console.log("New message received:", payload);
    },
  });

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

  const handleClick = () => {
    sendMessage(textareaValue);
  };

  const isChatInitial = chatStage === ChatStage.Initial;
  const isChatConnected = chatStage === ChatStage.Connected;
  const isTextareaEmpty = textareaValue.length === 0;
  const hiddenButtonCondition =
    (isTextareaEmpty && !isTextareFocused) || !isChatActive;

  return (
    <div className="flex flex-col gap-2 scroll-smooth justify-center items-center w-full min-h-10 h-fit fixed bottom-0 left-0">
      <div className="w-full relative ">
        <AnimatePresence mode="wait">
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
            <SendButton
              onClick={handleClick}
              disabled={hiddenButtonCondition}
            />
          )}
          <motion.div
            key={"TextareaStage-" + chatStage}
            initial={{ filter: "blur(7px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(7px)", opacity: 0 }}
            className="w-full h-fit p-2"
          >
            {isChatInitial && (
              <SearchStageButton onClick={handleSetSearchingState} />
            )}
            {isChatConnected && (
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
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
