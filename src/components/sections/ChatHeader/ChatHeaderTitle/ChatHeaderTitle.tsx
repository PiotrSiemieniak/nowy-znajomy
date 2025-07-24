"use client";

import { Button } from "@/components/ui/Button";
import { Flag } from "lucide-react";
import { PartnerInfo } from "./partials/PartnerInfo";
import { useChatState } from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { cn } from "@/lib/utils";

export function ChatHeaderTitle() {
  const { chatStage } = useChatState();

  const isRender =
    chatStage === ChatStage.Connected || chatStage === ChatStage.Disconnected;

  return (
    <div
      className={cn("py-2 -full flex flex-row justify-between", {
        // "opacity-0": !isRender,
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
      <PartnerInfo />
      <div className="flex-1"></div>
    </div>
  );
}
