import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[AUTH] Attempting authorization for:", credentials?.email);

                if (!credentials?.email || !credentials?.password) {
                    console.error("[AUTH] Missing email or password");
                    throw new Error("Missing credentials");
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (!user) {
                        console.error("[AUTH] User not found:", credentials.email);
                        throw new Error("Invalid credentials");
                    }

                    if (!user.passwordHash) {
                        console.error("[AUTH] User has no password hash:", credentials.email);
                        throw new Error("Invalid credentials");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);

                    if (!isPasswordValid) {
                        console.error("[AUTH] Invalid password for:", credentials.email);
                        throw new Error("Invalid credentials");
                    }

                    console.log("[AUTH] Authorization successful for:", credentials.email);
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        status: user.status,
                    };
                } catch (err: any) {
                    console.error("[AUTH] Database or bcrypt error:", err);
                    throw err;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.role = user.role;
                token.status = user.status;
                token.id = user.id;
            }
            // Add a hook to fetch the latest status from db if needed? 
            // We can do it on the session callback if needed, but for performance, we keep it in the token.
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as string;
                session.user.status = token.status as string;
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "default_local_insecure_secret",
};
