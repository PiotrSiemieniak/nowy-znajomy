import { addDocumentToFirestore, queryFirestore } from "@/lib/services/adapters/firebase/utils/queryFirestore";
import { Channel } from "@/lib/globalTypes/channel";
import { where } from "firebase/firestore";
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";

const COLLECTION_NAME = "channels";

export async function createChannel(channel: Channel): Promise<string | null> {
  return await addDocumentToFirestore<Channel>(COLLECTION_NAME, channel, channel.id);
}

export async function isChannelNameTaken(name: string): Promise<boolean> {
  const nameLower = name.trim().toLowerCase();
  const existing = await queryFirestore(COLLECTION_NAME, {
    constraints: [where("nameLower", "==", nameLower)]
  });
  return !!(existing && existing.length > 0);
}

export async function getChannelCount(): Promise<number> {
  const db = getFirestore();
  const coll = collection(db, COLLECTION_NAME);
  const snapshot = await getCountFromServer(coll);
  return snapshot.data().count;
}
