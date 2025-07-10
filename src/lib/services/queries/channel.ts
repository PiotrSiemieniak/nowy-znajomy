import { addDocumentToFirestore, queryFirestore } from "@/lib/services/adapters/firebase/utils/queryFirestore";
import { Channel } from "@/lib/globalTypes/channel";
import { where } from "firebase/firestore";

export async function createChannel(channel: Channel): Promise<string | null> {
  return await addDocumentToFirestore<Channel>("channels", channel, channel.id);
}

export async function isChannelNameTaken(name: string): Promise<boolean> {
  const nameLower = name.trim().toLowerCase();
  const existing = await queryFirestore("channels", {
    constraints: [where("nameLower", "==", nameLower)]
  });
  return !!(existing && existing.length > 0);
}
