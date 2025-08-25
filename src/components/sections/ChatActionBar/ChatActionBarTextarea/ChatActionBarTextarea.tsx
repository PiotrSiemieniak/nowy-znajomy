"use client";

import { TEXTAREA_MAX_LENGTH } from "@/configs/chatTextarea";
import {
  useContextSelector,
  ChatStateCtx,
  ChatActionCtx,
} from "@/components/providers/ChatProvider";
import { Textarea } from "@/components/ui/Textarea";
import { useState } from "react";
import { MessageSymbolsCounter } from "./partials/MessageSymbolsCounter";
import { SendButton } from "./partials/SendButton";
import { useMessages } from "@ably/chat/react";
import { useTranslations } from "next-intl";

export function ChatActionBarTextarea() {
  const isChatActive = useContextSelector(
    ChatStateCtx,
    (state) => state.isChatActive
  );
  const sendMessage = useContextSelector(
    ChatActionCtx,
    (actions) => actions.sendMessage
  );
  const t = useTranslations("chat.message");
  const { send } = useMessages({
    listener: async ({ message }) => {
      sendMessage({
        ...message,
        author: message.clientId,
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
      headers: {
        type: "message",
      },
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
    <form onSubmit={handleFormSubmit} className="space-y-2">
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
        placeholder={t("placeholder")}
        className="max-h-48 bg-card/50 min-h-[2.5rem] h-fit backdrop-blur-sm"
        onKeyDown={handleTextareaKeyDown}
      />
    </form>
  );
}
