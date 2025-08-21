import { IS_DEV_MODE } from "@/configs/dev";

/**
 * Wyświetla debugowy komunikat i rzuca błąd tylko w trybie development.
 * @param message - Treść komunikatu/błędu
 * @param data - Dodatkowe dane do zalogowania (opcjonalnie)
 */
export function throwDebugMessage(
  message: string,
  data?: unknown,
  options?: { isError?: boolean; tag?: string }
) {
  if (IS_DEV_MODE) {
    const timestamp = new Date().toISOString();
    const prefix = options?.tag ? `[${options.tag}]` : "";
    console.log(`[DEBUG]${prefix}[${timestamp}]`, message);
    if (data !== undefined) {
      console.log(`[DEBUG][DATA]${prefix}`, data);
    }
    if (options?.isError) {
      throw new Error(message);
    }
  }
}