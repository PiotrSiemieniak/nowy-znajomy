import {
  useContextSelector,
  ChatActionCtx,
} from "@/components/providers/ChatProvider";
import { useMessages } from "@ably/chat/react";
import { useCallback } from "react";
import { useSession } from "next-auth/react";

export type InterlocutorDataAction = "trade" | "send";

export function useInterlocutorInfoActions() {
  // Hook do obsługi wiadomości Ably typu interlocutorData
  const sendInterlocutorDataMessage = useContextSelector(
    ChatActionCtx,
    (actions) => actions.sendInterlocutorDataMessage
  );
  const { send } = useMessages({
    listener: async ({ message }) => {
      sendInterlocutorDataMessage({
        ...message,
        author: message.clientId,
      });
    },
  });
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  // Wysyłanie wiadomości interlocutorData
  const sendTradeData = useCallback(
    (action: InterlocutorDataAction, dataKey: string) => {
      if (!isLoggedIn) return;
      return send({
        text: "interlocutorData",
        headers: {
          type: "interlocutorData",
          action,
          dataKey,
        },
      });
    },
    [send, isLoggedIn]
  );
  // Akceptacja tradeData
  const acceptTradeData = useCallback(
    (action: InterlocutorDataAction, dataKey: string) => {
      if (!isLoggedIn) return;
      return send({
        text: "tradeAccepted",
        headers: {
          type: "tradeAccepted",
          action,
          dataKey,
        },
      });
    },
    [send, isLoggedIn]
  );

  return {
    sendTradeData,
    acceptTradeData,
  };
}
