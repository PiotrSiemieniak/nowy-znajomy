import { ChatOptions } from "./partials/ChatOptions";
import { ChatTitle } from "./partials/ChatTitle";

export function ChatHeader() {
  return (
    <div className="flex flex-col absolute top-0 w-full px-2 bg-card/50 backdrop-blur-3xl">
      <ChatOptions />
      <ChatTitle />
    </div>
  );
}
