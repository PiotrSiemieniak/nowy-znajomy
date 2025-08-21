import { AccountDetails } from "@/lib/globalTypes/accountDetails";
import { addDocumentToFirestore } from "../adapters/firebase/utils/queryFirestore";
import { queryFirestore } from "../adapters/firebase/utils/queryFirestore";
import { throwDebugMessage } from "../throwDebugMessage";

export async function createAccountDetails(details: AccountDetails): Promise<{ ok: boolean; code?: string; message?: string }> {
  const id = await addDocumentToFirestore("accountDetails", details, details.accountId);
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