import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { validateUserCredentials } from '@/config/users'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Validate user credentials using Entry ID system
        const user = validateUserCredentials(
          credentials.email as string,
          credentials.password as string
        )

        if (user) {
          return {
            id: user.entryId,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }

        return null
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith('/admin')
      if (isAdmin && !auth?.user) {
        return false
      }
      return true
    },
    async signIn({ user }) {
      // User is already validated in authorize callback
      return !!user
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      if (token.email) session.user.email = token.email
      if (token.role) session.user.role = token.role as string
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  // IMPORTANT: Set NEXTAUTH_SECRET in production!
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production-7A3B9C2D8E4F1A6B5C9D0E3F8A2B7C4D',
})