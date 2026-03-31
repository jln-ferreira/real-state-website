import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ContactSchema } from '@/lib/schemas'
import { saveContactMessage } from '@/lib/contacts'

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const body = await req.json()
  const parsed = ContactSchema.safeParse(body)
  if (!parsed.success)
    return NextResponse.json({ error: 'Dados inválidos', issues: parsed.error.issues }, { status: 400 })

  const { propertyId, name, phone, email, message } = parsed.data

  await saveContactMessage(parsed.data)

  const { data: emailData, error: emailError } = await resend.emails.send({
    from: 'Casa Baccarat <onboarding@resend.dev>',
    to: process.env.CONTACT_EMAIL!,
    replyTo: email,
    subject: `Nova mensagem de contato — ${propertyId}`,
    html: `
      <p><strong>Imóvel:</strong> ${propertyId}</p>
      <p><strong>Nome:</strong> ${name}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Mensagem:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  })

  if (emailError) {
    console.error('Resend error:', emailError)
    return NextResponse.json({ error: 'Falha ao enviar e-mail', detail: emailError }, { status: 500 })
  }

  console.log('Email sent:', emailData?.id)
  return NextResponse.json({ ok: true }, { status: 201 })
}
