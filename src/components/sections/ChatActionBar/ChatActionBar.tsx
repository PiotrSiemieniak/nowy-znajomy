"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  useContextSelector,
  ChatStateCtx,
  ChatActionCtx,
} from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { SearchStageButton } from "./partials/SearchStageButton";
import { ScrollToBottomButton } from "./partials/ScrollToBottomButton";
import { ChatActionBarTextarea } from "./ChatActionBarTextarea";

type Props = {
  onScrollToBottom: () => void;
  isAtBottom: boolean;
};

export function ChatActionBar({ isAtBottom, onScrollToBottom }: Props) {
  const chatStage = useContextSelector(
    ChatStateCtx,
    (state) => state.chatStage
  );
  const chatId = useContextSelector(ChatStateCtx, (state) => state.chatId);
  const changeChatState = useContextSelector(
    ChatActionCtx,
    (actions) => actions.changeChatState
  );

  const handleSetSearchingState = () =>
    changeChatState.bind(null, ChatStage.Searching);

  const isChatInitial = chatStage === ChatStage.Initial;
  const isChatConnected = chatStage === ChatStage.Connected;

  return (
    <div className="flex flex-col gap-2 scroll-smooth justify-center items-center w-full min-h-10 h-fit fixed bottom-0 left-0">
      <div className="w-full relative ">
        <AnimatePresence mode="wait">
          <ScrollToBottomButton
            isAtBottom={isAtBottom}
            onClick={onScrollToBottom}
          />
          <motion.div
            key={"TextareaStage-" + chatStage}
            initial={{ filter: "blur(7px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(7px)", opacity: 0 }}
            className="w-full h-fit p-2"
          >
            {isChatInitial && (
              <SearchStageButton onClick={handleSetSearchingState} />
            )}
            {!!(isChatConnected && chatId) && <ChatActionBarTextarea />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
