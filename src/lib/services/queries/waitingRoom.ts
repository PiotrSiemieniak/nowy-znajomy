import { Timestamp, where, orderBy } from 'firebase/firestore';
import { 
  queryFirestore, 
  addDocumentToFirestore, 
  deleteDocumentFromFirestore,
  deleteMultipleDocuments 
} from '../adapters/firebase/utils/queryFirestore'
import type { Filters } from "@/components/providers/ChatProvider/types";
import { Gender } from "@/lib/globalTypes/personal/gender";

const WAITING_ROOM_COLLECTION = 'waitingRoom';
const WAITING_ROOM_EXPIRATION_MS = 5 * 60 * 1000; // 5 minut

export type WaitingUser = {
  id?: string;
  sessionKey: string;
  filters: Filters;
  createdAt: Timestamp;
  lastTickAt: Timestamp;
  isMatched: boolean;
}

// Usuwa stare rekordy z poczekalni
async function clearOldRecords() {
  try {
    const now = Timestamp.now();
    const expirationTime = new Timestamp(
      now.seconds - Math.floor(WAITING_ROOM_EXPIRATION_MS / 1000), 
      now.nanoseconds
    );

    const deletedCount = await deleteMultipleDocuments(
      WAITING_ROOM_COLLECTION,
      [where('lastTickAt', '<', expirationTime)]
    );

    console.log(`Usunięto ${deletedCount} wygasłych rekordów`);
  } catch (error) {
    console.error('Błąd podczas czyszczenia starych rekordów:', error);
  }
}

// Sprawdza czy użytkownik jest już w poczekalni
async function isUserIn(sessionKey: string): Promise<boolean> {
  try {
    const users = await queryFirestore<WaitingUser>(
      WAITING_ROOM_COLLECTION,
      {
        constraints: [where('sessionKey', '==', sessionKey)]
      }
    );
    
    return Array.isArray(users) && users.length > 0;
  } catch (error) {
    console.error('Błąd podczas sprawdzania użytkownika:', error);
    return false;
  }
}

// Sprawdza czy użytkownik jest już połączony
async function isUserMatched(sessionKey: string): Promise<boolean> {
  try {
    const users = await queryFirestore<WaitingUser>(
      WAITING_ROOM_COLLECTION,
      {
        constraints: [
          where('sessionKey', '==', sessionKey), 
          orderBy('createdAt', 'asc')
        ]
      }
    );
    const isMatched = Array.isArray(users) && users.length > 0 ? Boolean(users[0].isMatched) : false;
    
    return isMatched
  } catch (error) {
    console.error('Błąd podczas sprawdzania użytkownika:', error);
    return false;
  }
}

// Znajduje dopasowanego użytkownika na podstawie preferencji
async function findUser(sessionKey: string, userFilters: Filters): Promise<WaitingUser | null> {
  try {
    const allUsers = await queryFirestore<WaitingUser>(
      WAITING_ROOM_COLLECTION,
      {
        constraints: [
          where('isMatched', '==', false),
          orderBy('createdAt', 'asc')
        ]
      }
    );

    if (!Array.isArray(allUsers) || allUsers.length === 0) {
      return null;
    }

    let bestMatch: WaitingUser | null = null;
    let bestScore = 0;
    
    for (const waitingUser of allUsers) {
      // Pomijamy siebie
      if (waitingUser.sessionKey === sessionKey) continue;
      
      // Sprawdzamy wzajemne dopasowanie
      const scoreAtoB = calculateMatchScore(userFilters, waitingUser.filters);
      const scoreBtoA = calculateMatchScore(waitingUser.filters, userFilters);
      
      // Wymagamy wzajemnego dopasowania (obie strony muszą pasować)
      if (scoreAtoB > 0 && scoreBtoA > 0) {
        const totalScore = scoreAtoB + scoreBtoA;
        
        if (totalScore > bestScore) {
          bestMatch = waitingUser;
          bestScore = totalScore;
        }
      }
    }
    
    // TODO: powinno zmieniać im status
    // Po znalezieniu dopasowania, usuń użytkownika z poczekalni
    // if (bestMatch && bestMatch.id) {
    //   const deleteSuccess = await deleteDocumentFromFirestore(
    //     WAITING_ROOM_COLLECTION, 
    //     bestMatch.id
    //   );
      
    //   if (!deleteSuccess) {
    //     console.error('Nie udało się usunąć dopasowanego użytkownika z poczekalni');
    //   }
    // }
    
    return bestMatch;
  } catch (error) {
    console.error('Błąd podczas szukania użytkownika:', error);
    return null;
  }
}

