import { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { queryFirestore } from "@/lib/services/adapters/firebase/utils/queryFirestore";
import { where } from "firebase/firestore";
import { UserAccount } from "@/lib/services/queries/account";


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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        // Pobierz użytkownika z Firestore
        const users = await queryFirestore("accounts", {
          constraints: [where("email", "==", credentials.email.trim().toLowerCase())],
        });
        if (!users || users.length === 0) return null;
        const user = users[0] as UserAccount;
        if (!user.confirmation?.isConfirmed) return null;
        // Sprawdź hasło (bcryptjs)
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        // Zwróć dane użytkownika do sesji
        return {
          id: user.email,
          email: user.email,
          name: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
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
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
  },
}