"use client"

import { useEffect } from "react";
import { disconnectRoom } from "@/lib/services/api/room";
import { getSessionKey } from "@/lib/getSessionKey";
import { ChatStage } from "./types";

export function useDeleteRoomOnDisconnectEffect(chatStage: ChatStage, chatId: string | null) {
  useEffect(() => {
    const sessionKey = getSessionKey();

    if (chatStage === ChatStage.Disconnected && sessionKey && chatId) {
      disconnectRoom({
        sessionKey,
        roomId: chatId,
      });
    }
  }, [chatStage, chatId]);
}

export function useResetProviderOnSearching(chatStage: ChatStage, callback: () => void) {
  useEffect(() => {
    if (chatStage === ChatStage.Searching) callback()
  }, [chatStage, callback]);
}