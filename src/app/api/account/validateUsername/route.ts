import { NextRequest, NextResponse } from "next/server";
import { isUsernameTaken } from "@/lib/services/queries/account";
import { checkLimiter } from "@/lib/services/checkLimiter";

export async function POST(req: NextRequest) {
  checkLimiter({ req })

  try {
    const { username } = await req.json();

    if (!username || typeof username !== "string" || username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { ok: false, code: "INVALID_USERNAME", message: "Nieprawidłowa nazwa użytkownika" },
        { status: 400 }
      );
    }

    const taken = await isUsernameTaken(username);

    if (taken) {
      return NextResponse.json(
        { ok: false, code: "USERNAME_TAKEN", message: "Nazwa użytkownika jest już zajęta" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { ok: true, code: "USERNAME_AVAILABLE", message: "Nazwa użytkownika jest dostępna" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, code: "SERVER_ERROR", message: "Błąd serwera" },
      { status: 500 }
    );
  }
}
