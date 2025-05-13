import {
  useChatState,
  useChatAction,
} from "@/components/providers/ChatProvider";
import { Badge } from "@/components/ui/Badge";
import { RotateCcw, X } from "lucide-react";

const COUNT_TO_SHOW_RESET = 2;

export function ActiveChannelBadges() {
  const { selectedChannels } = useChatState();
  const { toggleChannelAsSelected } = useChatAction();

  const isShowResetCondition = selectedChannels.length >= COUNT_TO_SHOW_RESET;
  const isAnyChannel = selectedChannels.length;

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <p className="text-xs my-auto w-full">Aktywne kanały:</p>
      {!isAnyChannel && <Badge className="group">Cała Polska</Badge>}
      {selectedChannels.map((channel) => (
        <Badge
          key={channel.id}
          className="group"
          onClick={toggleChannelAsSelected.bind(null, channel)}
        >
          {channel.name}{" "}
          <X className="ml-1 opacity-25 group-hover::opacity-100" />
        </Badge>
      ))}
      {isShowResetCondition && (
        <Badge variant={"destructive"}>
          <RotateCcw className="mr-1" />
          Resetuj
        </Badge>
      )}
    </div>
  );
}
