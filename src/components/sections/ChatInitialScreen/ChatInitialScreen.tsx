import { useChatAction } from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { ActiveChannelBadges } from "@/components/specific/ActiveChannelBadges/ActiveChannelBadges";
import { Button } from "@/components/ui/Button";

export function ChatInitialScreen() {
  const { changeChatState } = useChatAction();

  return (
    <div className="size-full flex flex-col items-center justify-center gap-5">
      <h1 className="mix-blend-soft-light text-5xl text-center font-bold italic">
        Rozpocznij rozmowę
      </h1>
      <div className="w-full max-w-72 space-y-1">
        <ActiveChannelBadges />
        {/* <div className="w-full flex items-center space-x-2 text-xs">
          <div className="h-px flex-1 bg-muted-foreground" />
          <p>lub</p>
          <div className="h-px flex-1 bg-muted-foreground" />
        </div> */}
      </div>
      <Button
        className="w-full max-w-72"
        onClick={changeChatState.bind(null, ChatStage.Searching)}
      >
        Wyszukaj nowego znajomego
      </Button>
    </div>
  );
}
