import { ChatProvider } from "@/components/providers/ChatProvider";
import { AuroraBlurBackground } from "@/components/sections/AuroraBlurBackground";
import { ChatMessages } from "@/components/sections/Chat/ChatMessages";

export default function ChatPage() {
  return (
    <div className="w-full h-screen relative flex flex-col grow overflow-hidden safe-area bg-transparent">
      <ChatProvider>
        <ChatMessages />
        <AuroraBlurBackground />
      </ChatProvider>
    </div>
  );
}
