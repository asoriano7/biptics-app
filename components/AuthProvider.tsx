'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store/useAppStore'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser)
  const setScreen = useAppStore((s) => s.setScreen)

  useEffect(() => {
    const supabase = createClient()

    // Cargar sesión activa al montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)

      // Si viene del callback de Google con loggedIn=true → ir al Home
      const params = new URLSearchParams(window.location.search)
      if (params.get('loggedIn') === 'true' && session?.user) {
        setScreen('home')
        // Limpiar el parámetro de la URL sin recargar
        window.history.replaceState({}, '', '/')
      }
    })

    // Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setScreen])

  return <>{children}</>
}
