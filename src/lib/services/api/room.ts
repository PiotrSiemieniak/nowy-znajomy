"use client"

import { apiFetch } from "../apiFetch";

type DisconnectRoomReq = {
  sessionKey: string;
  roomId: string;
};

type DisconnectRoomRes = {
  success?: boolean;
  error?: string;
};

export async function disconnectRoom(data: DisconnectRoomReq): Promise<DisconnectRoomRes | null> {
  try {
    const res = await apiFetch<DisconnectRoomReq, DisconnectRoomRes>(
      "/room",
      { method: "POST" },
      data
    );
    
    return res;
  } catch (err) {
    console.error("Błąd przy rozłączaniu pokoju:", err);
    return null;
  }
}