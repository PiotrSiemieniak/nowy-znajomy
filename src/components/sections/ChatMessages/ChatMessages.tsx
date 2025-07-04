"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { ChatMessageElement } from "./ChatMessageElement";

type Props = {};

const KEY_STR = "SESSION_KEY";

export function ChatMessages({}: Props) {
  const { messages } = useChatState();
  const sessionKey = sessionStorage.getItem(KEY_STR);

  return messages.map((message, index) => {
    const prevMessage = messages[index - 1];
    const isSameAuthor = prevMessage?.author === message.author;

    return (
      <ChatMessageElement
        key={message.id}
        text={message.text}
        isPrevMessageSameAuthor={isSameAuthor}
        isItMe={message.author === sessionKey} // TEMP, TODO: replace with real data
      />
    );
  });
}
