export enum ChannelType {
  REGIONAL = "regional",
  THEMATIC = "thematic",
  GROUP = "group",
}

export type ChannelSettings = {
  maxUsers?: number;         // Maksymalna liczba osób w kanale (opcjonalnie)
  isAdultOnly?: boolean;     // Kanał +18
  isModerated?: boolean;     // Czy kanał ma moderatora
  [key: string]: any;        // Inne przyszłe ustawienia
};

export type ChannelDetails = {
  createdAt: string;                 // ISO
  createdBy?: string;                // UID twórcy (dla tematycznych/grupowych)
  isStatic: boolean;                 // true dla regionalnych, false dla innych
  lastActivityAt?: string;           // ISO, do czyszczenia nieużywanych
  usersOnline?: string[];            // lista UID aktywnych użytkowników (opcjonalnie)
  isPrivate?: boolean;               // czy kanał jest prywatny
  stats?: {
    peakUsers?: number;              // Największa liczba użytkowników w historii
    trend?: "rising" | "falling" | "stable"; // Trend zainteresowania
    lastStatsUpdate?: string;        // ISO, kiedy ostatnio aktualizowano statystyki
  };
  invitedUsers?: string[];           // UID zaproszonych użytkowników (jeśli prywatny)
}

export type Channel = {
  id: string;                        // Firestore doc id lub własny
  name: string;                      // Nazwa kanału
  type: ChannelType;
  description?: string;              // Opcjonalny opis
  regionCode?: string;               // Np. "PL-DS" dla regionalnych
  isActive: boolean;                 // czy kanał jest aktywny (np. nie wygasł)
  estimatedUsers?: number;            // szacowana liczba użytkowników (np. z ostatnich 50 min)
  tags?: string[];                   // np. ["motoryzacja", "czat"]
  settings?: ChannelSettings;        // dodatkowe ustawienia
};