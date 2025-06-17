import type { Filters } from "@/components/providers/ChatProvider/types";
import { createRoom, getRoom } from "@/lib/services/queries/room";
import { clearOldRecords, findUser, queueUser, isUserIn, isUserMatched } from "@/lib/services/queries/waitingRoom";

export enum WaitingRoomStatuses {
  matched = 'matched',
  waiting = 'waiting'
}

export type WaitingRoomReq = {
  sessionKey: string;
  filters: Filters;
}
export type WaitingRoomRes = Promise<{
  status: WaitingRoomStatuses | number;
  roomId?: string
}>

export async function POST(req: Request): WaitingRoomRes {
  try {
    const body = (await req.json()) as WaitingRoomReq;
    const { sessionKey, filters } = body;
    
    // Sprawdzenie czy sessionKey istnieje
    if (!sessionKey) {
      return Response.json(
        { error: "Brak sessionKey" }, 
        { status: 400 }
      );
    }

    await clearOldRecords();
    
    // Sprawdzenie czy użytkownik już jest w poczekalni
    const isMatched = await isUserMatched(sessionKey);
    
    if (isMatched) {
      const roomId = await getRoom({ sessionKey })
      
      return Response.json({ status: WaitingRoomStatuses.matched, roomId });
    }
    
    // Nowy użytkownik - najpierw szukamy dopasowania
    const match = await findUser(sessionKey, filters);
    
    if (match) {
      // Znaleźliśmy natychmiastowe dopasowanie
      // Nadpisujemy jako 'matched' naszych userów
      await queueUser(sessionKey, filters, true);
      await queueUser(match.sessionKey, filters, true);

      // Tworzymy pokój
      const roomId = await createRoom({
        userIds: [null, null],
        userSessionKeys: [sessionKey, match.sessionKey]
      })

      return Response.json({ 
        status: WaitingRoomStatuses.matched, 
        roomId
      });
    }
    
    // Brak dopasowania - dodajemy do poczekalni
    const queueSuccess = await queueUser(sessionKey, filters);
    
    if (queueSuccess) {
      return Response.json({ status: WaitingRoomStatuses.waiting });
    } else {
      return Response.json(
        { error: "Nie udało się dodać do poczekalni" }, 
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Błąd w API waiting-room:', error);
    return Response.json(
      { error: "Wewnętrzny błąd serwera" }, 
      { status: 500 }
    );
  }
}
