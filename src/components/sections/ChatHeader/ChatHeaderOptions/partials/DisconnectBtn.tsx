import {
  useChatAction,
  useChatState,
} from "@/components/providers/ChatProvider";
import { ChatStage } from "@/components/providers/ChatProvider/types";
import { Button } from "@/components/ui/Button";
import { useMessages, useRoom } from "@ably/chat/react";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useSendDisconnectOnUnload } from "../hooks";

export function DisconnectBtn() {
  const { chatStage } = useChatState();
  const { disconnect: disconnectCallback } = useChatAction();
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
  }, [chatStage]);

  useSendDisconnectOnUnload(sendDisconnectBind);

  return (
    <Button
      onClick={() => handleClickButton()}
      size={"sm"}
      className="rounded-xl inline-flex"
    >
      <X className="mr-0.25" />
      Rozłącz
    </Button>
  );
}
