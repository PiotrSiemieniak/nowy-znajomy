"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { ChatMessageElement } from "./ChatMessageElement";
import { ChatMessageDisconectLabel } from "./ChatMessageDisconectLabel";
import { getSessionKey } from "@/lib/getSessionKey";

type Props = {};

export function ChatMessages({}: Props) {
  const { messages } = useChatState();
  const sessionKey = getSessionKey();

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
