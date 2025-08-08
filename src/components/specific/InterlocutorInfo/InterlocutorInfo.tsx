import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/Avatar/Avatar";
import { Button } from "@/components/ui/Button";
import { FormElement } from "@/components/ui/FormElement";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Separator } from "@/components/ui/Separator";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  LucideMessageCircleQuestion,
  UserRound,
  UserRoundPen,
  UserRoundPlus,
} from "lucide-react";
import { InterlocutorInfoNickname } from "./InterlocutorInfoNickname";
import { InterlocutorInfoDialog } from "./InterlocutorInfoDialog";
import { useChatAction } from "@/components/providers/ChatProvider";
import { DataRecord } from "./InterlocutorInfoNickname/partials/DataRecord";

export function InterlocutorInfo() {
  const {} = useChatAction();

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Nick */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex space-x-2">
          <Avatar>
            <AvatarImage />
            <AvatarFallback className="bg-black">
              <UserRound className="dark:text-muted text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <InterlocutorInfoNickname />
        </div>
        <div className="inline-flex w-full space-x-2">
          <Button className="flex-1" variant={"outline"}>
            <UserRoundPen />
            Zapytaj o nazwę
          </Button>
          <Button className="flex-1" variant={"outline"}>
            <UserRoundPlus />
            Dodaj do znajomych
          </Button>
        </div>
      </div>
      {/* Wiek, płeć, wzrost, waga */}
      <div className="flex flex-col gap-2 rounded-md bg-card p-4 border">
        <DataRecord value={"birthDate"} />
        <Separator />
        <DataRecord value={"gender"} />
        <Separator />
        <DataRecord value={"height"} />
        <Separator />
        <DataRecord value={"weight"} />
      </div>
      <InterlocutorInfoDialog />
    </div>
  );
}
