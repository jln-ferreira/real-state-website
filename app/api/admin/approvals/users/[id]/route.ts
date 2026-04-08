import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getUserById, updateUserStatus } from '@/lib/users'
import { Resend } from 'resend'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const status = body.status as 'approved' | 'rejected'

  if (status !== 'approved' && status !== 'rejected')
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const user = await getUserById(id)
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await updateUserStatus(id, status)

  // Send approval email
  if (status === 'approved' && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from: 'Casa Baccarat <onboarding@resend.dev>',
        to: user.email,
        subject: 'Sua conta foi aprovada — Casa Baccarat',
        html: `
          <h2>Olá, ${user.first_name}!</h2>
          <p>Sua conta no <strong>Casa Baccarat</strong> foi aprovada.</p>
          <p>Agora você pode fazer login e cadastrar seus imóveis:</p>
          <p><a href="${process.env.NEXTAUTH_URL ?? ''}/login">Acessar minha conta</a></p>
          <p>Atenciosamente,<br/>Equipe Casa Baccarat</p>
        `,
      })
    } catch {
      // Email failure shouldn't fail the request
    }
  }

  return NextResponse.json({ ok: true })
}
