"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { cn } from "@/lib/utils";

export function ChatMessageElement({
  text,
  isItMe = false,
}: {
  text: string;
  isItMe?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-xs bg-card/75 backdrop-blur-md p-2 rounded-t-lg w-fit max-w-96",
        {
          "ml-auto rounded-bl-lg bg-card/25": isItMe,
          "mr-auto rounded-br-lg bg-card/75": !isItMe,
        }
      )}
    >
      {text}
    </div>
  );
}
