import { Heading } from "@/components/ui/Heading";
import { useSession } from "next-auth/react";
import { ChatAccountPageDetails } from "./ChatAccountPageDetails";

export function ChatAccountPage() {
  // const { data: session } = useServers();
  return (
    <div className="space-y-4">
      <Heading as="h1" className="text-left">
        Witaj
      </Heading>
      <ChatAccountPageDetails />
    </div>
  );
}
