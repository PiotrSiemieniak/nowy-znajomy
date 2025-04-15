"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { ChatMessageElement } from "./ChatMessageElement";

export function ChatMessages() {
  const { messages } = useChatState();

  return (
    <div className="flex flex-col h-full w-full p-2 fixed bottom-0 overflow-y-auto pt-52 pb-20">
      <div className="flex items-center justify-center flex-col py-10">
        <p className="text-xl font-semibold text-gray-50/50">
          Rozpoczęto rozmowę
        </p>
        <p className="text-gray-50/50">Kanał: xxx</p>
        <p className="text-gray-50/50 text-xs">Napisz coś, aby się przywitać</p>
      </div>

      {messages.map((message, index) => {
        const prevMessage = messages[index - 1];
        const isSameAuthor = prevMessage?.author === message.author;

        return (
          <ChatMessageElement
            key={message.id}
            text={message.text}
            isPrevMessageSameAuthor={isSameAuthor}
            isItMe={message.author === "Test"} // TEMP, TODO: replace with real data
          />
        );
      })}
    </div>
  );
}
