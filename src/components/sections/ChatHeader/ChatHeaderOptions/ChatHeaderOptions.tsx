import { Button } from "@/components/ui/Button";
import { Channels } from "./partials/Channels";
import { UserCog } from "lucide-react";
import { DisconnectBtn } from "./partials/DisconnectBtn";
import { useChatState } from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { SearchingBtn } from "./partials/SearchingBtn";
import { AnimatePresence, motion } from "motion/react";

export function ChatHeaderOptions() {
  const { chatStage } = useChatState();

  const isChatConnected = chatStage === ChatStage.Connected;
  const isChatDisconnected = chatStage === ChatStage.Disconnected;
  const isChatInitial = chatStage === ChatStage.Initial;

  return (
    <div className="border-b border-border/50 py-2 flex flex-row justify-between">
      <div>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={chatStage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {isChatConnected && <DisconnectBtn />}
            {isChatDisconnected || (isChatInitial && <SearchingBtn />)}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="ml-auto inline-flex gap-2">
        <Button size={"sm"} className="rounded-xl inline-flex">
          Konto <UserCog className="ml-1" />
        </Button>
        <Channels />
      </div>
    </div>
  );
}
