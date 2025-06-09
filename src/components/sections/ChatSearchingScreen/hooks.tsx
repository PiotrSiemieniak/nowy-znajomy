import { WaitingRoomStatuses } from "@/app/api/waiting-room/route";
import {
  useChatAction,
  useChatState,
} from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { getUUID } from "@/lib/crypto/getUUID";
import { createWaitingRoom } from "@/lib/services/api/waitingRoom";
import { useEffect, useRef } from "react";

const KEY_STR = "SESSION_KEY";

export const useSearchPooling = () => {
  const { changeChatState } = useChatAction();
  const { filters } = useChatState();

  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!sessionKeyRef.current) {
      let sessionKey = sessionStorage.getItem(KEY_STR);
      if (!sessionKey) {
        sessionKey = getUUID();
        sessionStorage.setItem(KEY_STR, sessionKey);
      }
      sessionKeyRef.current = sessionKey;
    }

    const fetchWithRetry = async () => {
      try {
        const res = await createWaitingRoom({
          filters,
          sessionKey: String(sessionKeyRef.current),
        });

        switch (res?.status) {
          case WaitingRoomStatuses.matched:
            changeChatState(ChatStage.Connected);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;

          case WaitingRoomStatuses.waiting:
            retryCountRef.current += 1;
            const delay = retryCountRef.current >= 10 ? 5000 : 3000;
            timeoutRef.current = setTimeout(fetchWithRetry, delay);
            break;

          default:
            console.warn("Nieoczekiwany status:", res?.status);
        }
      } catch (err) {
        console.error("Błąd podczas rejestracji w poczekalni:", err);
      }
    };

    fetchWithRetry();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [changeChatState, filters]); // zostaw filters, ale pamiętaj: one muszą być stabilne
};
