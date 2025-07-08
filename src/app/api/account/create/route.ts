import { NextRequest, NextResponse } from "next/server";
import { createAccount, createAccountDetails, deleteExpiredUnconfirmedAccounts, isEmailTaken, isUsernameTaken } from "@/lib/services/queries/account";
import { checkLimiter } from "@/lib/services/checkLimiter";
import { validateAccountFields } from "./utils";

export async function POST(req: NextRequest) {
  checkLimiter({
    req
  })

  try {
    // Usuń stare niezatwierdzone konta
    // TODO: utworzyć api cron jobs i przenieść ten szit do cronów
    await deleteExpiredUnconfirmedAccounts();

    const { username, email, password } = await req.json();

    // Walidacja długości pól
    const validationError = validateAccountFields({ username, email, password });
    if (validationError) {
      return NextResponse.json(validationError.body, { status: validationError.status });
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
