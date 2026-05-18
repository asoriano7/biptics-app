import { NextRequest, NextResponse } from 'next/server'

const BIPA_URL = process.env.NODE_ENV === 'production'
  ? 'https://n8n-main-instance-production-d0e4.up.railway.app/webhook/bipa'
  : 'https://n8n-main-instance-production-d0e4.up.railway.app/webhook-test/bipa'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch(BIPA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: body.message,
        sessionId: body.sessionId,
        from: body.from || 'app-user',
      }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error al conectar con BIPA' },
        { status: 500 }
      )
    }

    const data = await response.json()

    // n8n puede retornar el output en diferentes formatos
    const reply =
      data?.output ||
      data?.text ||
      data?.message ||
      data?.reply ||
      (Array.isArray(data) && data[0]?.output) ||
      (Array.isArray(data) && data[0]?.text) ||
      'BIPA está procesando tu consulta...'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('BIPA API error:', error)
    return NextResponse.json(
      { reply: 'En este momento no puedo conectarme. Por favor escríbenos al WhatsApp +57 314 3974123.' },
      { status: 200 }
    )
  }
}
