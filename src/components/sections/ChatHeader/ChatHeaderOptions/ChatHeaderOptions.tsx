import { Button } from "@/components/ui/Button";
import { Channels } from "./partials/Channels";
import { UserCog, X } from "lucide-react";

export function ChatHeaderOptions() {
  return (
    <div className="border-b border-border/50 py-2 flex flex-row justify-between">
      <div>
        <Button size={"sm"} className="rounded-xl inline-flex">
          <X className="mr-0.25" />
          Rozłącz
        </Button>
      </div>
      <div className="ml-auto inline-flex gap-2">
        <Button size={"sm"} className="rounded-xl inline-flex">
          Konto <UserCog className="ml-1" />
        </Button>
        <Channels />
      </div>
    </div>
  );
}
