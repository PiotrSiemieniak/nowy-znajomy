// lib/serverMemory/waitingRoom.ts

const WAITING_ROOM_EXPIRATION_MS = 5 * 60 * 1000; // 5 minut

export type WaitingUser = {
  uid?: string;
  sessionKey: string; // Klucz oczekiwany tylko na czas pobytu w waitingRoom
  preferences: unknown
  createdAt: Date;
  lastTickAt: Date
  // channels,
}
const waitingRoom: WaitingUser[] = [];

export function isUserInWaitingRoom(sessionKey: string): boolean{
  const index = waitingRoom.findIndex((other) => other.sessionKey === sessionKey);

  console.log('isUserInWaitingRoom', Boolean(index !== 1), index)
  return Boolean(index !== -1)
}

function addUserToWaitingRoom(sessionKey: string) {
  if (!isUserInWaitingRoom(sessionKey)) {
    waitingRoom.push({
      sessionKey,
      preferences: null,
      createdAt: new Date(),
      lastTickAt: new Date()
    })
    return true
  }
  return false
}

export function clearOldRecordsInWaitingRoom() {
  const now = Date.now();
  for (let i = waitingRoom.length - 1; i >= 0; i--) {
    const createdAt = waitingRoom[i].lastTickAt instanceof Date
      ? waitingRoom[i].lastTickAt.getTime()
      : new Date(waitingRoom[i].lastTickAt).getTime();
    const timeDiff = now - createdAt
    const isRecordExpired = timeDiff > WAITING_ROOM_EXPIRATION_MS 
    if (isRecordExpired) {
      waitingRoom.splice(i, 1);
    }
  }
}

export function findOrQueueUser(sessionKey: string): WaitingUser | null {

  if (false) {
    //todo find
  } else {
    addUserToWaitingRoom(sessionKey)

    console.log('waitingRoom', waitingRoom)

    return null
  }
}

export function removeUserFromQueue(userId: string) {
  const index = waitingRoom.findIndex((u) => u.id === userId);
  if (index !== -1) waitingRoom.splice(index, 1);
}
