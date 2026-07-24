import NextAuth from 'next-auth'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import CredentialsProvider from 'next-auth/providers/credentials'

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development'

// Authorized emails for the lead system
const AUTHORIZED_EMAILS = [
  'admin@gennoor.com',
  'contact@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'jalalkhan@gennoor.com'
]

const providers: any[] = []

// Add credentials provider for local development
if (isDevelopment) {
  providers.push(
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (credentials?.email && AUTHORIZED_EMAILS.includes(credentials.email)) {
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.email.split('@')[0]
          }
        }
        return null
      }
    })
  )
}

// Add Microsoft Entra ID for production
if (process.env.AZURE_AD_CLIENT_ID) {
  providers.push(
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    })
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdmin = request.nextUrl.pathname.startsWith('/admin')
      if (isAdmin && !auth?.user) return false
      return true
    },
    async signIn({ user, profile }) {
      const email = (user?.email || profile?.email || '').toLowerCase()

      // For local development with credentials
      if (isDevelopment && user?.email) {
        return AUTHORIZED_EMAILS.includes(user.email)
      }

      // For production with Entra ID
      const allowedUsers = (process.env.AZURE_AD_ALLOWED_USERS || AUTHORIZED_EMAILS.join(',')).split(',').map(e => e.trim().toLowerCase())
      if (allowedUsers.length > 0 && allowedUsers[0] !== '' && !allowedUsers.includes(email)) {
        return false
      }
      return true
    },
    async session({ session, token }) {
      if (token.sub) session.user.id = token.sub
      if (token.email) session.user.email = token.email
      return session
    },
    async jwt({ token, profile, user }) {
      if (profile) {
        token.id = profile.sub
        token.email = profile.email
      }
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
  },
  session: { strategy: 'jwt' },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || 'local-development-secret-change-in-production',
})
