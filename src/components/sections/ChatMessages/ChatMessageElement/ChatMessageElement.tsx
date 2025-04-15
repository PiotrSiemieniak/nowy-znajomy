"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { cn } from "@/lib/utils";

export function ChatMessageElement({
  text,
  isItMe = false,
  isPrevMessageSameAuthor,
}: {
  text: string;
  isItMe?: boolean;
  isPrevMessageSameAuthor?: boolean;
}) {
  return (
    <div
      className={cn("text-xs bg-card/75 backdrop-blur-md p-2 w-fit max-w-96", {
        "ml-auto rounded-l-xl rounded-tr-xl bg-card/25": isItMe,
        "mr-auto rounded-r-xl rounded-bl-xl bg-card/55": !isItMe,
        "mt-1": isPrevMessageSameAuthor,
        "mt-4": !isPrevMessageSameAuthor,
      })}
    >
      {text}
    </div>
  );
}
