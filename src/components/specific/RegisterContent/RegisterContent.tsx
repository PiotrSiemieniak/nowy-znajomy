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
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { validateUsername, registerAccount } from "@/lib/services/api/account";
import { Content } from "./partials/Content";
import { ConfirmAccountContent } from "../ConfirmAccountContent";
import { toast } from "sonner";
import { appNotification } from "@/components/ui/Sonner/appNotification";

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
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false);
  const [confirmedEmail, setConfirmedEmail] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
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

  const onSubmit = async (data: RegisterFormValues) => {
    setRegisterError(null);
    setRegisterSuccess(false);
    const res = await registerAccount({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    if (!res || !res.ok) {
      setRegisterError(res?.message || "Błąd rejestracji");
      setRegisterSuccess(false);
    } else {
      setRegisterSuccess(true);
      setRegisterError(null);
      setConfirmedEmail(data.email); // Zapisz email przed resetem
      setConfirmedPassword(data.password); // Zapisz hasło przed resetem
      form.reset();
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button size={"sm"} className="flex-1">
          Zarejestruj
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4 max-w-[90vw] w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left">Rejestracja</DialogTitle>
        </DialogHeader>
        {registerSuccess ? (
          <ConfirmAccountContent
            callback={() => setDialogOpen(false)}
            email={confirmedEmail}
            password={confirmedPassword}
          />
        ) : (
          <Content
            form={form}
            onSubmit={form.handleSubmit(onSubmit)}
            registerError={registerError}
            registerSuccess={registerSuccess}
            usernameError={usernameError}
            usernameAvailable={usernameAvailable}
            FIELDS={FIELDS}
            signIn={signIn}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
