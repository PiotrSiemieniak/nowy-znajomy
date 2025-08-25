"use client";

import { Button } from "@/components/ui/Button";
import { Flag } from "lucide-react";
import { PartnerInfo } from "./partials/PartnerInfo";
import {
  useContextSelector,
  ChatStateCtx,
} from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { cn } from "@/lib/utils";

export function ChatHeaderTitle() {
  const chatStage = useContextSelector(
    ChatStateCtx,
    (state) => state.chatStage
  );

  const isChatInitial = chatStage === ChatStage.Initial;
  const isChatSearching = chatStage === ChatStage.Searching;

  return (
    <div
      className={cn("py-2 w-full flex flex-row justify-between", {
        "opacity-0": isChatInitial || isChatSearching,
      })}
    >
      <div className="flex-1">
        {/* TODO: zgłaszanie */}
        <Button
          variant={"ghost"}
          size={"sm"}
          className="rounded-xl inline-flex size-4 text-muted-foreground"
        >
          <Flag />
        </Button>
      </div>
      <div>
        <PartnerInfo />
      </div>
      <div className="flex-1"></div>
    </div>
  );
}
