import type { NextAuthConfig } from 'next-auth'

// Edge-safe config: authorized + jwt/session callbacks live here so the
// middleware (which uses NextAuth(authConfig)) can read role from the token.
// Providers that need Node.js (DB access, bcrypt) are in auth.ts.
export const authConfig: NextAuthConfig = {
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role as string
        token.userId = (user as any).userId as string
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = token.role as string
        ;(session.user as any).userId = token.userId as string
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const role = (auth as any)?.user?.role as string | undefined
      const isAdminRoute = nextUrl.pathname.startsWith('/admin')
      const isUserRoute = nextUrl.pathname.startsWith('/user')
      const isLoginPage = nextUrl.pathname === '/admin/login'
      const isUserLoginPage = nextUrl.pathname === '/login'

      if (isAdminRoute && !isLoginPage && (!isLoggedIn || role !== 'admin'))
        return Response.redirect(new URL('/admin/login', nextUrl))
      if (isUserRoute && (!isLoggedIn || role !== 'user'))
        return Response.redirect(new URL('/login', nextUrl))
      if (isLoginPage && isLoggedIn && role === 'admin')
        return Response.redirect(new URL('/admin/dashboard', nextUrl))
      if (isUserLoginPage && isLoggedIn && role === 'user')
        return Response.redirect(new URL('/user/dashboard', nextUrl))
      if (isUserLoginPage && isLoggedIn && role === 'admin')
        return Response.redirect(new URL('/admin/dashboard', nextUrl))
      return true
    },
  },
  providers: [],
}
