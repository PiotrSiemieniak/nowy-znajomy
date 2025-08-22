import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Effect } from "./partials/Effect";
import { useInterlocutorInfoActions } from "@/components/specific/InterlocutorInfo/InterlocutorInfoDialog/hook";
import { useTranslations } from "next-intl";

export function ChatMessageDataTrade({
  isItMe = false,
  action,
  dataKey,
  isPrevMessageSameAuthor,
}: {
  isItMe?: boolean;
  action: string; // Typ akcji, np. 'trade' lub 'send'
  dataKey: string;
  isPrevMessageSameAuthor?: boolean;
  // Wypisać propsy, ale wcześniej upewnić się w którym polu przemycać typ danych (nazwe)
}) {
  const { acceptTradeData } = useInterlocutorInfoActions();
  const t = useTranslations("chat.trade");

  const getLabel = () => {
    if (isItMe) {
      return action === "trade" ? t("offerSentTrade") : t("offerSentInfo");
    } else {
      return action === "trade"
        ? t("offerReceivedTrade")
        : t("offerReceivedInfo");
    }
  };

  return (
    <div
      className={cn(
        "text-xs dark:from-slate-900/75 dark:to-black from-card/50 to-card/75 bg-gradient-to-b p-4 w-fit max-w-96 whitespace-pre-line rounded-xl",
        {
          "ml-auto ": isItMe,
          "mr-auto ": !isItMe,
          "mt-1": isPrevMessageSameAuthor,
          "mt-4": !isPrevMessageSameAuthor,
        }
      )}
    >
      <Effect />
      <p>{getLabel()}</p>
      <p className="text-base font-medium">{dataKey}</p>
      <Button
        variant={isItMe ? "outline" : "default"}
        className="my-2 w-full"
        disabled={isItMe}
        onClick={() => acceptTradeData(action as "trade" | "send", dataKey)}
      >
        {isItMe ? t("sent") : t("accept")}
      </Button>
      <p className="text-xs text-muted-foreground">
        {isItMe ? t("loginRequired") : t("ignoreNote")}
      </p>
    </div>
  );
}
