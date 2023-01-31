import prisma from "@/lib/prismadb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    session: async ({ session, user }) => {
      // @ts-ignore
      session.id = user.id;
      console.log(user);
      // @ts-ignore
      session.role = user.role;
      return Promise.resolve(session);
    },
  },
} satisfies AuthOptions;

export default NextAuth(authOptions);
