import { Button } from "@/components/ui/Button";
import { Flag } from "lucide-react";

export function ChatHeaderTitle() {
  return (
    <div className="py-2 -full flex flex-row justify-between">
      <div className="w-1/4">
        <Button
          variant={"ghost"}
          size={"sm"}
          className="rounded-xl inline-flex size-4 text-muted-foreground"
        >
          <Flag />
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center w-1/2">
        <p className="text-xs font-medium ">Nieznajomy</p>
      </div>
      <div className="w-1/4"></div>
    </div>
  );
}
