import { CHANNEL_NAME_MIN_LENGTH, CHANNEL_NAME_MAX_LENGTH, CHANNEL_NAME_REGEX } from "@/configs/channels";

export function validateChannelName(name: string): string | null {
  if (!name || name.trim().length < CHANNEL_NAME_MIN_LENGTH || name.trim().length > CHANNEL_NAME_MAX_LENGTH) {
    return `Channel name must be ${CHANNEL_NAME_MIN_LENGTH}-${CHANNEL_NAME_MAX_LENGTH} characters long`;
  }
  if (!CHANNEL_NAME_REGEX.test(name.trim())) {
    return "Channel name contains invalid characters";
  }
  return null;
}
