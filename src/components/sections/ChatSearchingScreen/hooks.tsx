import { WaitingRoomStatuses } from "@/app/api/waiting-room/route";
import {
  useChatAction,
  useChatState,
} from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { getSessionKey } from "@/lib/getSessionKey";
import { createWaitingRoom } from "@/lib/services/api/waitingRoom";
import { useEffect, useRef } from "react";

export const useSearchPooling = () => {
  const { changeChatState, changeChatId, setNewBgColors } = useChatAction();
  const { filters } = useChatState();

  const retryCountRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchWithRetry = async () => {
      try {
        const res = await createWaitingRoom({
          filters,
          sessionKey: getSessionKey(),
        });

        switch (res?.status) {
          case WaitingRoomStatuses.matched:
            changeChatState(ChatStage.Connected);
            if (res.room) {
              changeChatId(res.room.channelId);
              setNewBgColors(res.room.bgColors);
            }
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
