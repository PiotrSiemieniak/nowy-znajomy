import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Separator } from "@/components/ui/Separator";
import { ChannelCreatorTeaser } from "../../ChannelCreatorTeaser";
import { Button } from "@/components/ui/Button";

export function BlockedSignUp() {
  return (
    <DialogContent className="overflow-hidden">
      <DialogHeader>
        <DialogTitle className="text-left">Zaloguj się</DialogTitle>
        <DialogDescription className="text-left">
          Aby utworzyć nowy kanał, musisz być zalogowany. Zaloguj się, aby
          uzyskać dostęp do tej funkcji.
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <ChannelCreatorTeaser />
      <Separator />
      <DialogFooter>
        <DialogClose asChild>
          <Button>Zamknij</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
