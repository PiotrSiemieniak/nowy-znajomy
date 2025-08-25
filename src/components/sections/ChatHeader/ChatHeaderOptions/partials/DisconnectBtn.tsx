import {
  useContextSelector,
  ChatStateCtx,
  ChatActionCtx,
} from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { Button } from "@/components/ui/Button";
import { useMessages, useRoom } from "@ably/chat/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useSendDisconnectOnUnload } from "../hooks";
import { useTranslations } from "next-intl";

export function DisconnectBtn() {
  const chatStage = useContextSelector(
    ChatStateCtx,
    (state) => state.chatStage
  );
  const disconnectCallback = useContextSelector(
    ChatActionCtx,
    (actions) => actions.disconnect
  );
  const t = useTranslations("chat.actions");
  const { detach } = useRoom();
  const { send: sendDisconnect } = useMessages({
    listener: ({ message }) => {
      disconnectCallback({
        ...message,
        author: message.clientId,
      });
    },
  });
  const sendDisconnectBind = () =>
    sendDisconnect({
      text: "disconnect",
      headers: { type: "disconnect" },
    });

  const handleClickButton = sendDisconnectBind;

  useEffect(() => {
    if (chatStage === ChatStage.Disconnected) detach();
  }, [chatStage, detach]);

  useSendDisconnectOnUnload(sendDisconnectBind);

  return (
    <Button
      onClick={() => handleClickButton()}
      size={"sm"}
      className="rounded-xl inline-flex"
    >
      <X className="mr-0.25" />
      {t("disconnect")}
    </Button>
  );
}
