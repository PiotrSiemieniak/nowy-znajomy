import { addDocumentToFirestore, deleteDocumentFromFirestore, queryFirestore, updateDocumentInFirestore } from "@/lib/services/adapters/firebase/utils/queryFirestore";
import { where } from "firebase/firestore";
import { getUUID } from "@/lib/crypto/getUUID";
import bcrypt from "bcryptjs";
import { AccountDetails, UserAccount } from "@/lib/globalTypes/account";

const COLLECTION = "accounts";

// Ile dni ważne jest potwierdzenie konta
export const CONFIRMATION_EXPIRATION_DAYS = 7;
export const getConfirmationExpireDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + CONFIRMATION_EXPIRATION_DAYS);
  return date.toISOString();
};

export type CreateAccountResult = { ok: boolean; code?: string; message?: string; id?: string; confirmationSlug?: string; confirmationCode?: string };

// Sprawdza, czy email jest już zajęty (case-insensitive)
export async function isEmailTaken(email: string): Promise<boolean> {
  const emailLower = email.trim().toLowerCase();
  const users = await queryFirestore(COLLECTION, {
    constraints: [where("email", "==", emailLower)]
  });

  return !!(users && users.length > 0);
}

// Sprawdza, czy nazwa użytkownika jest już zajęta (case-insensitive, username zawsze lowercase)
export async function isUsernameTaken(username: string): Promise<boolean> {
  const usernameLower = username.trim().toLowerCase();
  const users = await queryFirestore(COLLECTION, {
    constraints: [where("usernameLower", "==", usernameLower)]
  });

  return !!(users && users.length > 0);
}

// Tworzy konto użytkownika w Firestore
export async function createAccount(data: {
  username: string;
  email: string;
  password: string;
}): Promise<CreateAccountResult> {
  // Walidacja pól
  if (!data.username || typeof data.username !== "string" || data.username.length < 3 || data.username.length > 20) {
    return { ok: false, code: "INVALID_USERNAME", message: "Nieprawidłowa nazwa użytkownika" };
  }
  if (!data.email || typeof data.email !== "string" || !/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) {
    return { ok: false, code: "INVALID_EMAIL", message: "Nieprawidłowy adres e-mail" };
  }
  if (!data.password || typeof data.password !== "string" || data.password.length < 6) {
    return { ok: false, code: "INVALID_PASSWORD", message: "Nieprawidłowe hasło" };
  }

  // Sprawdzenie zajętości emaila i username
  if (await isEmailTaken(data.email)) {
    return { ok: false, code: "EMAIL_TAKEN", message: "Adres e-mail jest już zajęty" };
  }
  if (await isUsernameTaken(data.username)) {
    return { ok: false, code: "USERNAME_TAKEN", message: "Nazwa użytkownika jest już zajęta" };
  }

  // Tworzenie obiektu użytkownika
  const confirmationSlug = getUUID();
  const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-cyfrowy kod
  const expireAt = getConfirmationExpireDate();
  const email = data.email.trim().toLowerCase()

  const user: UserAccount = {
    username: data.username.trim(),
    usernameLower: data.username.trim().toLowerCase(),
    email,
    password: await bcrypt.hash(data.password, 10),
    confirmation: {
      isConfirmed: false,
      confirmationSlug,
      confirmationCode,
      expireAt,
    },
  };

  const id = await addDocumentToFirestore(COLLECTION, user, email);
  if (!id) {
    return { ok: false, code: "CREATE_FAILED", message: "Nie udało się utworzyć konta" };
  }
  return { ok: true, id, confirmationSlug, confirmationCode };
}

// Tworzy rekord w kolekcji accountDetails
export async function createAccountDetails(details: AccountDetails): Promise<{ ok: boolean; code?: string; message?: string }> {
  const id = await addDocumentToFirestore("accountDetails", details, details.accountId);
  if (!id) {
    return { ok: false, code: "CREATE_DETAILS_FAILED", message: "Nie udało się utworzyć szczegółów konta" };
  }
  return { ok: true };
}

// Usuwa niezatwierdzone konta, których expireAt < now
export async function deleteExpiredUnconfirmedAccounts(): Promise<number> {
  const now = new Date().toISOString();
  // Szukaj kont, które nie są potwierdzone i mają przeterminowane expireAt
  const users = await queryFirestore<UserAccount>(COLLECTION, {
    constraints: [
      where("confirmation.isConfirmed", "==", false),
      where("confirmation.expireAt", "<", now)
    ]
  });
  if (!users || users.length === 0) return 0;
  let deleted = 0;
  for (const user of users) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const id = user.id;
    if (id) {
      await deleteDocumentFromFirestore(COLLECTION, id);
      deleted++;
    }
  }
  return deleted;
}

// Potwierdza konto na podstawie kodu (z użyciem updateDocumentInFirestore)
export async function confirmAccountByCode(email: string, code: string) {
  const users = await queryFirestore("accounts", {
    constraints: [where("email", "==", email.trim().toLowerCase())]
  });
  if (!users || users.length === 0) {
    return { ok: false, code: "NOT_FOUND", message: "Nie znaleziono konta" };
  }
  const user = users[0] as UserAccount & { id?: string };
  const confirmation = user.confirmation;
  if (!confirmation || confirmation.isConfirmed) {
    return { ok: false, code: "ALREADY_CONFIRMED", message: "Konto już potwierdzone" };
  }
  if (confirmation.confirmationCode !== code) {
    return { ok: false, code: "INVALID_CODE", message: "Nieprawidłowy kod potwierdzający" };
  }
  // Zaktualizuj confirmation.isConfirmed na true
  const docId = (user as any).id || user.email;
  const updateOk = await updateDocumentInFirestore(
    "accounts",
    docId,
    { confirmation: { ...confirmation, isConfirmed: true } }
  );
  if (!updateOk) {
    return { ok: false, code: "UPDATE_FAILED", message: "Nie udało się potwierdzić konta" };
  }
  return { ok: true };
}
