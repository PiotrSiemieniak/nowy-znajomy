import { Button } from "@/components/ui/Button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label/Label";
import { DiscordLogoIcon } from "@radix-ui/react-icons";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { validateUsername, registerAccount } from "@/lib/services/api/account";

const REGISTER_SCHEMA = z
  .object({
    username: z
      .string()
      .min(3, "Podaj nazwę użytkownika")
      .max(20, "Nazwa użytkownika może mieć maksymalnie 20 znaków"),
    email: z.string().email("Podaj poprawny adres e-mail"),
    password: z.string().min(6, "Podaj hasło (min. 6 znaków)"),
    confirmPassword: z.string().min(6, "Powtórz hasło"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same",
    path: ["confirmPassword"],
  });

const FIELDS = [
  {
    name: "username",
    label: "Nazwa użytkownika",
    type: "text",
    autoComplete: "username",
    clearable: true,
  },
  {
    name: "email",
    label: "Adres e-mail",
    type: "email",
    autoComplete: "email",
    clearable: true,
  },
  {
    name: "password",
    label: "Hasło",
    type: "password",
    autoComplete: "new-password",
    showPasswordToggle: true,
  },
  {
    name: "confirmPassword",
    label: "Powtórz hasło",
    type: "password",
    autoComplete: "new-password",
    showPasswordToggle: true,
  },
];

type RegisterFormValues = z.infer<typeof REGISTER_SCHEMA>;

export function RegisterContent() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(REGISTER_SCHEMA),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  // Stan na komunikat z backendu dla username
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);
  const usernameValue = form.watch("username");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setUsernameError(null);
    setUsernameAvailable(false);
    if (!usernameValue || form.formState.errors.username) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const res = await validateUsername(usernameValue);
        if (res && !res.ok) {
          setUsernameError(res.code || "UNKNOWN_ERROR");
          setUsernameAvailable(false);
          form.setError("username", { type: "manual", message: res.code });
        } else {
          setUsernameError(null);
          setUsernameAvailable(true);
          form.clearErrors("username");
        }
      } catch {
        setUsernameError("NETWORK_ERROR");
        setUsernameAvailable(false);
        form.setError("username", { type: "manual", message: "NETWORK_ERROR" });
      }
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usernameValue]);

  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);

  const onSubmit = async (data: RegisterFormValues) => {
    setRegisterError(null);
    setRegisterSuccess(false);
    const res = await registerAccount({
      username: data.username,
      email: data.email,
      password: data.password,
    });
    console.log("res", res);
    if (!res || !res.ok) {
      setRegisterError(res?.message || "Błąd rejestracji");
      setRegisterSuccess(false);
    } else {
      setRegisterSuccess(true);
      setRegisterError(null);
      form.reset();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} className="flex-1">
          Zarejestruj
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 max-w-[90vw] w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left">Rejestracja</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-0">
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
                {form.formState.errors[
                  field.name as keyof RegisterFormValues
                ] && (
                  <p className="text-xs text-destructive">
                    {
                      form.formState.errors[
                        field.name as keyof RegisterFormValues
                      ]?.message as string
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
            <p className="text-muted-foreground text-xs my-auto">
              lub za pomocą
            </p>
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
      </DialogContent>
    </Dialog>
  );
}
