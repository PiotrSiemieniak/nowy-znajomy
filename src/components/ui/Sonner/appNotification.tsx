import { toast, type ExternalToast } from "sonner";
import { Typography } from "@/components/ui/Typography";
import type { ReactNode } from "react";

/**
 * Wywołuje toast z opisem opakowanym w <Typography variant="muted" />
 * @param message - Treść toastu (tytuł)
 * @param description - Opis toastu (opcjonalnie)
 * @param options - Pozostałe opcje Sonner
 */
export function appNotification(
  message: ReactNode,
  description?: ReactNode,
  options?: ExternalToast
) {
  toast(<Typography variant={"small"}>{message}</Typography>, {
    ...options,
    description: description ? (
      <Typography className="text-xs">{description}</Typography>
    ) : undefined,
  });
}
