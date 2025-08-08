import type { TradeDataPopoverOpen } from "@/components/providers/ChatProvider/types";

type TradeDataPopoverOpenAsKeys = Record<
  Exclude<TradeDataPopoverOpen, null>,
  string
>;
export const LABEL_TRANSLATIONS: TradeDataPopoverOpenAsKeys = {
  username: "Nazwa użytkownika",
  accountId: "Identyfikator konta",
  birthDate: "Data urodzenia",
  firstName: "Imię",
  lastName: "Nazwisko",
  height: "Wzrost",
  nationality: "Narodowość",
  weight: "Waga",
  sports: "Sporty",
  specialFeatures: "Cechy szczególne",
  musicGenres: "Gatunki muzyczne",
  gender: "Płeć",
};