import { usePresence, usePresenceListener } from "@ably/chat/react";
import { useEffect } from "react";
import type { RoomUserData, RoomUsersInfo } from "../../ChatProvider/types";
import { getSessionKey } from "@/lib/getSessionKey";
import { useChatAction } from "../../ChatProvider";
import { PresenceMember } from "@ably/chat";

/**
 * Synchronizuje presence Ably z roomUsersInfo w ChatProvider.
 * Wywołuje updateRoomUsersInfo oraz initializeRoomUsersInfo na podstawie zmian presence.
 */
export function useAblyRoomUsersInfo() {
  const { initializeRoomUsersInfo, updateRoomUsersInfo } = useChatAction();

  usePresence({
    enterWithData: {
      clientId: getSessionKey(),
    },
  });

  // Listener na pojedyncze eventy presence
  usePresenceListener({
    listener: (presenceData) => {
      const { clientId, data } = presenceData.member;
      updateRoomUsersInfo(clientId, data as RoomUserData);
    },
  });

  // Inicjalizacja pełnej listy obecnych użytkowników na starcie
  useEffect(() => {
    async function onPresenceChange() {
      const presence = (await import("@ably/chat/react")).usePresence().presence;
      const presenceData: PresenceMember[] | undefined = await presence?.get();
      if (presenceData) {
        const roomUserInfo: RoomUsersInfo = {};
        presenceData.forEach(({ clientId, data }) => {
          roomUserInfo[clientId] = data as RoomUserData;
        });
        initializeRoomUsersInfo(roomUserInfo);
      }
    }
    onPresenceChange();
  }, [initializeRoomUsersInfo]);
}
