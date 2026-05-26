import NextAuth, { type Session } from "next-auth"
import GitHub from "@auth/core/providers/github"
import Google from "@auth/core/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ""
const jwtSecret = process.env.SUPABASE_JWT_SECRET || ""

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: supabaseUrl && jwtSecret ? SupabaseAdapter({
    url: supabaseUrl,
    secret: jwtSecret,
  }) : undefined,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id
        token.role = (user as any).role || 'learner'
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid as string
        (session.user as any).role = token.role as string
      }
      return session
    },
  },
})
