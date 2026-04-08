'use client'

import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import { userLoginAction } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 bg-[#6B6B99] hover:bg-[#4F4F6B] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  )
}

export default function UserLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction] = useActionState(userLoginAction, null)

  return (
    <div className="min-h-screen bg-[#F7F7FA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Casa Baccarat" className="h-16 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Minha Conta</h1>
          <p className="text-sm text-[#6B6B99] mt-1">Acesse sua área de anunciante</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E6E6EF] p-8">
          <form action={formAction} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Sua senha"
                  className="w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3C2] hover:text-[#6B6B99] transition-colors"
                  tabIndex={-1}
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

            {state?.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}

            <SubmitButton />

            <p className="text-center text-xs text-[#A3A3C2] pt-1">
              Não tem conta?{' '}
              <Link href="/register" className="text-[#6B6B99] hover:text-[#4F4F6B] font-medium">
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-[#A3A3C2] mt-6">
          É administrador?{' '}
          <Link href="/admin/login" className="text-[#6B6B99] hover:text-[#4F4F6B]">
            Acesso admin
          </Link>
        </p>
      </div>
    </div>
  )
}
