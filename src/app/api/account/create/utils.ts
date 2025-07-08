import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from "@/configs/accountRegister";

type ValidationErrorBody = {
  ok: false;
  code: "USERNAME_LENGTH" | "EMAIL_LENGTH" | "PASSWORD_LENGTH";
  message: string;
};
type ValidationResult = { body: ValidationErrorBody; status: number } | null;

export function validateAccountFields({
  username,
  email,
  password
}: {
  username: string;
  email: string;
  password: string;
}): ValidationResult {
  if (
    typeof username !== "string" ||
    username.length < USERNAME_MIN_LENGTH ||
    username.length > USERNAME_MAX_LENGTH
  ) {
    return {
      body: {
        ok: false,
        code: "USERNAME_LENGTH",
        message: `Nazwa użytkownika musi mieć od ${USERNAME_MIN_LENGTH} do ${USERNAME_MAX_LENGTH} znaków.`
      },
      status: 400
    };
  }
  if (
    typeof email !== "string" ||
    email.length < EMAIL_MIN_LENGTH ||
    email.length > EMAIL_MAX_LENGTH
  ) {
    return {
      body: {
        ok: false,
        code: "EMAIL_LENGTH",
        message: `Adres e-mail musi mieć od ${EMAIL_MIN_LENGTH} do ${EMAIL_MAX_LENGTH} znaków.`
      },
      status: 400
    };
  }
  if (
    typeof password !== "string" ||
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    return {
      body: {
        ok: false,
        code: "PASSWORD_LENGTH",
        message: `Hasło musi mieć od ${PASSWORD_MIN_LENGTH} do ${PASSWORD_MAX_LENGTH} znaków.`
      },
      status: 400
    };
  }
  return null;
}
