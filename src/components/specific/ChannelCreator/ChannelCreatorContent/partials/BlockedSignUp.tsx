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
import { useTranslations } from "next-intl";

export function BlockedSignUp() {
  const t = useTranslations("channelCreator.blockedSignUp");

  return (
    <DialogContent className="overflow-hidden">
      <DialogHeader>
        <DialogTitle className="text-left">{t("title")}</DialogTitle>
        <DialogDescription className="text-left">
          {t("description")}
        </DialogDescription>
      </DialogHeader>
      <Separator />
      <ChannelCreatorTeaser />
      <Separator />
      <DialogFooter>
        <DialogClose asChild>
          <Button>{t("closeButton")}</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
