import { Button } from "@/components/ui/Button";
import { Flag } from "lucide-react";

export function ChatTitle() {
  return (
    <div className="py-2 -full flex flex-row justify-between">
      <Button
        variant={"ghost"}
        size={"sm"}
        className="rounded-xl inline-flex size-4 text-muted-foreground"
      >
        <Flag />
      </Button>
      <p className="text-xs font-medium mx-auto">Nieznajomy</p>
      <div></div>
    </div>
  );
}
