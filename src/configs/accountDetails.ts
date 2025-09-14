import type { AccountDetails } from "@/lib/globalTypes/accountDetails";
import { MIN_HEIGHT, MAX_HEIGHT, MIN_WAGE, MAX_WAGE } from "./filters";

// Typ który wymaga WSZYSTKICH kluczy z AccountDetails
type AccountDetailsDataCardsConfig = {
  [K in keyof AccountDetails]-?: {  // -? usuwa optional, wymusza wszystkie klucze
    canBeEdited?: boolean;
    isVisible?: boolean; // Czy pole ma być wyświetlane w UI
    minValue?: number;
    maxValue?: number;
    contentType: string;
  };
};

export const accountDetailsDataCardsConfig: AccountDetailsDataCardsConfig = {
  accountId: {
    canBeEdited: false,
    isVisible: false, // ID konta nie jest wyświetlane
    contentType: "text"
  },
  birthDate: {
    canBeEdited: false,
    isVisible: true,
    contentType: "date"
  },
  firstName: {
    canBeEdited: true,
    isVisible: true,
    contentType: "text"
  },
  lastName: {
    canBeEdited: true,
    isVisible: true,
    contentType: "text"
  },
  height: {
    canBeEdited: true,
    isVisible: true,
    minValue: MIN_HEIGHT,
    maxValue: MAX_HEIGHT,
    contentType: "number"
  },
  nationality: {
    canBeEdited: true,
    isVisible: true,
    contentType: "text"
  },
  weight: {
    canBeEdited: true,
    isVisible: true,
    minValue: MIN_WAGE,
    maxValue: MAX_WAGE,
    contentType: "number"
  },
  sports: {
    canBeEdited: true,
    isVisible: true,
    contentType: "array"
  },
  specialFeatures: {
    canBeEdited: true,
    isVisible: true,
    contentType: "array"
  },
  musicGenres: {
    canBeEdited: true,
    isVisible: true,
    contentType: "array"
  },
  gender: {
    canBeEdited: false,
    isVisible: true,
    contentType: "enum"
  }
};

export const MIN_AGE = 16