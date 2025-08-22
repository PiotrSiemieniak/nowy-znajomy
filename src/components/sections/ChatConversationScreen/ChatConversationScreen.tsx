"use client";

import { RefObject } from "react";
import { ChatMessages } from "../ChatMessages";
import { useTranslations } from "next-intl";

type Props = {
  scrollRef: RefObject<HTMLDivElement | null>;
};
export function ChatConversationScreen({ scrollRef }: Props) {
  const t = useTranslations("chat.states");

  return (
    <div
      ref={scrollRef}
      className="flex flex-col h-full relative w-full p-2 bottom-0 overflow-y-auto pt-52 pb-[10.5rem]"
    >
      <div className="flex items-center justify-center flex-col py-10">
        <p className="text-xl font-semibold text-gray-50/50">
          {t("startConversation")}
        </p>
        <p className="text-gray-50/50">{t("connectedToChannel")}</p>
        <p className="text-gray-50/50 text-xs">{t("writeToGreet")}</p>
      </div>
      <ChatMessages />
    </div>
  );
}
