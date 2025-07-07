"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { ChatMessageElement } from "./ChatMessageElement";
import { ChatMessageDisconectLabel } from "./ChatMessageDisconectLabel";

type Props = {};

const KEY_STR = "SESSION_KEY";

export function ChatMessages({}: Props) {
  const { messages } = useChatState();
  const sessionKey = sessionStorage.getItem(KEY_STR);

  return messages.map((message, index) => {
    const prevMessage = messages[index - 1];
    const isSameAuthor = prevMessage?.author === message.author;
    const isDisconnect = message.headers.type === "disconnect";

    if (isDisconnect)
      return (
        <ChatMessageDisconectLabel
          key={"DisconnectLabelInfo"}
          isItMe={message.author === sessionKey}
        />
      );

    return (
      <ChatMessageElement
        key={message.id + message.text}
        text={message.text}
        isPrevMessageSameAuthor={isSameAuthor}
        isItMe={message.author === sessionKey}
      />
    );
  });
}
