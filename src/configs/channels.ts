export const MAX_CHANNELS_FOR_NON_PREMIUM = 5
export const CHANNEL_NAME_MIN_LENGTH = 5;
export const CHANNEL_NAME_MAX_LENGTH = 64;
// Pozwala na litery (w tym z różnych alfabetów), cyfry, spacje, myślniki, podkreślenia
// Nie pozwala na emoji i znaki specjalne
export const CHANNEL_NAME_REGEX = /^[\p{L}\p{N} _-]+$/u;
export const CHANNEL_TAGS_MIN_COUNT = 2;
export const CHANNEL_TAGS_MAX_COUNT = 10;