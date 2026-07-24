import type { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// For local development - simplified auth
export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@gennoor.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // For local development, allow these three users with any password
        const authorizedEmails = [
          'admin@gennoor.com',
          'yusufchaudhary@gennoor.com',
          'jalalkhan@gennoor.com'
        ]

        if (credentials?.email && authorizedEmails.includes(credentials.email as string)) {
          return {
            id: credentials.email as string,
            email: credentials.email as string,
            name: (credentials.email as string).split('@')[0]
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (token?.email) {
        session.user = {
          email: token.email as string,
          name: (token.email as string).split('@')[0]
        }
      }
      return session
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'local-development-secret',
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
}