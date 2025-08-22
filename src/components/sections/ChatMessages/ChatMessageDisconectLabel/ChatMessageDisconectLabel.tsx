import { Unplug } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  isItMe: boolean;
};
export function ChatMessageDisconectLabel({ isItMe }: Props) {
  const t = useTranslations("chat.states");

  // TODO: zrobić ten element ładniejszy. Moze specjalna czcionka
  return (
    <div className="w-full flex items-center justify-center bg-destructive/10 p-2 rounded-full gap-2 mt-4">
      <Unplug className="my-auto size-4 text-destructive/50" />
      <h1 className="font-bold w-ft text-destructive/50">
        {isItMe ? t("disconnectedByYou") : t("disconnectedByPeer")}
      </h1>
    </div>
  );
}
