import { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { queryFirestore } from "@/lib/services/adapters/firebase/utils/queryFirestore";
import { where } from "firebase/firestore";
import { addDocumentToFirestore } from "@/lib/services/adapters/firebase/utils/queryFirestore";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Account, Profile } from "next-auth";
import { UserAccount } from "@/lib/globalTypes/account";
import { createAccountDetails, getAccountDetails } from "@/lib/services/queries/accountDetails";


function getDiscordProfile(profile: unknown) {
  // Discord profile fields are not typed in NextAuth, so we extract what we need
  const p = profile as Partial<{
    email: string;
    username: string;
    global_name: string;
    id: string;
  }>;
  return {
    email: (p.email || "").toLowerCase(),
    username: p.username || p.global_name || p.email || p.id || "discord_user",
  };
}

async function findAccountByEmail(email: string) {
  return queryFirestore("accounts", {
    constraints: [where("email", "==", email)],
  });
}

async function createDiscordAccount({ username, email }: { username: string; email: string }) {
  try {
    console.log(`[AUTH] Creating Discord account for ${email}`);
    
    // Tworzenie konta
    const accountId = await addDocumentToFirestore(
      "accounts",
      {
        username,
        usernameLower: username.toLowerCase(),
        email,
        password: "", // Brak hasła dla Discorda
        confirmation: {
          isConfirmed: true,
          confirmationSlug: "",
          confirmationCode: "",
          expireAt: "",
        },
      },
      email
    );

    // Tworzenie pustych szczegółów konta
    if (accountId) {
      console.log(`[AUTH] Creating accountDetails for ${email}`);
      await createAccountDetails({ 
        accountId: email, // używamy email jako accountId
        // Pomijamy wszystkie opcjonalne pola - będą undefined
      });
      console.log(`[AUTH] Successfully created account and details for ${email}`);
    }

    return accountId;
  } catch (error) {
    console.error(`[AUTH] Failed to create Discord account for ${email}:`, error);
    throw error;
  }
}

// Tutaj sesji danych
async function authorizeCredentials(credentials: Record<string, string> | undefined) {
  if (!credentials?.email || !credentials?.password) return null;
  const users = await queryFirestore("accounts", {
    constraints: [where("email", "==", credentials.email.trim().toLowerCase())],
  });
  if (!users || users.length === 0) return null;
  const user = users[0] as UserAccount;
  if (!user.confirmation?.isConfirmed) return null;
  const isValid = await bcrypt.compare(credentials.password, user.password);
  if (!isValid) return null;

  return {
    id: user.email,
    email: user.email,
    name: user.username,
  };
}

function sessionCallback({ session, token }: { session: Session; token: JWT }) {
  return {
    ...session,
    user: session.user
      ? {
          ...session.user,
          id: token?.id,
          email: token?.email,
          name: token?.name,
        }
      : undefined,
  };
}

function jwtCallback({ token, user }: { token: JWT; user?: User }) {
  if (user) {
    token.id = user.id;
    token.email = user.email;
    token.name = user.name;
  }
  return token;
}

async function signInCallback({ account, profile, user }: { 
  account?: Account | null; 
  profile?: Profile | undefined;
  user?: User;
}) {
  let userEmail: string | null = null;

  if (account?.provider === "discord" && profile) {
    const { email, username } = getDiscordProfile(profile);
    userEmail = email;
    console.log(`[AUTH] Discord sign-in attempt for ${email}`);
    
    const users = await findAccountByEmail(email);
    
    if (!users || users.length === 0) {
      console.log(`[AUTH] No account found for ${email}, creating new account`);
      // Tworzenie nowego konta (wraz z accountDetails)
      await createDiscordAccount({ username, email });
    } else {
      console.log(`[AUTH] Account found for ${email}`);
    }
  } else if (account?.provider === "credentials" && user?.email) {
    userEmail = user.email;
    console.log(`[AUTH] Credentials sign-in for ${userEmail}`);
  }

  // Uniwersalne sprawdzenie accountDetails dla wszystkich providerów
  if (userEmail) {
    const existingDetails = await getAccountDetails(userEmail);
    if (!existingDetails) {
      console.log(`[AUTH] No accountDetails found for ${userEmail}, creating...`);
      // Tworzenie brakujących accountDetails dla istniejącego konta
      await createAccountDetails({ 
        accountId: userEmail,
        // Pomijamy wszystkie opcjonalne pola - będą undefined
      });
      console.log(`[AUTH] Created accountDetails for ${userEmail}`);
    } else {
      console.log(`[AUTH] AccountDetails already exist for ${userEmail}`);
    }
  }

  return true;
}

// --- AUTH CONFIG ---

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    DiscordProvider({
      clientId: '1377735368224542760',
      clientSecret: 'wjwhfentxjfVZpuy2HFlvCFd1SZOQx0t',
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" },
      },
      authorize: authorizeCredentials,
    }),
  ],
  callbacks: {
    signIn: signInCallback,
    session: sessionCallback,
    jwt: jwtCallback,
  },
}