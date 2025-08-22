import { ChatProvider } from "@/components/providers/ChatProvider";
import { User } from "lucide-react";
import { ChatPageContent } from "./ChatPageContent";
import { AblyClientProvider } from "@/components/providers/AblyClientProvider";
import ChatPageChannelCounter from "./ChatPageChannelCounter/ChatPageChannelCounter";
import { useTranslations } from "next-intl";

export default function ChatPage() {
  const t = useTranslations("app");

  return (
    <div className="h-full w-full relative bg-black -z-50">
      <div className="flex fixed top-0 z-10 bg-black justify-between flex-row py-1 px-2 gap-2 w-full text-white overflow-hidden">
        <ChatPageChannelCounter />
        <p className="text-xs font-medium w-1/3 text-center">{t("title")}</p>
        <div className="text-xs font-medium w-1/3 text-right inline-flex">
          <p className="ml-auto">1342</p>{" "}
          <User className="size-3 my-auto ml-1" />
        </div>
      </div>
      <AblyClientProvider>
        <ChatProvider>
          <ChatPageContent />
        </ChatProvider>
      </AblyClientProvider>
    </div>
  );
}
