"use client";

import { ReactNode } from "react";
import { ChatRoomProvider } from "@ably/chat/react";

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
      {children}
    </ChatRoomProvider>
  );
}
