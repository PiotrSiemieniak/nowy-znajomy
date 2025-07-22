import { z } from "zod";
import { CHANNEL_TAGS_MIN_COUNT, CHANNEL_TAGS_MAX_COUNT, CHANNEL_NAME_MIN_LENGTH, CHANNEL_NAME_MAX_LENGTH } from "@/configs/channels";

export const initialStageSchema = z.object({
  channelType: z.enum(["thematic", "group"], {
    errorMap: () => ({ message: "Wybierz typ kanału." }),
  }),
  name: z
    .string()
    .min(CHANNEL_NAME_MIN_LENGTH, "Nazwa kanału musi mieć co najmniej 3 znaki.")
    .max(CHANNEL_NAME_MAX_LENGTH, "Nazwa kanału może mieć maksymalnie 32 znaki.")
    .regex(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ _-]+$/, "Nazwa kanału zawiera niedozwolone znaki."),
  description: z
    .string()
    .min(8, "Opis kanału musi mieć co najmniej 8 znaków.")
    .max(128, "Opis kanału może mieć maksymalnie 128 znaków."),
  tags: z
    .array(z.string().min(2, "Tag musi mieć co najmniej 2 znaki.").max(24, "Tag może mieć maksymalnie 24 znaki.").regex(/^[a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ _-]+$/, "Tag zawiera niedozwolone znaki."))
    .min(CHANNEL_TAGS_MIN_COUNT, `Podaj co najmniej ${CHANNEL_TAGS_MIN_COUNT} tagi.`)
    .max(CHANNEL_TAGS_MAX_COUNT, `Możesz podać maksymalnie ${CHANNEL_TAGS_MAX_COUNT} tagów.`),
});

export type InitialStageFormValues = z.infer<typeof initialStageSchema>;