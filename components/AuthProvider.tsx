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

      if (event === 'PASSWORD_RECOVERY') {
        setScreen('resetPassword')
        window.history.replaceState({}, '', '/')
        return
      }

      if (event === 'SIGNED_IN') {
        const params = new URLSearchParams(window.location.search)

        // Si viene de recovery → ir a resetPassword
        if (params.get('recovery') === 'true') {
          setScreen('resetPassword')
          window.history.replaceState({}, '', '/')
          return
        }

        // Login normal → ir a home
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
