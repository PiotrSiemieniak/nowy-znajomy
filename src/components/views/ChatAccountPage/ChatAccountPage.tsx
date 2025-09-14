import { Heading } from "@/components/ui/Heading";
import { AccountDetails } from "@/components/sections/AccountDetails";
import { ChatAccountPageAvatar } from "./ChatAccountPageAvatar";

export function ChatAccountPage() {
  // const { data: session } = useServers();
  return (
    <div className="space-y-4">
      <Heading as="h1" className="text-left">
        Witaj
      </Heading>

      <ChatAccountPageAvatar />
      <AccountDetails />
    </div>
  );
}
