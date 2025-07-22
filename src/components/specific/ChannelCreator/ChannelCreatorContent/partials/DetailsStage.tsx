import { Badge } from "@/components/ui/Badge";
import { FormElement } from "@/components/ui/FormElement";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { ArrowLeft, UserRoundSearch, Users } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChannelType, ChannelSettings } from "@/lib/globalTypes/channel";
import { Separator } from "@/components/ui/Separator";
import { DialogClose, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

const isPremiumUser = false; // Zmień na true by przetestować wersję premium

const detailsStageSchema = z.object({
  maxUsers: z.union([
    z.string().regex(/^\d*$/, "Podaj liczbę lub zostaw puste").optional(),
    z.undefined(),
  ]),
  isAdultOnly: z.boolean(),
  isModerated: z.boolean(),
  showNicknames: z.boolean(),
  onlyLoggedIn: z.boolean(),
  timeoutBetweenMessages: z.union([
    z.string().regex(/^\d*$/, "Podaj liczbę lub zostaw puste").optional(),
    z.undefined(),
  ]),
});

type DetailsStageFormValues = z.infer<typeof detailsStageSchema>;

interface DetailsStageProps {
  form: ReturnType<typeof useForm<DetailsStageFormValues>>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  onPrevStage: () => void;
  name: string;
  description: string;
  channelType: string;
}

export function DetailsStage({
  form,
  onSubmit,
  name,
  description,
  channelType,
  onPrevStage,
}: DetailsStageProps) {
  const channelTypeIcon =
    channelType === "thematic" ? (
      <UserRoundSearch className="text-muted-foreground size-4 ml-1" />
    ) : (
      <Users className="text-muted-foreground size-4 ml-1" />
    );

  return (
    <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
      <div className="flex flex-col">
        <p className="text-xs text-muted-foreground inline-flex">
          Nowy kanał <b className="ml-1">{channelType}</b> {channelTypeIcon}
        </p>
        <p className="inline-flex font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Separator />
      <div className="space-y-4">
        <FormElement
          label="Maksymalna liczba użytkowników"
          desc="Wprowadź maksymalną liczbę użytkowników, którzy mogą dołączyć do kanału lub zostaw puste, jeśli chcesz, aby nie było limitu"
          errorLabel={form.formState.errors.maxUsers?.message}
        >
          <Input
            placeholder="Brak limitu"
            type="number"
            min={2}
            {...form.register("maxUsers")}
            clearable
          />
        </FormElement>
        <FormElement
          label="Tylko dla dorosłych"
          desc="Jeśli kanał ma być oznaczony jako +18, zaznacz tę opcję"
          errorLabel={form.formState.errors.isAdultOnly?.message}
        >
          <Controller
            control={form.control}
            name="isAdultOnly"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </FormElement>
        <FormElement
          label="Moderacja"
          desc="Zaznacz, jeśli kanał ma być moderowany przez głosowanie użytkowników"
          errorLabel={form.formState.errors.isModerated?.message}
        >
          <Controller
            control={form.control}
            name="isModerated"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </FormElement>
        <FormElement
          label="Odkrywanie nicków"
          desc="Zaznacz, jeśli nazwy użytkowników mają być widoczne"
          errorLabel={form.formState.errors.showNicknames?.message}
        >
          <Controller
            control={form.control}
            name="showNicknames"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </FormElement>
        <FormElement
          label="Tylko dla zalogowanych"
          desc="Zaznacz, jeśli tylko zalogowani użytkownicy mogą wysyłać wiadomości"
          errorLabel={form.formState.errors.onlyLoggedIn?.message}
        >
          <Controller
            control={form.control}
            name="onlyLoggedIn"
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </FormElement>
        <FormElement
          label="Odstęp czasu pomiędzy wiadomościami"
          desc="Odstęp czasu pomiędzy wiadomościami (w sekundach), jeśli chcesz ograniczyć spam. Puste pole oznacza brak ograniczeń."
          errorLabel={form.formState.errors.timeoutBetweenMessages?.message}
        >
          <Input
            placeholder="Brak przerwy czasowej pomiędzy wiadomościami"
            type="number"
            min={1}
            {...form.register("timeoutBetweenMessages")}
          />
        </FormElement>
      </div>
      <Separator />
      <DialogFooter className="flex flex-row justify-between items-center">
        <Button type="button" onClick={onPrevStage} variant={"ghost"}>
          <ArrowLeft />
          Cofnij
        </Button>
        <div className="flex gap-2">
          <DialogClose asChild>
            <Button type="button" variant={"ghost"}>
              Anuluj
            </Button>
          </DialogClose>
          <div className="flex flex-row justify-end">
            <Button type="submit">Utwórz kanał</Button>
          </div>
        </div>
      </DialogFooter>
    </form>
  );
}
