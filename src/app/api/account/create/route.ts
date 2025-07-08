import { NextRequest, NextResponse } from "next/server";
import { createAccount, createAccountDetails, deleteExpiredUnconfirmedAccounts, isEmailTaken, isUsernameTaken } from "@/lib/services/queries/account";
import { checkLimiter } from "@/lib/services/checkLimiter";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  EMAIL_MIN_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH
} from "@/configs/accountRegister";


export async function POST(req: NextRequest) {
  checkLimiter({
    req
  })

  try {
    // Usuń stare niezatwierdzone konta
    await deleteExpiredUnconfirmedAccounts();

    const { username, email, password } = await req.json();

    // Ograniczenie długości maila i hasła
    if (
      typeof username !== "string" ||
      username.length < USERNAME_MIN_LENGTH ||
      username.length > USERNAME_MAX_LENGTH
    ) {
      return NextResponse.json(
        { ok: false, code: "USERNAME_LENGTH", message: `Nazwa użytkownika musi mieć od ${USERNAME_MIN_LENGTH} do ${USERNAME_MAX_LENGTH} znaków.` },
        { status: 400 }
      );
    }
    if (
      typeof email !== "string" ||
      email.length < EMAIL_MIN_LENGTH ||
      email.length > EMAIL_MAX_LENGTH
    ) {
      return NextResponse.json(
        { ok: false, code: "EMAIL_LENGTH", message: `Adres e-mail musi mieć od ${EMAIL_MIN_LENGTH} do ${EMAIL_MAX_LENGTH} znaków.` },
        { status: 400 }
      );
    }
    if (
      typeof password !== "string" ||
      password.length < PASSWORD_MIN_LENGTH ||
      password.length > PASSWORD_MAX_LENGTH
    ) {
      return NextResponse.json(
        { ok: false, code: "PASSWORD_LENGTH", message: `Hasło musi mieć od ${PASSWORD_MIN_LENGTH} do ${PASSWORD_MAX_LENGTH} znaków.` },
        { status: 400 }
      );
    }

    // Sprawdzenie zajętości emaila i username
    if (await isEmailTaken(email)) {
      return NextResponse.json(
        { ok: false, code: "EMAIL_TAKEN", message: "Adres e-mail jest już zajęty" },
        { status: 400 }
      );
    }
    if (await isUsernameTaken(username)) {
      return NextResponse.json(
        { ok: false, code: "USERNAME_TAKEN", message: "Nazwa użytkownika jest już zajęta" },
        { status: 400 }
      );
    }

    // Sprawdzenie zgodności haseł
    if (!password) {
      return NextResponse.json(
        { ok: false, code: "PASSWORDS_NOT_EXISTS", message: "Brak hasła" },
        { status: 400 }
      );
    }

    // Tworzenie konta
    const result = await createAccount({ username, email, password });
    if (!result.ok || !result.id) {
      return NextResponse.json(result, { status: 400 });
    }

    // Tworzenie pustych szczegółów konta
    const detailsRes = await createAccountDetails({ accountId: result.id });
    if (!detailsRes.ok) {
      return NextResponse.json(detailsRes, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: result.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR", message: "Błąd serwera" },
      { status: 500 }
    );
  }
}
