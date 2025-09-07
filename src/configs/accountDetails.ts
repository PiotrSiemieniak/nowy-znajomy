import type { AccountDetails } from "@/lib/globalTypes/accountDetails";

// Typ który wymaga WSZYSTKICH kluczy z AccountDetails
type AccountDetailsDataCardsConfig = {
  [K in keyof AccountDetails]-?: {  // -? usuwa optional, wymusza wszystkie klucze
    canBeEdited?: boolean;
    maxValue?: number;
    contentType: string;
  };
};

export const accountDetailsDataCardsConfig: AccountDetailsDataCardsConfig = {
  accountId: {
    canBeEdited: false,
    contentType: "text"
  },
  birthDate: {
    canBeEdited: false,
    contentType: "date"
  },
  firstName: {
    canBeEdited: true,
    contentType: "text"
  },
  lastName: {
    canBeEdited: true,
    contentType: "text"
  },
  height: {
    canBeEdited: true,
    maxValue: 250,
    contentType: "number"
  },
  nationality: {
    canBeEdited: true,
    contentType: "text"
  },
  weight: {
    canBeEdited: true,
    maxValue: 300,
    contentType: "number"
  },
  sports: {
    canBeEdited: true,
    contentType: "array"
  },
  specialFeatures: {
    canBeEdited: true,
    contentType: "array"
  },
  musicGenres: {
    canBeEdited: true,
    contentType: "array"
  },
  gender: {
    canBeEdited: true,
    contentType: "enum"
  }
};
