"use client";

import { RefObject } from "react";
import { ChatMessages } from "../ChatMessages";

type Props = {
  scrollRef: RefObject<HTMLDivElement | null>;
};
export function ChatConversationScreen({ scrollRef }: Props) {
  return (
    <div
      ref={scrollRef}
      className="flex flex-col h-full relative w-full p-2 bottom-0 overflow-y-auto pt-52 pb-[10.5rem]"
    >
      <div className="flex items-center justify-center flex-col py-10">
        <p className="text-xl font-semibold text-gray-50/50">
          Rozpoczęto rozmowę
        </p>
        <p className="text-gray-50/50">Kanał: xxx</p>
        <p className="text-gray-50/50 text-xs">Napisz coś, aby się przywitać</p>
      </div>
      <ChatMessages />
    </div>
  );
}
