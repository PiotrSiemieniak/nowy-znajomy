import { NextRequest } from "next/server";
import { deleteRoom } from "@/lib/services/queries/room";

export async function POST(req: NextRequest) {
  try {
    const { sessionKey, roomId } = await req.json();

    if (!sessionKey || !roomId) {
      return Response.json({ error: "Brak wymaganych danych" }, { status: 400 });
    }

    await deleteRoom({ sessionKey, roomId });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Błąd w API room (delete):', error);
    return Response.json(
      { error: "Wewnętrzny błąd serwera" }, 
      { status: 500 }
    );
  }
}

export const revalidate = 0;