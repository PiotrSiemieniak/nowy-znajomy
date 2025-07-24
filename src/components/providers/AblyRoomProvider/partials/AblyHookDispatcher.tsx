"use client";

import { useAblyRoomUsersInfo } from "../hooks/useAblyRoomUsersInfo";

export function AblyHookDispatcher({
  children,
}: {
  children: React.ReactNode;
}) {
  useAblyRoomUsersInfo();

  return <>{children}</>;
}
