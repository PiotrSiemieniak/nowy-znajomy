import { where } from "firebase/firestore";
import { addDocumentToFirestore, queryFirestore } from "../adapters/firebase/utils/queryFirestore";
import Ably from "ably";

const COLLECTION = 'room'

export type RoomCollectionType = {
  channelId: string; // TODO
  channelName: string; // TOOD
  userSessionKeys: string[]
  userIds: Array<string | null>
}
type CreateRoomProps = {
  userSessionKeys: string[]
  userIds: Array<string | null>
}
type Record = RoomCollectionType & {
  id: string
}

export async function createRoom({ userSessionKeys, userIds }: CreateRoomProps): Promise<string | null>{
  const roomId = await addDocumentToFirestore<RoomCollectionType>(COLLECTION, {
    channelId: 'mock',
    channelName: 'mock',
    userSessionKeys,
    userIds
  })

  if (roomId) {
    const client = new Ably.Rest(String(process.env.ABLY_API_KEY));
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: roomId,
    });
    console.log(tokenRequestData);
  }

  return roomId
}

export async function getRoom({ sessionKey }: { sessionKey: string }): Promise<string | null>{
  const record = await queryFirestore<Record>(COLLECTION, {
    constraints: [where("userSessionKeys", "array-contains", sessionKey)]
  })
  const roomId = record?.[0] ? String(record?.[0].id) as string :  null

  return roomId
}