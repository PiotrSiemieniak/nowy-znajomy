import { addDocumentToFirestore } from "../adapters/firebase/utils/queryFirestore";

const COLLECTION = 'room'

export type RoomCollectionType = {
  channelId: string; // TODO
  channelName: string; // TOOD
  users: User[]
}
type User = {
  sessionKey: string; // TODO
  id: string;
}
type CreateRoomProps = {
  userSessionKeys: User[]
}

export async function createRoom({ userSessionKeys }: CreateRoomProps): Promise<string | null>{
  const roomId = await addDocumentToFirestore<RoomCollectionType>(COLLECTION, {
    channelId: 'mock',
    channelName: 'mock',
    users: userSessionKeys
  })

  return roomId
}