"use client";

import { useChatState } from "@/components/providers/ChatProvider";
import { cn } from "@/lib/utils";
import { getSessionKey } from "@/lib/getSessionKey";
import { useEffect } from "react";

type Props = {
  isItMe: boolean;
  dataKey: string;
  isPrevMessageSameAuthor?: boolean;
};
export function ChatMessageAcceptedTrade({
  isItMe,
  dataKey,
  isPrevMessageSameAuthor,
}: Props) {
  const { roomUsersInfo } = useChatState();
  const myId = getSessionKey();
  const ids = Object.keys(roomUsersInfo || {});
  const interlocutorId = ids.find((id) => id !== myId);
  const otherField = interlocutorId
    ? (
        roomUsersInfo[interlocutorId] as Record<
          string,
          { value?: unknown; wantToShow?: boolean }
        >
      )?.[dataKey]
    : undefined;
  const value = otherField?.value;

  useEffect(() => {
    // Debug: confirm renders and data propagation (check browser console)
    console.log("[ChatMessageAcceptedTrade]", {
      dataKey,
      value,
      interlocutorId,
      roomUsersInfo,
    });
  }, [roomUsersInfo, value, dataKey, interlocutorId]);

  const renderValue = () => {
    // If interlocutor already decided to show but value not sent yet, treat as Niezdefiniowane
    if (otherField?.wantToShow && value === undefined) return "Niezdefiniowane";
    if (value === undefined) return "Oczekiwanie…";
    if (value === null) return "Niezdefiniowane";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  };

  return (
    <div
      className={cn(
        "text-xs dark:from-slate-900/75 dark:to-black from-card/50 to-card/75 bg-gradient-to-b p-4 w-full max-w-96 whitespace-pre-line rounded-xl",
        {
          "ml-auto ": isItMe,
          "mr-auto ": !isItMe,
          "mt-1": isPrevMessageSameAuthor,
          "mt-4": !isPrevMessageSameAuthor,
        }
      )}
    >
      <p className="inline-flex">Wymiana zaakceptowana</p>
      <p className="text-base font-medium">{dataKey}</p>
      <p
        className={cn(
          "p-2 text-center border text-base font-medium bg-muted rounded-xl w-full mt-2",
          {
            "bg-transparent text-muted-foreground":
              value === null || value === undefined,
          }
        )}
      >
        {renderValue()}
      </p>
    </div>
  );
}
