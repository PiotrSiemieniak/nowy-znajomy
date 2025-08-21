"use client"

import { usePresence, usePresenceListener } from "@ably/chat/react";
import { useEffect, useRef } from "react";
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
  const { chatId, roomUsersInfo } = useChatState();
  const mySessionKey = getSessionKey();
  
  // Ref do stabilnej referencji initializeRoomUsersInfo (unikamy efektu na każdą zmianę referencji funkcji)
  const initRoomUsersInfoRef = useRef(initializeRoomUsersInfo);
  useEffect(() => { initRoomUsersInfoRef.current = initializeRoomUsersInfo; }, [initializeRoomUsersInfo]);

  // Wywołaj hook na najwyższym poziomie
  const { presence } = usePresence({});

  // Listener na update'y i wydarzenia -> aktualizuje stan providera
  usePresenceListener({
    listener: (presenceEvent) => {
      const { clientId, data } = presenceEvent.member;
      updateRoomUsersInfo(clientId, data as RoomUserData);
    },
  });

  // Inicjalizacja pełnej listy obecnych użytkowników na starcie / zmianie pokoju
  useEffect(() => {
    if (!chatId || !presence) return;
    let cancelled = false;
    (async function initPresenceSnapshot() {
      try {
        const presenceData: PresenceMember[] | undefined = await presence.get();
        if (!presenceData || cancelled) return;
        const roomUserInfo: RoomUsersInfo = {};
        for (const { clientId, data } of presenceData) {
          roomUserInfo[clientId] = data as RoomUserData;
        }
        initRoomUsersInfoRef.current(roomUserInfo);
      } catch {
        // opcjonalnie: log w dev
      }
    })();
    return () => { cancelled = true; };
  }, [chatId, presence]);

  // ---==--- LOKALNA -> PRESENCE SYNC (tylko jeśli dane się zmieniły) ---==---
  const lastSerializedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!presence) return; // brak obiektu presence
    const myData = roomUsersInfo[mySessionKey];
    if (!myData) return; // jeszcze nie mamy danych lokalnych

    // Serializacja do porównania głębokiego
    const serialized = JSON.stringify(myData);
    if (lastSerializedRef.current === serialized) return; // brak realnej zmiany

    lastSerializedRef.current = serialized;
    // Aktualizacja presence (ignoruj błędy w dev-friendly sposób)
    Promise.resolve(presence.update(myData)).catch(() => {});
  }, [roomUsersInfo, mySessionKey, presence]);

  // Reset ref przy zmianie pokoju (aby wymusić sync po wejściu)
  useEffect(() => {
    lastSerializedRef.current = null;
  }, [chatId]);
}
