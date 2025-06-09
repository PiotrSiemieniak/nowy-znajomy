import type { WaitingRoomReq, WaitingRoomRes } from "@/app/api/waiting-room/route";
import { apiFetch } from "../apiFetch"

const ENDPOINT = '/waiting-room'

async function createWaitingRoom(data: WaitingRoomReq): Promise<WaitingRoomRes | null> {
  try {
    const res = await apiFetch<WaitingRoomReq, WaitingRoomRes>(
      ENDPOINT,
      { method: 'POST' },
      data
    );
    return res;
  } catch (err) {
    console.error("Błąd przy tworzeniu pokoju oczekiwania:", err);
    return null;
  }
}


export {
  createWaitingRoom
}