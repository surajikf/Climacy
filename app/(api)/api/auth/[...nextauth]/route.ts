import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { resolveUserClaims } from "@/services/auth-claims";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId || "",
      clientSecret: googleClientSecret || "",
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly https://mail.google.com/",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user }) {
      const email = (user.email || "").trim().toLowerCase();
      if (!email) return false;
      
      try {
        const dbUser = await resolveUserClaims(email, user.name || null);
        const status = dbUser?.status;
        if (status === "PENDING" || status === "BANNED" || status === "APPROVED") {
          return true;
        }
      } catch (error) {
        console.error("SignIn claims error:", error);
      }
      return false;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.scope = account.scope;
      }
      if (profile?.email) {
        token.email = profile.email;
      }

      const email = (token.email || "").trim().toLowerCase();
      if (email) {
        try {
          const user = await resolveUserClaims(email, (profile as any)?.name || null);
          if (user) {
            token.sub = user.id;
            (token as any).role = user.role;
            (token as any).status = user.status;
            (token as any).invoiceAccess = Boolean(user.canAccessInvoiceData);
          } else {
            (token as any).role = "USER";
            (token as any).status = "PENDING";
            (token as any).invoiceAccess = false;
          }
        } catch (error) {
          console.error("JWT claims error:", error);
          (token as any).role = "USER";
          (token as any).status = "PENDING";
          (token as any).invoiceAccess = false;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      (session.user as any).id = token.sub;           // DB user id — required for scoping
      (session.user as any).email = token.email;
      (session.user as any).role = token.role;
      (session.user as any).status = (token as any).status || "PENDING";
      (session.user as any).invoiceAccess = Boolean((token as any).invoiceAccess);
      (session.user as any).accessToken = token.accessToken;
      (session.user as any).refreshToken = token.refreshToken;
      (session.user as any).scope = token.scope;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
