import { apiFetch } from "@/lib/services/apiFetch";
import { Channel } from "@/lib/globalTypes/channel";

export async function validateChannelInitialStage(payload: { name: string; description: string; tags: string[] }) {
  const res = await apiFetch(
    "/channel/verifyInitialStage",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    payload
  );
  return res;
}

export async function createChannel(payload: Partial<Channel>) {
  const res = await apiFetch(
    "/channel",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    },
    payload
  );
  return res;
}
