import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  CollectionReference,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../../../../firebase";

/**
 * Uniwersalna funkcja do pobierania dokumentów z kolekcji Firestore
 * @param collectionName Nazwa kolekcji
 * @param options Opcjonalne opcje (id dokumentu lub query constraints)
 * @returns Dokument lub tablicę dokumentów
 */
type QueryOptions = {
  docId?: string;
  constraints?: QueryConstraint[];
};

export async function queryFirestore<T = DocumentData>(
  collectionName: string,
  options?: QueryOptions
): Promise<T | T[] | null> {
  try {
    const colRef = collection(db, collectionName);

    // Pobierz pojedynczy dokument, jeśli podano `docId`
    if (options?.docId) {
      const docRef = doc(colRef, options.docId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as T;
    }

    // Jeśli podano constraints (where, orderBy, itd.)
    const q = options?.constraints?.length
      ? query(colRef, ...options.constraints)
      : colRef;

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (err) {
    console.error("Błąd zapytania do Firestore:", err);
    return null;
  }
}

/**
 * Dodaje nowy dokument do kolekcji
 * @param collectionName Nazwa kolekcji
 * @param data Dane do dodania
 * @returns ID dodanego dokumentu lub null w przypadku błędu
 */
export async function addDocumentToFirestore<T = DocumentData>(
  collectionName: string,
  data: T,
  customId?: string // <--- dodaj opcjonalny ID
): Promise<string | null> {
  try {
    const docRef = customId
      ? doc(db, collectionName, customId)
      : doc(collection(db, collectionName)); // losowe ID

    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now(),
      lastTickAt: Timestamp.now()
    });

    console.log(`Dodano dokument o ID: ${docRef.id}`);
    return docRef.id;
  } catch (err) {
    console.error("Błąd podczas dodawania dokumentu:", err);
    return null;
  }
}

/**
 * Usuwa dokument z kolekcji
 * @param collectionName Nazwa kolekcji
 * @param docId ID dokumentu do usunięcia
 * @returns true jeśli usunięto pomyślnie, false w przypadku błędu
 */
export async function deleteDocumentFromFirestore(
  collectionName: string,
  docId: string
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    
    console.log(`Usunięto dokument o ID: ${docId}`);
    return true;
  } catch (err) {
    console.error("Błąd podczas usuwania dokumentu:", err);
    return false;
  }
}

/**
 * Usuwa wiele dokumentów na podstawie query
 * @param collectionName Nazwa kolekcji
 * @param constraints Warunki do filtrowania dokumentów
 * @returns Liczba usuniętych dokumentów
 */
export async function deleteMultipleDocuments(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<number> {
  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, ...constraints);
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return 0;
    }

    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log(`Usunięto ${snapshot.size} dokumentów`);
    return snapshot.size;
  } catch (err) {
    console.error("Błąd podczas usuwania wielu dokumentów:", err);
    return 0;
  }
}

/**
 * Aktualizuje dokument w kolekcji
 * @param collectionName Nazwa kolekcji
 * @param docId ID dokumentu do aktualizacji
 * @param data Dane do aktualizacji
 * @returns true jeśli zaktualizowano pomyślnie, false w przypadku błędu
 */
export async function updateDocumentInFirestore<T = DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      lastTickAt: Timestamp.now()
    });
    
    console.log(`Zaktualizowano dokument o ID: ${docId}`);
    return true;
  } catch (err) {
    console.error("Błąd podczas aktualizacji dokumentu:", err);
    return false;
  }
}