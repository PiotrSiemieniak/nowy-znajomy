import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/Avatar/Avatar";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { UserRound, UserRoundPen, UserRoundPlus } from "lucide-react";
import { InterlocutorInfoNickname } from "./InterlocutorInfoNickname";
import { InterlocutorInfoDialog } from "./InterlocutorInfoDialog";
import {
  useChatAction,
  useChatState,
} from "@/components/providers/ChatProvider";
import { DataRecord } from "./InterlocutorInfoNickname/partials/DataRecord";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { useTranslations } from "next-intl";

export function InterlocutorInfo() {
  const {} = useChatAction();
  const { chatStage } = useChatState();
  const t = useTranslations("interlocutorInfo");

  if (chatStage === ChatStage.Initial || chatStage === ChatStage.Searching)
    return null;

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
            {t("askForName")}
          </Button>
          <Button className="flex-1" variant={"outline"}>
            <UserRoundPlus />
            {t("addToFriends")}
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
