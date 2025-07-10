import { NextRequest, NextResponse } from "next/server";
import { checkLimiter } from "@/lib/services/checkLimiter";
import { confirmAccountByCode } from "@/lib/services/queries/account";

// POST /api/account/confirmRegistration
export async function POST(req: NextRequest) {
  checkLimiter({ req });

  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ ok: false, code: "INVALID_INPUT", message: "Brak wymaganych danych" }, { status: 400 });
    }
    const result = await confirmAccountByCode(email, code);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Error /account/confirmRegistration", error);
    return NextResponse.json({ ok: false, code: "SERVER_ERROR", message: "Błąd serwera" }, { status: 500 });
  }
}