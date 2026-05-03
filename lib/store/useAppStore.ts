'use client'
import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type Screen = 'splash' | 'home' | 'shop' | 'login' | 'map' | 'support'

interface AppStore {
  theme: 'dark' | 'light'
  activeScreen: Screen
  cartCount: number
  user: User | null
  loadingAuth: boolean
  toggleTheme: () => void
  setScreen: (s: Screen) => void
  addToCart: () => void
  setUser: (user: User | null) => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'dark',
  activeScreen: 'splash',
  cartCount: 0,
  user: null,
  loadingAuth: false,

  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      return { theme: next }
    }),

  setScreen: (activeScreen) => set({ activeScreen }),
  addToCart: () => set((s) => ({ cartCount: s.cartCount + 1 })),
  setUser: (user) => set({ user }),

  signInWithGoogle: async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  },

  signInWithEmail: async (email, password) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    set({ activeScreen: 'home' })
    return { error: null }
  },

  signUpWithEmail: async (name, email, password) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) return { error: error.message }
    set({ activeScreen: 'home' })
    return { error: null }
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, activeScreen: 'splash' })
  },
}))
