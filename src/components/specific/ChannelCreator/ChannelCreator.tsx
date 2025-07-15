import { Dialog } from "@/components/ui/Dialog";
import { ChannelCreatorContent } from "./ChannelCreatorContent";
import { ChannelCreatorTrigger } from "./ChannelCreatorTrigger";

type Props = {};
export function ChannelCreator({}: Props) {
  return (
    <Dialog>
      <ChannelCreatorTrigger />
      <ChannelCreatorContent />
    </Dialog>
  );
}
