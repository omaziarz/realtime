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
      authorization: {
        params: {
          prompt: "login",
        },
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    session: async ({ session, token, user }) => {
      const getToken = await prisma.account.findFirst({
        where: {
          userId: user.id,
        },
      });

      let accessToken = null;
      if (getToken) {
        accessToken = getToken.access_token;
      }

      // @ts-ignore
      session.accessToken = accessToken;
      // @ts-ignore
      session.id = user.id;
      // @ts-ignore
      session.role = user.role;
      return Promise.resolve(session);
    },
  },
} satisfies AuthOptions;

export default NextAuth(authOptions);
