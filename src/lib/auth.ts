import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Authorized emails for the lead system
const AUTHORIZED_EMAILS = [
  'admin@gennoor.com',
  'contact@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'jalalkhan@gennoor.com'
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Simple email-based authentication for authorized users
        if (credentials?.email && AUTHORIZED_EMAILS.includes(credentials.email as string)) {
          // In production, you should verify password properly
          // For now, accept any password for authorized emails
          if (credentials.password) {
            return {
              id: credentials.email as string,
              email: credentials.email as string,
              name: (credentials.email as string).split('@')[0],
              role: credentials.email === 'admin@gennoor.com' ? 'admin' : 'user' as string
            }
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
      const email = user?.email?.toLowerCase()
      // Check if email is in authorized list
      if (!email || !AUTHORIZED_EMAILS.includes(email)) {
        return false
      }
      return true
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
        token.role = user.email === 'admin@gennoor.com' ? 'admin' : 'user'
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