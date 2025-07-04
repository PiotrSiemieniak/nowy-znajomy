// partials/SendButton.tsx
import { Button } from "@/components/ui/Button";
import { Send, Loader2 } from "lucide-react";

type Props = {
  disabled?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
};

export function SendButton({
  disabled = false,
  onClick,
  isLoading = false,
}: Props) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size="icon"
      className="w-full z-10"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Send className="h-4 w-4" />
      )}
    </Button>
  );
}
