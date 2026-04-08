'use server'

import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function userLoginAction(_prevState: any, formData: FormData) {
  try {
    await signIn('user-credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/user/dashboard',
    })
  } catch (e) {
    if (e instanceof AuthError) {
      return { error: 'E-mail ou senha incorretos, ou conta não aprovada.' }
    }
    throw e
  }
}
