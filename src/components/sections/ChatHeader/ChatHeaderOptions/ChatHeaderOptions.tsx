import { Channels } from "./partials/Channels";
import { DisconnectBtn } from "./partials/DisconnectBtn";
import { useChatState } from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { SearchingBtn } from "./partials/SearchingBtn";
import { AnimatePresence, motion } from "motion/react";
import { AccountBtn } from "./partials/AccountBtn";

export function ChatHeaderOptions() {
  const { chatStage } = useChatState();

  const isChatConnected = chatStage === ChatStage.Connected;
  const isChatDisconnected = chatStage === ChatStage.Disconnected;
  const isChatInitial = chatStage === ChatStage.Initial;

  return (
    <div className="border-b border-border/50 py-2 flex flex-row justify-between">
      <div>
        {chatStage}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={chatStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isChatConnected && <DisconnectBtn />}
            {!!(isChatDisconnected || isChatInitial) && <SearchingBtn />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="ml-auto inline-flex gap-2">
        <AccountBtn />
        <Channels />
      </div>
    </div>
  );
}
