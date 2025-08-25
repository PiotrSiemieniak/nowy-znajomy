import { ActiveChannelBadges } from "@/components/specific/ActiveChannelBadges/ActiveChannelBadges";
import { useTranslations } from "next-intl";

export function ChatInitialScreen() {
  const t = useTranslations("chat.states");

  return (
    <div className="h-full w-fit mx-auto flex flex-col items-center justify-center gap-5 p-2">
      <h1 className="mix-blend-soft-light text-5xl text-center font-bold italic">
        {t("startConversation")}
      </h1>
      <div className="w-full">
        <ActiveChannelBadges />
        {/* <div className="w-full flex items-center space-x-2 text-xs">
          <div className="h-px flex-1 bg-muted-foreground" />
          <p>lub</p>
          <div className="h-px flex-1 bg-muted-foreground" />
        </div> */}
      </div>
    </div>
  );
}
