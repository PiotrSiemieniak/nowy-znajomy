"use client";

import { ReactNode, useLayoutEffect } from "react";
import { ChatClient } from "@ably/chat";
import { ChatClientProvider } from "@ably/chat/react";
import * as Ably from "ably";
import { getUUID } from "@/lib/crypto/getUUID";

const KEY_STR = "SESSION_KEY";
// const DOMAIN = process.env.DOMAIN_URL;

export function AblyClientProvider({ children }: { children?: ReactNode }) {
  const sessionKey = getUUID();

  const realtimeClient = new Ably.Realtime({
    clientId: sessionKey,
    authUrl: "/api/chatAuth",
    authMethod: "GET",
    authParams: {
      clientId: sessionKey,
    },
  });
  const chatClient = new ChatClient(realtimeClient);

  useLayoutEffect(() => {
    sessionStorage.setItem(KEY_STR, sessionKey);
  }, [sessionKey]);

  return (
    <ChatClientProvider client={chatClient}>{children}</ChatClientProvider>
  );
}
