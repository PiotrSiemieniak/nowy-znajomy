import { apiFetch } from "../apiFetch";
import type { AccountDetails } from "@/lib/globalTypes/accountDetails";

// Keys allowed by the route: all AccountDetails keys except accountId
export type AccountDetailsFieldKey = keyof Omit<AccountDetails, "accountId">;

type FieldSuccess = { ok: true; data: Record<string, unknown> };
type FieldError = { ok: false; error: string };
type FieldResponse = FieldSuccess | FieldError;

// Fetch currently authenticated user's AccountDetails single field
export async function getMyAccountDetailField<K extends AccountDetailsFieldKey>(
  field: K
): Promise<AccountDetails[K] | null> {
  try {
    const url = `/accountDetails/getDetail?field=${encodeURIComponent(field as string)}`;
    const res = await apiFetch<undefined, FieldResponse>(url, { method: "GET" });

    if (!res || ("ok" in res && res.ok !== true)) return null;
    if (!("data" in res)) return null;
    const data = res.data as Record<string, unknown>;

    const value = data[field as string] as AccountDetails[K] | undefined;
    return value === undefined ? null : (value as AccountDetails[K]);
  } catch (err) {
    console.error(err);
    return null;
  }
}