"use client";

import { TEXTAREA_MAX_LENGTH } from "@/configs/chatTextarea";
import {
  useChatAction,
  useChatState,
} from "@/components/providers/ChatProvider";
import { Textarea } from "@/components/ui/Textarea";
import { useState } from "react";
import { MessageSymbolsCounter } from "./partials/MessageSymbolsCounter";
import { SendButton } from "./partials/SendButton";
import { useMessages } from "@ably/chat/react";

export function ChatActionBarTextarea() {
  const { isChatActive } = useChatState();
  const { sendMessage } = useChatAction();
  const { send } = useMessages({
    listener: ({ message }) => {
      sendMessage({
        author: message.clientId,
        date: message.createdAt,
        text: message.text,
      });
    },
  });

  const [isTextareFocused, setTextareaFocused] = useState<boolean>(false);
  const [textareaValue, setTextareaValue] = useState<string>("");

  const isTextareaEmpty = textareaValue.length === 0;
  const hiddenButtonCondition =
    (isTextareaEmpty && !isTextareFocused) || !isChatActive;

  // =========
  // Handlers
  // =========

  const handleTextareaFocus = () => setTextareaFocused(true);
  const handleTextareaBlur = () => setTextareaFocused(false);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTextareaValue(event.target.value);
  };

  const handleSendButtonClick = () => {
    if (isTextareaEmpty || !isChatActive) return;
    send({
      text: textareaValue,
    });
    setTextareaValue("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendButtonClick();
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendButtonClick();
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <MessageSymbolsCounter messageLength={textareaValue.length} />
      {!hiddenButtonCondition && (
        <SendButton
          onClick={handleSendButtonClick}
          disabled={hiddenButtonCondition}
        />
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
        onKeyDown={handleTextareaKeyDown}
      />
    </form>
  );
}
