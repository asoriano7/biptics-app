'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store/useAppStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)
  const setScreen = useAppStore((s) => s.setScreen)

  useEffect(() => {
    const supabase = createClient()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)

      if (event === 'SIGNED_IN') {
        // Si está en reset-password, no navegar — dejar que el usuario guarde la nueva contraseña
        const isResetPage = window.location.pathname === '/auth/reset-password'
        if (isResetPage) return

        // Limpiar parámetro loggedIn de la URL si existe
        const params = new URLSearchParams(window.location.search)
        if (params.get('loggedIn') === 'true') {
          window.history.replaceState({}, '', '/')
        }
        setScreen('home')
      }

      if (event === 'SIGNED_OUT') {
        setScreen('splash')
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setScreen])

  return <>{children}</>
}
