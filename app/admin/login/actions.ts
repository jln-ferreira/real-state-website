'use server'

import { signIn } from '@/auth'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/rate-limit'
import { headers } from 'next/headers'
import { AuthError } from 'next-auth'

export async function loginAction(_prevState: any, formData: FormData) {
  const ip = (await headers()).get('x-forwarded-for') ?? 'unknown'
  const { allowed, retryAfter } = checkRateLimit(ip)
  if (!allowed) return { error: `Too many attempts. Try again in ${retryAfter}s.` }

  try {
    await signIn('admin-credentials', {
      username: formData.get('username'),
      password: formData.get('password'),
      redirectTo: '/admin/properties',
    })
    clearAttempts(ip)
  } catch (e) {
    if (e instanceof AuthError) {
      recordFailedAttempt(ip)
      return { error: 'Invalid username or password' }
    }
    throw e
  }
}
