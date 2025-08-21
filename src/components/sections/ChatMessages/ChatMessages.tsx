"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { ChatMessageElement } from "./ChatMessageElement";
import { ChatMessageDisconectLabel } from "./ChatMessageDisconectLabel";
import { getSessionKey } from "@/lib/getSessionKey";
import { ChatMessageDataTrade } from "./ChatMessageDataTrade";
import { ChatMessageAcceptedTrade } from "./ChatMessageAcceptedTrade";

type Props = Record<string, never>;

export function ChatMessages({}: Props) {
  const { messages } = useChatState();
  const sessionKey = getSessionKey();

  return messages.map((message, index) => {
    const prevMessage = messages[index - 1];
    const isSameAuthor = prevMessage?.author === message.author;
    const isItMe = message.author === sessionKey;
    const isDisconnect = message.headers.type === "disconnect";
    const isDataTrade = message.headers.type === "interlocutorData";

    if (message.headers.type === "tradeAccepted")
      return (
        <ChatMessageAcceptedTrade
          key={"offer-accepted-" + message.id}
          isItMe={isItMe}
          dataKey={message.headers.dataKey as string}
          isPrevMessageSameAuthor={isSameAuthor}
        />
      );

    if (isDisconnect)
      return (
        <ChatMessageDisconectLabel
          key={"disconnect-" + message.id}
          isItMe={isItMe}
        />
      );
    if (isDataTrade)
      return (
        <ChatMessageDataTrade
          isItMe={isItMe}
          action={message.headers.action as string}
          dataKey={message.headers.dataKey as string}
          key={"offer-" + String(message.headers.status ?? "") + message.id}
        />
      );

    return (
      <ChatMessageElement
        key={"msg-" + message.id}
        text={message.text}
        isPrevMessageSameAuthor={isSameAuthor}
        isItMe={isItMe}
      />
    );
  });
}
