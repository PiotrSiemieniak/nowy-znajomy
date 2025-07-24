"use client"

import { usePresence, usePresenceListener } from "@ably/chat/react";
import { useEffect } from "react";
import type { RoomUserData, RoomUsersInfo } from "../../ChatProvider/types";
import { getSessionKey } from "@/lib/getSessionKey";
import { useChatAction, useChatState } from "../../ChatProvider";
import { PresenceMember } from "@ably/chat";

/**
 * Synchronizuje presence Ably z roomUsersInfo w ChatProvider.
 * Wywołuje updateRoomUsersInfo oraz initializeRoomUsersInfo na podstawie zmian presence.
 */
export function useAblyRoomUsersInfo() {
  const { initializeRoomUsersInfo, updateRoomUsersInfo } = useChatAction();
  const { chatId } = useChatState()

  // Wywołaj hook na najwyższym poziomie
  const { presence } = usePresence({
    enterWithData: {
      clientId: getSessionKey(),
    },
  });

  // Listener na update'y i wydarzenia
  usePresenceListener({
    listener: (presenceEvent) => {
      const { clientId, data } = presenceEvent.member;
      updateRoomUsersInfo(clientId, data as RoomUserData);
    },
  });

  // Inicjalizacja pełnej listy obecnych użytkowników na starcie
  useEffect(() => {
    (async function onPresenceChange() {
      if (!chatId) return;
      // Early return to avoid looping, and to ensure we only run this once when connected to the room
      // Wczesny return, żeby uniknąć pętli i zmian więcej, niż przy połączeniu z pokojem
      const presenceData: PresenceMember[] | undefined = await presence?.get();
      if (presenceData) {
        const roomUserInfo: RoomUsersInfo = {};
        presenceData.forEach(({ clientId, data }) => {
          roomUserInfo[clientId] = data as RoomUserData;
        });
        initializeRoomUsersInfo(roomUserInfo);
      }
      return;
    })();
  }, [chatId]); // <- tylko raz po zamontowaniu
}
