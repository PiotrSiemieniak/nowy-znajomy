import { Button } from "@/components/ui/Button";
import { DialogTrigger } from "@/components/ui/Dialog";
import { useTranslations } from "next-intl";

export function ChannelCreatorTrigger() {
  const t = useTranslations("channelCreator");

  return (
    <DialogTrigger asChild>
      <Button size={"sm"} variant={"outline"}>
        {t("trigger")}
      </Button>
    </DialogTrigger>
  );
}
