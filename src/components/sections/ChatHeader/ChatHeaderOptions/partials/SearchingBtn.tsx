import {
  useContextSelector,
  ChatActionCtx,
} from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { Button } from "@/components/ui/Button";
import { BadgePlus } from "lucide-react";
import { useTranslations } from "next-intl";

export function SearchingBtn() {
  const changeChatState = useContextSelector(
    ChatActionCtx,
    (actions) => actions.changeChatState
  );
  const t = useTranslations("chat.actions");

  const handleClick = () => {
    changeChatState(ChatStage.Searching);
  };

  return (
    <Button
      onClick={handleClick}
      size={"sm"}
      className="rounded-xl inline-flex"
    >
      <BadgePlus />
      {t("newChat")}
    </Button>
  );
}
