"use client";

import { ChatProvider } from "@/components/providers/ChatProvider";
import { AuroraBlurBackground } from "@/components/sections/AuroraBlurBackground";
import { ChatHeader } from "@/components/sections/ChatHeader";
import { ChatMessages } from "@/components/sections/ChatMessages";
import { ChatTextarea } from "@/components/sections/ChatTextarea";
import { getRandomNum } from "@/lib/getRandomNum";
import { useScrollDetection } from "@/lib/hooks/useScrollDetection";
import { User } from "lucide-react";

export default function ChatPage() {
  const { isAtBottom, scrollToBottom, scrollRef } = useScrollDetection();

  return (
    <div className="h-full w-full relative bg-black -z-50">
      <div className="flex fixed top-0 z-10 bg-black justify-between flex-row p-2 gap-2 w-full text-white overflow-hidden">
        <p className="text-xs font-medium w-1/3">Nwm</p>
        <p className="text-xs font-medium w-1/3 text-center">Nowy znajomy</p>
        <div className="text-xs font-medium w-1/3 text-right inline-flex">
          <p className="ml-auto">{getRandomNum(0, 48000)}</p>{" "}
          <User className="size-3 my-auto ml-1" />
        </div>
      </div>
      <div className="bg-black h-full w-full fixed top-8">
        <div className="w-full h-screen relative flex flex-col overflow-hidden safe-area bg-transparent rounded-t-3xl">
          <ChatProvider>
            <ChatHeader />
            <ChatMessages scrollRef={scrollRef} />
            <ChatTextarea
              isAtBottom={isAtBottom}
              onScrollToBottom={scrollToBottom}
            />
            <AuroraBlurBackground />
          </ChatProvider>
        </div>
      </div>
    </div>
  );
}
