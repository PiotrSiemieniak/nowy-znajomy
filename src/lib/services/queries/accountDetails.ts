import { AccountDetails } from "@/lib/globalTypes/accountDetails";
import { addDocumentToFirestore } from "../adapters/firebase/utils/queryFirestore";
import { queryFirestore } from "../adapters/firebase/utils/queryFirestore";
import { throwDebugMessage } from "../throwDebugMessage";

export async function createAccountDetails(details: AccountDetails): Promise<{ ok: boolean; code?: string; message?: string }> {
  // Usuń pola z undefined przed wysłaniem do Firestore
  const cleanedDetails = Object.fromEntries(
    Object.entries(details).filter(([, value]) => value !== undefined)
  ) as AccountDetails;
  
  const id = await addDocumentToFirestore("accountDetails", cleanedDetails, details.accountId);
  if (!id) {
    return { ok: false, code: "CREATE_DETAILS_FAILED", message: "Nie udało się utworzyć szczegółów konta" };
  }
  return { ok: true };
}

// Pobiera szczegóły konta po accountId (które jest równocześnie docId w kolekcji accountDetails)
export async function getAccountDetails(accountId: string): Promise<AccountDetails | null> {
  if (!accountId) {
    throwDebugMessage("getAccountDetails: accountId is required", accountId, { isError: true });
    return null;
  }
  const docs = await queryFirestore<AccountDetails>("accountDetails", { docId: accountId });
  if (!docs || docs.length === 0) return null;
  return docs[0];
}

export async function getAccountDetailsField<T extends keyof Omit<AccountDetails, 'accountId'>>(
  accountId: string,
  field: T
): Promise<AccountDetails[T] | null> {
  const all = await getAccountDetails(accountId);
  if (!all) return null;
  return all[field] ?? null;
}

// Aktualizuje pojedyncze pole szczegółów konta
export async function updateAccountDetailsField<T extends keyof Omit<AccountDetails, 'accountId'>>(
  accountId: string,
  field: T,
  value: AccountDetails[T]
): Promise<{ ok: boolean; code?: string; message?: string }> {
  if (!accountId) {
    throwDebugMessage("updateAccountDetailsField: accountId is required", accountId, { isError: true });
    return { ok: false, code: "ACCOUNT_ID_REQUIRED", message: "ID konta jest wymagane" };
  }

  if (!field) {
    throwDebugMessage("updateAccountDetailsField: field is required", field, { isError: true });
    return { ok: false, code: "FIELD_REQUIRED", message: "Pole do aktualizacji jest wymagane" };
  }

  try {
    // Najpierw sprawdź czy dokument istnieje
    const existingDetails = await getAccountDetails(accountId);
    
    if (!existingDetails) {
      // Jeśli nie istnieje, utwórz nowy dokument z tylko tym polem
      const newDetails: AccountDetails = {
        accountId,
        [field]: value
      } as AccountDetails;

      const createResult = await createAccountDetails(newDetails);
      return createResult;
    }

    // Dokument istnieje, aktualizuj tylko to pole
    const updatedDetails = {
      ...existingDetails,
      [field]: value
    };

    // Usuń pola z undefined przed wysłaniem do Firestore
    const cleanedUpdatedDetails = Object.fromEntries(
      Object.entries(updatedDetails).filter(([, value]) => value !== undefined)
    ) as AccountDetails;

    const updateResult = await addDocumentToFirestore("accountDetails", cleanedUpdatedDetails, accountId);
    
    if (!updateResult) {
      return { ok: false, code: "UPDATE_FAILED", message: "Nie udało się zaktualizować pola" };
    }

    return { ok: true };

  } catch (error) {
    throwDebugMessage("updateAccountDetailsField: Update failed", error, { isError: true });
    return { ok: false, code: "UPDATE_ERROR", message: "Wystąpił błąd podczas aktualizacji" };
  }
}