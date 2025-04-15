import { Button } from "@/components/ui/Button";
import { Flag, SlidersHorizontal, UserCog, X } from "lucide-react";

export function ChatOptions() {
  return (
    <div className="border-b py-2 flex flex-row justify-between">
      <div>
        <Button size={"sm"} className="rounded-xl inline-flex">
          <X className="mr-0.25" />
          Rozłącz
        </Button>
      </div>
      <div className="ml-auto inline-flex gap-2">
        <Button
          variant={"outline"}
          size={"sm"}
          className="rounded-xl inline-flex"
        >
          <Flag />
        </Button>
        <Button size={"sm"} className="rounded-xl inline-flex">
          Konto <UserCog className="ml-1" />
        </Button>
        <Button size={"sm"} className="rounded-xl inline-flex">
          Filtry i kanały <SlidersHorizontal className="ml-1" />
        </Button>
      </div>
    </div>
  );
}
