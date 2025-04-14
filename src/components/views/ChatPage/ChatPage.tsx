import { ChatProvider } from "@/components/providers/ChatProvider";
import { AuroraBlurBackground } from "@/components/sections/AuroraBlurBackground";
import { ChatHeader } from "@/components/sections/ChatHeader";
import { ChatMessages } from "@/components/sections/ChatMessages";
import { ChatTextarea } from "@/components/sections/ChatTextarea";

export default function ChatPage() {
  return (
    <div>
      <div className="flex justify-between flex-row p-2 gap-2 w-full">
        <p className="text-xs font-medium w-1/3">Nwm</p>
        <p className="text-xs font-medium w-1/3 text-center">Nowy znajomy</p>
        <p className="text-xs font-medium w-1/3 text-right">48000 online</p>
      </div>
      <div className="w-full h-screen relative flex flex-col overflow-hidden safe-area bg-transparent rounded-t-3xl">
        <ChatProvider>
          <ChatHeader />
          <ChatMessages />
          <ChatTextarea />
          <AuroraBlurBackground />
        </ChatProvider>
      </div>
    </div>
  );
}
