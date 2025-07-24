"use client";

import { ReactNode } from "react";
import { ChatRoomProvider } from "@ably/chat/react";
import { AblyHookDispatcher } from "./partials/AblyHookDispatcher";

export function AblyRoomProvider({
  chatId,
  children,
}: {
  chatId: string | null;
  children?: ReactNode;
}) {
  if (!chatId) return <>{children}</>;

  return (
    <ChatRoomProvider release attach={Boolean(chatId)} name={chatId}>
      <AblyHookDispatcher>{children}</AblyHookDispatcher>
    </ChatRoomProvider>
  );
}
