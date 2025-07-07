"use client";

import { ReactNode } from "react";
import { ChatClient } from "@ably/chat";
import { ChatClientProvider } from "@ably/chat/react";
import * as Ably from "ably";
import { getSessionKey } from "@/lib/getSessionKey";
// const DOMAIN = process.env.DOMAIN_URL;

export function AblyClientProvider({ children }: { children?: ReactNode }) {
  const sessionKey = getSessionKey();

  const realtimeClient = new Ably.Realtime({
    clientId: sessionKey,
    authUrl: "/api/chatAuth",
    authMethod: "GET",
    authParams: {
      clientId: sessionKey,
    },
  });
  const chatClient = new ChatClient(realtimeClient);

  return (
    <ChatClientProvider client={chatClient}>{children}</ChatClientProvider>
  );
}
