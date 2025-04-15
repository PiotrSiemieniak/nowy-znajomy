import { ChatOptions } from "./partials/ChatOptions";
import { ChatTitle } from "./partials/ChatTitle";

export function ChatHeader() {
  return (
    <div className="absolute top-0 w-full bg-card/50 backdrop-blur-xl">
      <div className="size-full relative">
        <div className=" px-2">
          <ChatOptions />
          <ChatTitle />
        </div>

        {/* <div className="w-full h-20 bg-red-400 absolute">
          <div className="h-5 w-full" />
        </div> */}
      </div>
    </div>
  );
}
