'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm_password) {
      setError('As senhas não coincidem.')
      return
    }
    if (form.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      })
      const data = await res.json()
      if (!data.ok) {
        setError(data.error ?? 'Erro ao enviar cadastro.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7FA] flex items-start justify-center px-4 py-6">
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="text-center mb-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Casa Baccarat" className="h-12 w-auto mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-[#1E3A5F]">Criar conta</h1>
          <p className="text-sm text-[#6B6B99] mt-1">Cadastre-se para anunciar seu imóvel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#E6E6EF] p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#1E3A5F] mb-2">Cadastro enviado!</h2>
              <p className="text-sm text-[#6B6B99]">
                Aguarde a aprovação do administrador. Você receberá um e-mail quando sua conta for aprovada.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block text-sm font-medium text-[#6B6B99] hover:text-[#4F4F6B] transition-colors"
              >
                ← Voltar ao início
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={set('first_name')}
                    required
                    placeholder="João"
                    className="w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
                    Sobrenome <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={set('last_name')}
                    required
                    placeholder="Silva"
                    className="w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
                  E-mail <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  required
                  placeholder="joao@email.com"
                  className="w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  required
                  placeholder="(11) 99999-9999"
                  className="w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
                  Senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={set('password')}
                  required
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-3 py-2.5 bg-[#F7F7FA] border border-[#E6E6EF] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#6B6B99]/30 focus:border-[#6B6B99] transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4F6B] mb-1.5">
                  Confirmar Senha <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={form.confirm_password}
                  onChange={e => { setForm(f => ({ ...f, confirm_password: e.target.value })); setPasswordMismatch(false) }}
                  onBlur={() => setPasswordMismatch(!!form.confirm_password && form.confirm_password !== form.password)}
                  required
                  placeholder="Repita a senha"
                  className={`w-full px-3 py-2.5 bg-[#F7F7FA] border rounded-xl text-sm outline-none focus:ring-2 transition ${passwordMismatch ? 'border-red-400 focus:ring-red-300' : 'border-[#E6E6EF] focus:ring-[#6B6B99]/30 focus:border-[#6B6B99]'}`}
                />
                {passwordMismatch && (
                  <p className="text-xs text-red-500 mt-1">As senhas não coincidem.</p>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#6B6B99] hover:bg-[#4F4F6B] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Criar conta'}
              </button>

              <p className="text-center text-xs text-[#A3A3C2] pt-1">
                Já tem conta?{' '}
                <Link href="/login" className="text-[#6B6B99] hover:text-[#4F4F6B] font-medium">
                  Entrar
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
