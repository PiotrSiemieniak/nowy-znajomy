import { Gender } from "./personal/gender";
import { MusicGenre } from "./personal/musicGenre";
import { SpecialFeatures } from "./personal/specialFeatures";
import { SportType } from "./personal/sports";

export type UserAccount = {
  username: string;
  usernameLower?: string;
  email: string;
  password: string;
  confirmation: {
    isConfirmed: boolean;
    confirmationSlug: string;
    confirmationCode: string;
    expireAt: string; // data do kiedy można potwierdzić konto (ISO)
  };
};

export type AccountDetails = {
  accountId: string;
  birthDate?: string;
  firstName?: string;
  lastName?: string;
  height?: number;
  nationality?: string;
  weight?: number;
  sports?: SportType[];
  specialFeatures?: SpecialFeatures[];
  musicGenres?: MusicGenre[];
  gender?: Gender;
};