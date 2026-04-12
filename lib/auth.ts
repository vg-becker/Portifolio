import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      // 🔥 ALTERAR PARA SEU EMAIL
      if (user.email === "g.vitor.g@gmail.com") {
        return true;
      }
      return false;
    },
  },
};