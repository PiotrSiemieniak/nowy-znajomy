import { apiFetch } from "../apiFetch";
import bcrypt from "bcryptjs"

type ValidateUsernameRes = {
  ok: boolean;
  code?: string;
  message?: string;
};

async function validateUsername(username: string): Promise<ValidateUsernameRes | null> {
  try {
    const res = await apiFetch<{ username: string }, ValidateUsernameRes>(
      "/account/validateUsername",
      { method: "POST" },
      { username }
    );
    return res;
  } catch (err) {
    console.error(err)
    return null;
  }
}

// Dodaj funkcję do rejestracji konta
type RegisterAccountRes = {
  ok: boolean;
  code?: string;
  message?: string;
};

type RegisterAccountPayload = {
  username: string;
  email: string;
  password: string;
};

async function registerAccount(payload: RegisterAccountPayload): Promise<RegisterAccountRes | null> {
  if (!payload.password) return null;

  const payloadToSend = {
    ...payload,
    confirmPassword: undefined, // nie wysyłaj confirmPassword do backendu
  };

  const res = await apiFetch<RegisterAccountPayload, RegisterAccountRes>(
    "/account/create",
    { method: "POST" },
    payloadToSend
  );
  return res;
}

export { validateUsername, registerAccount };

export async function confirmAccount({ email, code }: { email: string; code: string }) {
  if (!email || !code) {
    return {
      ok: false,
      code: "MISSING_PARAMS",
      message: "Brak wymaganych parametrów",
    };
  }

  return apiFetch("/account/confirmRegistration", {
    method: "POST",
  }, { email, code });
}
