import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Authorized emails for the CRM system
const AUTHORIZED_USERS = [
  { email: 'admin@gennoor.com', name: 'Admin', role: 'admin' },
  { email: 'jalalkhan@gennoor.com', name: 'Jalal Khan', role: 'ceo' },
  { email: 'yusufchaudhary@gennoor.com', name: 'Yusuf Chaudhary', role: 'manager' },
  { email: 'contact@gennoor.com', name: 'Contact', role: 'sales' }
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
        if (!credentials?.email) {
          return null
        }

        // Find user by email - no password check needed for internal tool
        const user = AUTHORIZED_USERS.find(
          u => u.email.toLowerCase() === credentials.email?.toLowerCase()
        )

        if (user) {
          return {
            id: user.email,
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
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production-7A3B9C2D8E4F1A6B5C9D0E3F8A2B7C4D',
})