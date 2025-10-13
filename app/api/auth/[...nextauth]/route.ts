import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const envUser = process.env.APP_USERNAME;
        const envPass = process.env.APP_PASSWORD;

        if (
          credentials?.username === envUser &&
          credentials?.password === envPass
        ) {

          return { id: "1", name: envUser };
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
