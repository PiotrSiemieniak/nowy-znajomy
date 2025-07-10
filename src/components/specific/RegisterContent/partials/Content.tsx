import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label/Label";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { DialogFooter, DialogClose } from "@/components/ui/Dialog";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterFormValues } from "../RegisterContent";

interface ContentProps {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  registerError: string | null;
  registerSuccess: boolean;
  usernameError: string | null;
  usernameAvailable: boolean;
  FIELDS: Array<any>;
  signIn: (provider: string) => void;
}

export function Content({
  form,
  onSubmit,
  registerError,
  registerSuccess,
  usernameError,
  usernameAvailable,
  FIELDS,
  signIn,
}: ContentProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 mb-0">
      {/* Komunikaty globalne */}
      {registerError && (
        <p className="text-xs text-destructive">{registerError}</p>
      )}
      {registerSuccess && (
        <p className="text-xs text-success">
          Konto utworzone! Sprawdź e-mail w celu potwierdzenia.
        </p>
      )}
      <div className="space-y-4">
        {FIELDS.map((field) => (
          <div className="space-y-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              {...field}
              {...form.register(field.name as keyof RegisterFormValues)}
            />
            {/* Komunikaty walidacji */}
            {form.formState.errors[field.name as keyof RegisterFormValues] && (
              <p className="text-xs text-destructive">
                {
                  form.formState.errors[field.name as keyof RegisterFormValues]
                    ?.message as string
                }
              </p>
            )}
            {/* Komunikat z backendu dla username */}
            {field.name === "username" && usernameError && (
              <p className="text-xs text-destructive">{usernameError}</p>
            )}
            {/* Komunikat o dostępności nazwy użytkownika */}
            {field.name === "username" &&
              !usernameError &&
              usernameAvailable && (
                <p className="text-xs text-success">
                  Nazwa użytkownika jest dostępna
                </p>
              )}
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <div className="h-px flex-1 bg-muted my-auto" />
        <p className="text-muted-foreground text-xs my-auto">lub za pomocą</p>
        <div className="h-px flex-1 bg-muted my-auto" />
      </div>
      <div className="flex justify-center gap-4">
        <Button
          size={"icon"}
          variant={"outline"}
          type="button"
          onClick={() => signIn("discord")}
        >
          <DiscordLogoIcon />
        </Button>
      </div>
      <DialogFooter className="flex flex-row justify-end mb-0">
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Anuluj
          </Button>
        </DialogClose>
        <Button type="submit">Utwórz konto</Button>
      </DialogFooter>
    </form>
  );
}
