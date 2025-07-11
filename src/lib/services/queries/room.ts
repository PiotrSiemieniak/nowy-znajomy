import { where } from "firebase/firestore";
import { addDocumentToFirestore, deleteDocumentFromFirestore, queryFirestore } from "../adapters/firebase/utils/queryFirestore";
import Ably from "ably";
import { generateColorPalette } from "@/components/providers/ChatProvider/utils";
import { getUUID } from "@/lib/crypto/getUUID";

const COLLECTION = 'room'

export type RoomCollectionType = {
  channelId: string; // TODO
  channelName: string; // TOOD
  userSessionKeys: string[]
  userIds: Array<string | null>,
  bgColors: string[]
}
export type RoomResponseData = Omit<RoomCollectionType, 'userSessionKeys' | 'userIds'> | null
type CreateRoomProps = {
  userSessionKeys: string[]
  userIds: Array<string | null>
}

export async function createRoom({ userSessionKeys, userIds }: CreateRoomProps): Promise<RoomResponseData> {
  try {
    const bgColors = generateColorPalette(15);
    // Wygeneruj unikalny roomId (np. przez getUUID)
    const roomId = getUUID();

    await addDocumentToFirestore<RoomCollectionType>(COLLECTION, {
      channelId: roomId,
      channelName: roomId,
      userSessionKeys,
      userIds,
      bgColors
    }, roomId)

    const client = new Ably.Rest(String(process.env.ABLY_API_KEY));
    await client.auth.createTokenRequest({
      clientId: roomId,
    });

    return {
      bgColors, channelId: roomId, channelName: roomId
    };
  } catch (error) {
    console.error("Błąd w createRoom:", error);
    return null;
  }
}

export async function getRoom({ sessionKey }: { sessionKey: string }): Promise<RoomResponseData> {
  try {
    // Queryfirestore ma T | T[] - do dupy. Moze zapytac claude czy to ma sens?
    const records = await queryFirestore<RoomCollectionType>(COLLECTION, {
      constraints: [where("userSessionKeys", "array-contains", sessionKey)],
    });
    const roomData = records?.[0]
    if (!roomData) return null
    
    const room: RoomResponseData = {
      bgColors: roomData.bgColors,
      channelId: roomData.channelId,
      channelName: roomData.channelName
    }

    return room;
  } catch (error) {
    console.error("Błąd w getRoom:", error);
    
    return null;
  }
}

type DeleteRoomProps = {
  sessionKey: string;
  roomId: string;
};

export async function deleteRoom({ sessionKey, roomId }: DeleteRoomProps): Promise<boolean> {
  // Pobierz dokument po ID
  const records = await queryFirestore<RoomCollectionType>("room", {
    docId: roomId,
  });

  const room = records?.[0];
  if (!room) return false;

  // Sprawdź, czy sessionKey jest w userSessionKeys
  if (!room.userSessionKeys.includes(sessionKey)) return false;

  // Usuń dokument po roomId
  return await deleteDocumentFromFirestore("room", roomId);
}