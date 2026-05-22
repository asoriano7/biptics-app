import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next')

  // Flujo recovery con token_hash
  if (token_hash && type === 'recovery') {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: 'recovery' })
    if (!error) {
      return NextResponse.redirect(`${origin}/auth/reset-password`)
    }
  }

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Detectar si es recovery por el tipo de sesión
      const isRecovery = data?.user?.recovery_sent_at != null && 
        (Date.now() - new Date(data.user.recovery_sent_at).getTime()) < 3600000

      if (next === '/auth/reset-password' || isRecovery) {
        return NextResponse.redirect(`${origin}/auth/reset-password`)
      }
      return NextResponse.redirect(`${origin}/?loggedIn=true`)
    }
  }

  return NextResponse.redirect(`${origin}/`)
}
