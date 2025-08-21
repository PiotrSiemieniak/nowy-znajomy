import { Gender } from "./personal/gender";
import { MusicGenre } from "./personal/musicGenre";
import { SpecialFeatures } from "./personal/specialFeatures";
import { SportType } from "./personal/sports";

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