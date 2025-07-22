import { NextRequest, NextResponse } from "next/server";
import { validateChannelName } from "../utils";
import { isChannelNameTaken } from "@/lib/services/queries/channel";
import { CHANNEL_TAGS_MIN_COUNT, CHANNEL_TAGS_MAX_COUNT } from "@/configs/channels";
import { checkLimiter } from "@/lib/services/checkLimiter";

export async function POST(req: NextRequest) {
  checkLimiter({ req });

  try {
    let name = "";
    let description = "";
    let tags: string[] = [];
    try {
      const body = await req.json();
      name = body?.name ?? "";
      description = body?.description ?? "";
      tags = body?.tags ?? [];
    } catch {
      return NextResponse.json({ ok: false, code: "INVALID_PAYLOAD", message: "Nieprawidłowe dane wejściowe" }, { status: 400 });
    }

    // Walidacja nazwy kanału
    const nameError = validateChannelName(name);
    if (nameError) {
      return NextResponse.json({ ok: false, code: "INVALID_NAME", message: nameError }, { status: 400 });
    }

    // Unikalność nazwy
    const nameLower = name.trim().toLowerCase();
    const taken = await isChannelNameTaken(nameLower);
    if (taken) {
      return NextResponse.json({ ok: false, code: "NAME_TAKEN", message: "Nazwa kanału jest już zajęta" }, { status: 409 });
    }

    // Walidacja opisu (można dodać regex na emoji, jeśli wymagane)
    if (!description || description.trim().length < 5 || description.trim().length > 256) {
      return NextResponse.json({ ok: false, code: "INVALID_DESCRIPTION", message: "Opis kanału musi mieć 5-256 znaków" }, { status: 400 });
    }

    // Walidacja tagów
    if (!Array.isArray(tags) || tags.length < CHANNEL_TAGS_MIN_COUNT || tags.length > CHANNEL_TAGS_MAX_COUNT) {
      return NextResponse.json({ ok: false, code: "INVALID_TAGS", message: `Kanał musi mieć od ${CHANNEL_TAGS_MIN_COUNT} do ${CHANNEL_TAGS_MAX_COUNT} tagów` }, { status: 400 });
    }
    return NextResponse.json({ ok: true, code: "VALID" });
  } catch (err) {
    console.error("Error in /api/channel/verifyInitialStage", err);
    return NextResponse.json({ ok: false, code: "SERVER_ERROR", message: "Błąd serwera" }, { status: 500 });
  }
}
