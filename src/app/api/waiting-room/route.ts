import type { Filters } from "@/components/providers/ChatProvider/types";
import { createRoom } from "@/lib/services/queries/room";
import { clearOldRecords, findUser, queueUser, isUserIn } from "@/lib/services/queries/waitingRoom";

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
    const userInLobby = await isUserIn(sessionKey);
    
    if (userInLobby) {
      // Użytkownik już czeka, sprawdzamy czy znaleźliśmy mu kogoś
      const match = await findUser(sessionKey, filters);
      console.log('match', match)
      
      if (match) {
        const roomId = await createRoom({ userSessionKeys: [{
          id: 'null',
          sessionKey: sessionKey
        }, {
          id: 'null',
          sessionKey: match.sessionKey
        }] })

        return Response.json({ 
          status: WaitingRoomStatuses.matched, 
          roomId
        });
      }
      
      return Response.json({ status: WaitingRoomStatuses.waiting });
    }
    
    // Nowy użytkownik - najpierw szukamy dopasowania
    const match = await findUser(sessionKey, filters);
    
    if (match) {
      // Znaleźliśmy natychmiastowe dopasowanie
      const roomId = await createRoom({ userSessionKeys: [{
        id: 'null', // TODO: user id
        sessionKey: sessionKey
      }, {
        id: 'null', // TODO: user id
        sessionKey: match.sessionKey
      }] })

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