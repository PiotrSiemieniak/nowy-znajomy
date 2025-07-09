"use client";

import { ReactNode, useEffect, useState } from "react";
import { ChatClient } from "@ably/chat";
import { ChatClientProvider } from "@ably/chat/react";
import * as Ably from "ably";
import { getSessionKey } from "@/lib/getSessionKey";
// const DOMAIN = process.env.DOMAIN_URL;

export function AblyClientProvider({ children }: { children?: ReactNode }) {
  const [chatClient, setChatClient] = useState<ChatClient | null>(null);

  useEffect(() => {
    // Tworzymy klienta Ably tylko po stronie klienta
    const sessionKey = getSessionKey();
    const realtimeClient = new Ably.Realtime({
      clientId: sessionKey,
      authUrl: "/api/chatAuth",
      authMethod: "GET",
      authParams: {
        clientId: sessionKey,
      },
    });
    setChatClient(new ChatClient(realtimeClient));
  }, []);

  if (!chatClient) return null; // lub loader

  return (
    <ChatClientProvider client={chatClient}>{children}</ChatClientProvider>
  );
}
