import { toast, type ToastOptions } from "sonner";
import { Typography } from "@/components/ui/Typography";

/**
 * Wywołuje toast z opisem opakowanym w <Typography variant="muted" />
 * @param message - Treść toastu (tytuł)
 * @param description - Opis toastu (opcjonalnie)
 * @param options - Pozostałe opcje Sonner
 */
export function toastWithTypography(
  message: string,
  description?: string,
  options?: ToastOptions
) {
  toast(message, {
    ...options,
    description: description ? (
      <Typography variant="muted">{description}</Typography>
    ) : undefined,
  });
}
