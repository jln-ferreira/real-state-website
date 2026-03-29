'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-2.5 bg-[#1E3A5F] text-white font-semibold rounded-xl text-sm hover:bg-[#141d3a] transition-colors disabled:opacity-60"
    >
      {pending ? 'Signing in...' : 'Sign in'}
    </button>
  )
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-2 mb-6">
          <svg className="h-7 w-7 text-[#1E3A5F]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-xl font-bold text-[#1E3A5F]">EstateFind Admin</span>
        </div>
        <p className="text-sm text-neutral-500 mb-6">Sign in to manage listings</p>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Username</label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="w-full px-3 py-2.5 bg-neutral-100 rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-[#1E3A5F]/30 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.637 0-8.572-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
