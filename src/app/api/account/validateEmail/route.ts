import { NextRequest, NextResponse } from "next/server";
import { isEmailTaken } from "@/lib/services/queries/account";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { ok: false, code: "INVALID_EMAIL", message: "Nieprawidłowy adres e-mail" },
        { status: 400 }
      );
    }

    const taken = await isEmailTaken(email);

    if (taken) {
      return NextResponse.json(
        { ok: false, code: "EMAIL_TAKEN", message: "Adres e-mail jest już zajęty" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: true, code: "EMAIL_AVAILABLE", message: "Adres e-mail jest dostępny" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR", message: "Błąd serwera" },
      { status: 500 }
    );
  }
}
