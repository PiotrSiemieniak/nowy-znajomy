import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export function ChatOptions() {
  return (
    <div className="border-b py-2 flex flex-row justify-between">
      <div>
        <Button size={"sm"} className="rounded-xl inline-flex">
          <X className="mr-0.25" />
          Rozłącz
        </Button>
      </div>
      <div></div>
    </div>
  );
}
