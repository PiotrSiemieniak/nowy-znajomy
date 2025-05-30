import { AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";


export const authOptions: AuthOptions = {
  
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: '1377735368224542760',
      clientSecret: 'wjwhfentxjfVZpuy2HFlvCFd1SZOQx0t',
    })
    // ...add more providers here
  ],
  callbacks: {
    async session({ session }) {
      // Dodaj custom dane do sesji jeśli chcesz
      return session;
    },
  },
}