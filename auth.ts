import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { authConfig } from './auth.config'
import { getUserByEmail } from './lib/users'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: 'admin-credentials',
      async authorize(credentials) {
        const { username, password } = credentials as { username: string; password: string }
        if (username !== process.env.ADMIN_USERNAME) return null
        const ok = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!)
        if (!ok) return null
        return { id: '1', name: 'Admin', email: 'admin@estatefind.com', role: 'admin', userId: '1' }
      },
    }),
    Credentials({
      id: 'user-credentials',
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }
        if (!email || !password) return null
        const user = await getUserByEmail(email)
        if (!user) return null
        if (user.status !== 'approved') return null
        const ok = await bcrypt.compare(password, user.password_hash)
        if (!ok) return null
        return {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          role: 'user',
          userId: user.id,
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
  },
})
