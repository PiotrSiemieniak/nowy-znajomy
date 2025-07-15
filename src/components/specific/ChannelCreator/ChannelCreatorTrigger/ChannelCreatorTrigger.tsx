import { Button } from "@/components/ui/Button";
import { DialogTrigger } from "@/components/ui/Dialog";

export function ChannelCreatorTrigger() {
  return (
    <DialogTrigger asChild>
      <Button size={"sm"} variant={"outline"}>
        Utwórz kanał
      </Button>
    </DialogTrigger>
  );
}
