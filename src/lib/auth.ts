import NextAuth from 'next-auth'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'

// Authorized emails for the CRM system
const AUTHORIZED_EMAILS = [
  'admin@gennoor.com',
  'jalalkhan@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'contact@gennoor.com'
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: process.env.AZURE_AD_TENANT_ID
        ? `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`
        : undefined,
      authorization: {
        params: {
          scope: 'openid profile email'
        }
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
    async signIn({ user, profile }) {
      const email = (user?.email || profile?.email || '').toLowerCase()

      // Check if email is in authorized list
      if (!AUTHORIZED_EMAILS.includes(email)) {
        return false // Deny access
      }

      return true // Allow access
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
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',
})