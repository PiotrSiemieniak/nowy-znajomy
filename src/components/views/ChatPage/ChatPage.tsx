"use client";

import { ChatProvider } from "@/components/providers/ChatProvider";
import { AuroraBlurBackground } from "@/components/sections/AuroraBlurBackground";
import { ChatHeader } from "@/components/sections/ChatHeader";
import { ChatMessages } from "@/components/sections/ChatMessages";
import { ChatTextarea } from "@/components/sections/ChatTextarea";
import { useScrollDetection } from "@/lib/hooks/useScrollDetection";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

export default function ChatPage() {
  const { isAtBottom, scrollToBottom, scrollRef } = useScrollDetection();

  return (
    <div className="h-full w-full relative bg-black -z-50">
      <div className="flex fixed top-0 z-10 bg-black justify-between flex-row py-1 px-2 gap-2 w-full text-white overflow-hidden">
        <p className="text-xs font-medium w-1/3">Nwm</p>
        <p className="text-xs font-medium w-1/3 text-center">Nowy znajomy</p>
        <div className="text-xs font-medium w-1/3 text-right inline-flex">
          <p className="ml-auto">1342</p>{" "}
          <User className="size-3 my-auto ml-1" />
        </div>
      </div>
      <ChatProvider>
        <div className="bg-black h-full w-full fixed top-6">
          <div
            id="chat-container"
            data-ispopoveropen={"false"}
            className={cn(
              "w-full h-screen relative flex flex-col overflow-hidden bg-transparent rounded-t-3xl transition-all duration-1000 data-[ispopoveropen=true]:scale-95"
            )}
          >
            <ChatHeader />
            <ChatMessages scrollRef={scrollRef} />
            <ChatTextarea
              isAtBottom={isAtBottom}
              onScrollToBottom={scrollToBottom}
            />
            <AuroraBlurBackground />
          </div>
        </div>
      </ChatProvider>
    </div>
  );
}
