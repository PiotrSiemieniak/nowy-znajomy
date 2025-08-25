"use client";

import {
  useContextSelector,
  ChatStateCtx,
} from "@/components/providers/ChatProvider";
import { getSessionKey } from "@/lib/getSessionKey";

const NICKNAME_SX = "text-xs font-medium my-auto";

export function InterlocutorInfoNickname() {
  const roomUsersInfo = useContextSelector(
    ChatStateCtx,
    (state) => state.roomUsersInfo || {}
  );
  const meInfo = roomUsersInfo[getSessionKey()];
  const interlocutorInfo = Object.values(roomUsersInfo).find(
    (user) => user !== meInfo
  );

  return (
    <p className={NICKNAME_SX}>
      {interlocutorInfo?.username?.value || "Nieznajomy"}
    </p>
  );
}
