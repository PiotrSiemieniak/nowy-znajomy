"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { AuroraBlurBackground } from "@/components/sections/AuroraBlurBackground";
import { ChatHeader } from "@/components/sections/ChatHeader";
import { ChatInitialScreen } from "@/components/sections/ChatInitialScreen";
import { ChatMessages } from "@/components/sections/ChatMessages";
import { ChatSearchingScreen } from "@/components/sections/ChatSearchingScreen";
import { ChatTextarea } from "@/components/sections/ChatTextarea";
import { useScrollDetection } from "@/lib/hooks/useScrollDetection";
import { cn } from "@/lib/utils";

export function ChatPageContent() {
  const { isAtBottom, scrollToBottom, scrollRef } = useScrollDetection();
  const { chatStage } = useChatState();

  const isChatInitial = chatStage === ChatStage.Initial;
  const isChatConnected = chatStage === ChatStage.Connected;
  const isChatSearching = chatStage === ChatStage.Searching;
  const isChatDisconnected = chatStage === ChatStage.Disconnected;

  return (
    <div className="bg-black h-full w-full fixed top-6">
      <div
        id="chat-container"
        data-ispopoveropen={"false"}
        className={cn(
          "w-full h-screen relative flex flex-col overflow-hidden bg-transparent rounded-t-3xl transition-all duration-1000 data-[ispopoveropen=true]:scale-95"
        )}
      >
        <ChatHeader />
        {isChatInitial && <ChatInitialScreen />}
        {isChatConnected ||
          (isChatDisconnected && <ChatMessages scrollRef={scrollRef} />)}
        {isChatSearching && <ChatSearchingScreen />}
        <ChatTextarea
          isAtBottom={isAtBottom}
          onScrollToBottom={scrollToBottom}
        />
        <AuroraBlurBackground />
      </div>
    </div>
  );
}
