import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authConfig: NextAuthConfig = {
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isLoginPage = nextUrl.pathname === '/admin/login'
      if (isAdminRoute && !isLoginPage && !isLoggedIn)
        return Response.redirect(new URL('/admin/login', nextUrl))
      if (isLoginPage && isLoggedIn)
        return Response.redirect(new URL('/admin/properties', nextUrl))
      return true
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { username, password } = credentials as { username: string; password: string }
        if (username !== process.env.ADMIN_USERNAME) return null
        const ok = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!)
        if (!ok) return null
        return { id: '1', name: 'Admin', email: 'admin@estatefind.com' }
      },
    }),
  ],
}
