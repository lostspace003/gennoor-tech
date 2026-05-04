import NextAuth from 'next-auth'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
    }),
  ],
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
      const allowedUsers = (process.env.AZURE_AD_ALLOWED_USERS || '').split(',').map(e => e.trim().toLowerCase())
      const email = (user.email || profile?.email || '').toLowerCase()
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
    async jwt({ token, profile }) {
      if (profile) {
        token.id = profile.sub
        token.email = profile.email
      }
      return token
    },
  },
  session: { strategy: 'jwt' },
  trustHost: true,
})
