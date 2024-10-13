import { PrismaAdapter } from "@auth/prisma-adapter";
import type { ROLE, Shop } from "@prisma/client";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import Github from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";
import { compare } from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      role: ROLE;
      shop?: Shop;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      if (account?.provider === "github" && token.email) {
        const existingUser = await db.user.findUnique({
          where: { email: token.email },
        });
        if (existingUser) {
          token.id = existingUser.id;
          token.role = existingUser.role;
        } else {
          token.role = "USER";
        }
      }
      return token;
    },

    async session({ session, token }) {
      const user = await db.user.findUnique({
        where: { email: token.email! },
        include: {
          shop: true,
        },
      });
      if (user) {
        session.user.role = user.role;
        session.user.shop = user?.shop ?? undefined;
      }
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      id: "email-password",
      name: "Email and Password",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        if (!credentials) throw new Error("No credentials provided");
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password are required");
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isValid = await compare(
          String(credentials.password),
          String(user.password),
        );
        if (!isValid) throw new Error("Invalid credentials");
        return user;
      },
    }),

    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),

    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
