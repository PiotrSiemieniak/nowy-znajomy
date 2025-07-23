import { getChannelCount } from "@/lib/services/queries/channel";

// Komponent serwerowy Next.js
export default async function ChatPageChannelCounter() {
  const count = await getChannelCount();

  return <p className="text-xs font-medium w-1/3">{count}</p>;
}

// ISR: Odświeżanie co 60 sekund
export const revalidate = 60;