// Dodaje użytkownika do poczekalni
async function queueUser(sessionKey: string, filters: Filters, isMatched: boolean = false): Promise<boolean> {
  try {
    const docId = await addDocumentToFirestore(WAITING_ROOM_COLLECTION, {
      sessionKey,
      isMatched,
      filters,
    }, sessionKey);
    
    if (docId) {
      console.log('Użytkownik dodany do poczekalni z ID:', docId);
      return true;
    }
    console.log('queue', docId)
    return false;
  } catch (error) {
    console.error('Błąd podczas dodawania do poczekalni:', error);
    return false;
  }
}

// Usuwa użytkownika z poczekalni na podstawie sessionKey
async function removeUserFromWaitingRoom(sessionKey: string): Promise<boolean> {
  try {
    const users = await queryFirestore<WaitingUser>(
      WAITING_ROOM_COLLECTION,
      {
        constraints: [where('sessionKey', '==', sessionKey)]
      }
    );
    if (!users || users.length === 0) return false;
    // Usuwamy wszystkie rekordy z tym sessionKey (na wszelki wypadek)
    let allDeleted = true;
    for (const user of users) {
      if (user.id) {
        const deleted = await deleteDocumentFromFirestore(WAITING_ROOM_COLLECTION, user.id);
        if (!deleted) allDeleted = false;
      }
    }
    return allDeleted;
  } catch (error) {
    console.error('Błąd podczas usuwania użytkownika z poczekalni:', error);
    return false;
  }
}

// Oblicza punkty dopasowania między dwoma zestawami filtrów
function calculateMatchScore(filters1: Filters, filters2: Filters): number {
  let score = 0;
  
  // Dopasowanie wieku - sprawdzamy czy zakresy się pokrywają
  const [minAge1, maxAge1] = filters1.ageRange;
  const [minAge2, maxAge2] = filters2.ageRange;
  
  if (!(maxAge1 < minAge2 || maxAge2 < minAge1)) {
    // Zakresy się pokrywają
    score += 2;
    
    // Bonus za większe pokrycie
    const overlapStart = Math.max(minAge1, minAge2);
    const overlapEnd = Math.min(maxAge1, maxAge2);
    const overlapSize = overlapEnd - overlapStart;
    score += Math.floor(overlapSize / 5); // +1 punkt za każde 5 lat pokrycia
  }
  
  // Dopasowanie płci - obsługa enum Gender
  const gendersMatch = 
    filters1.gender === Gender.undefined || 
    filters2.gender === Gender.undefined || 
    filters1.gender === filters2.gender;
    
  if (gendersMatch) {
    score += 3; // Płeć jest ważna, więcej punktów
  }
  
  // Dopasowanie wzrostu
  const [minHeight1, maxHeight1] = filters1.heightRange;
  const [minHeight2, maxHeight2] = filters2.heightRange;
  
  if (!(maxHeight1 < minHeight2 || maxHeight2 < minHeight1)) {
    score += 1;
    
    // Bonus za większe pokrycie wzrostu
    const heightOverlap = Math.min(maxHeight1, maxHeight2) - Math.max(minHeight1, minHeight2);
    score += Math.floor(heightOverlap / 10); // +1 punkt za każde 10cm pokrycia
  }
  
  // Dopasowanie wagi
  const [minWeight1, maxWeight1] = filters1.weightRange;
  const [minWeight2, maxWeight2] = filters2.weightRange;
  
  if (!(maxWeight1 < minWeight2 || maxWeight2 < minWeight1)) {
    score += 1;
    
    // Bonus za większe pokrycie wagi
    const weightOverlap = Math.min(maxWeight1, maxWeight2) - Math.max(minWeight1, minWeight2);
    score += Math.floor(weightOverlap / 10); // +1 punkt za każde 10kg pokrycia
  }
  
  return score;
}

export {
  isUserMatched,
  clearOldRecords,
  isUserIn, 
  findUser,
  queueUser,
  removeUserFromWaitingRoom,
}