import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createUser, getUserByEmail } from '@/lib/users'
import { Resend } from 'resend'

const RegisterSchema = z.object({
  email: z.string().email('E-mail inválido'),
  first_name: z.string().min(1, 'Nome é obrigatório'),
  last_name: z.string().min(1, 'Sobrenome é obrigatório'),
  phone: z.string().min(8, 'Telefone inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Dados inválidos.' },
        { status: 400 },
      )
    }

    const { email, first_name, last_name, phone, password } = parsed.data

    const existing = await getUserByEmail(email)
    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Este e-mail já está cadastrado.' },
        { status: 409 },
      )
    }

    const password_hash = await bcrypt.hash(password, 12)
    await createUser({ email, first_name, last_name, phone, password_hash, status: 'pending' })

    // Notify admin
    if (process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from: 'Casa Baccarat <onboarding@resend.dev>',
          to: process.env.CONTACT_EMAIL,
          subject: 'Novo cadastro aguardando aprovação',
          html: `
            <h2>Novo usuário cadastrado</h2>
            <p><strong>Nome:</strong> ${first_name} ${last_name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
            <p>Acesse o painel admin para aprovar ou recusar este cadastro:</p>
            <p><a href="${process.env.NEXTAUTH_URL ?? ''}/admin/approvals">Painel de Aprovações</a></p>
          `,
        })
      } catch {
        // Email failure should not block registration
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[register]', err)
    return NextResponse.json({ ok: false, error: 'Erro interno.' }, { status: 500 })
  }
}
