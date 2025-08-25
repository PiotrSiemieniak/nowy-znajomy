import { MessageState, ChatStage } from "../types";
import { throwDebugMessage } from "@/lib/services/throwDebugMessage";
import { disconnectRoom } from "@/lib/services/api/room";
import { getSessionKey } from "@/lib/getSessionKey";

export const createSendMessage = (
  isChatActive: boolean,
  messages: MessageState[],
  setMessages: (fn: (prev: MessageState[]) => MessageState[]) => void,
  t: (key: string, params?: Record<string, unknown>) => string
) => async (el: Omit<MessageState, "id">) => {
  const isMessageType = el.headers.type === "message";

  if (!isMessageType || !isChatActive) {
    throwDebugMessage(t("sendMessageError"), el.headers.type);
    return;
  }

  const newMessage: MessageState = { ...el, id: String(messages.length + 1) };
  setMessages((prevMessages) => [...prevMessages, newMessage]);
  return;
};

export const createDisconnect = (
  chatStage: ChatStage,
  messages: MessageState[],
  setMessages: (fn: (prev: MessageState[]) => MessageState[]) => void,
  setChatStage: (stage: ChatStage) => void,
  chatId: string | null
) => (el: Omit<MessageState, "id">) => {
  const isMsgNonDisconnectType = el.headers.type !== "disconnect";
  const isDisconnected = chatStage === ChatStage.Disconnected;

  if (isMsgNonDisconnectType || isDisconnected) return null;

  const sessionKey = getSessionKey();
  const newMessage: MessageState = { ...el, id: String(messages.length + 1) };

  setMessages((prevMessages) => [...prevMessages, newMessage]);
  setChatStage(ChatStage.Disconnected);
  
  if (chatId) {
    disconnectRoom({
      sessionKey,
      roomId: chatId,
    });
  }
};

export const handlePopoverStateEffect = (isPopoverOpen: boolean) => {
  const node = document.getElementById("chat-container");
  node?.setAttribute("data-ispopoveropen", String(isPopoverOpen));
};
