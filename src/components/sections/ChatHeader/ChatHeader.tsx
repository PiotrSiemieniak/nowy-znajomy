import { ChatHeaderOptions } from "./ChatHeaderOptions";
import { ChatHeaderTitle } from "./ChatHeaderTitle";

export function ChatHeader() {
  return (
    <div className="top-0 w-full bg-card/30 backdrop-blur-xl z-10">
      <div className="size-full relative">
        <div className=" px-2">
          <ChatHeaderOptions />
          <ChatHeaderTitle />
        </div>

        {/* <div className="w-full h-20 bg-red-400 absolute">
          <div className="h-5 w-full" />
        </div> */}
      </div>
    </div>
  );
}
