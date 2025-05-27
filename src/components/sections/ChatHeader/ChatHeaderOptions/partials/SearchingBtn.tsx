import { useChatAction } from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { Button } from "@/components/ui/Button";
import { BadgePlus } from "lucide-react";

export function SearchingBtn() {
  const { changeChatState } = useChatAction();

  const handleClick = () => changeChatState(ChatStage.Searching);

  return (
    <Button
      onClick={handleClick}
      size={"sm"}
      className="rounded-xl inline-flex"
    >
      <BadgePlus />
      Nowa rozmowa
    </Button>
  );
}
