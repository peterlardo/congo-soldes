import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.motDePasse) {
          throw new Error("Email et mot de passe requis")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          throw new Error("Email ou mot de passe incorrect")
        }

        if (!user.actif) {
          throw new Error("Compte désactivé. Contactez l'administrateur.")
        }

        const isValid = await compare(credentials.motDePasse, user.motDePasse)

        if (!isValid) {
          throw new Error("Email ou mot de passe incorrect")
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.prenom ?? ""} ${user.nom}`.trim(),
          role: user.role,
          avatar: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.avatar = token.avatar as string | undefined
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/connexion",
    error: "/auth/connexion",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}
