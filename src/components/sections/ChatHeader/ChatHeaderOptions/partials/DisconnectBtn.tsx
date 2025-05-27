import { useChatAction } from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

export function DisconnectBtn() {
  const { changeChatState } = useChatAction();

  const handleClick = () => changeChatState(ChatStage.Disconnected);

  return (
    <Button
      onClick={handleClick}
      size={"sm"}
      className="rounded-xl inline-flex"
    >
      <X className="mr-0.25" />
      Rozłącz
    </Button>
  );
}
