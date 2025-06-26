import { Button } from "@/components/ui/Button";
import { ArrowDown } from "lucide-react";

type Props = { isAtBottom: boolean; onClick: () => void };
export function ScrollToBottomButton({ isAtBottom, onClick }: Props) {
  if (isAtBottom) return null;

  return (
    <Button onClick={onClick} size={"icon"} className="ml-auto mx-2">
      <ArrowDown />
    </Button>
  );
}
