'use client'
import { create } from 'zustand'

export type Screen = 'splash' | 'home' | 'shop' | 'login' | 'map' | 'support'

interface AppStore {
  theme: 'dark' | 'light'
  activeScreen: Screen
  cartCount: number
  toggleTheme: () => void
  setScreen: (s: Screen) => void
  addToCart: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  theme: 'dark',
  activeScreen: 'splash',
  cartCount: 0,
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      return { theme: next }
    }),
  setScreen: (activeScreen) => set({ activeScreen }),
  addToCart: () => set((s) => ({ cartCount: s.cartCount + 1 })),
}))
