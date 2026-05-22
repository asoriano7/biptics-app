'use client'
import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type Screen = 'splash' | 'home' | 'shop' | 'product' | 'cart' | 'login' | 'map' | 'support' | 'profile' | 'resetPassword'

export interface Product {
  id: string
  badge: string
  emoji: string
  cat: string
  name: string
  specs: string[]
  stars: number
  reviews: number
  stock: string
  price: string
  priceNum: number
  iva: string
  note: string
  description: string
  compatible: string[]
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

interface AppStore {
  theme: 'dark' | 'light'
  activeScreen: Screen
  previousScreen: Screen
  cartCount: number
  cartItems: CartItem[]
  selectedProduct: Product | null
  user: User | null
  loadingAuth: boolean
  toggleTheme: () => void
  setScreen: (s: Screen) => void
  addToCart: (product?: Product) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setSelectedProduct: (product: Product | null) => void
  setUser: (user: User | null) => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>
  signUpWithEmail: (name: string, email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const useAppStore = create<AppStore>((set, get) => ({
  theme: 'dark',
  activeScreen: 'splash',
  previousScreen: 'home',
  cartCount: 0,
  cartItems: [],
  selectedProduct: null,
  user: null,
  loadingAuth: false,

  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      return { theme: next }
    }),

  setScreen: (activeScreen) => set((s) => ({ 
    previousScreen: s.activeScreen, 
    activeScreen 
  })),

  setSelectedProduct: (product) => set({ selectedProduct: product }),

  addToCart: (product?: Product) => {
    if (!product) {
      set((s) => ({ cartCount: s.cartCount + 1 }))
      return
    }
    set((s) => {
      const existing = s.cartItems.find((i) => i.product.id === product.id)
      if (existing) {
        return {
          cartItems: s.cartItems.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          cartCount: s.cartCount + 1,
        }
      }
      return {
        cartItems: [...s.cartItems, { product, quantity: 1 }],
        cartCount: s.cartCount + 1,
      }
    })
  },

  removeFromCart: (productId) => {
    set((s) => {
      const item = s.cartItems.find((i) => i.product.id === productId)
      if (!item) return s
      return {
        cartItems: s.cartItems.filter((i) => i.product.id !== productId),
        cartCount: s.cartCount - item.quantity,
      }
    })
  },

  updateQuantity: (productId, quantity) => {
    set((s) => {
      if (quantity <= 0) {
        const item = s.cartItems.find((i) => i.product.id === productId)
        return {
          cartItems: s.cartItems.filter((i) => i.product.id !== productId),
          cartCount: s.cartCount - (item?.quantity || 0),
        }
      }
      const item = s.cartItems.find((i) => i.product.id === productId)
      const diff = quantity - (item?.quantity || 0)
      return {
        cartItems: s.cartItems.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        ),
        cartCount: s.cartCount + diff,
      }
    })
  },

  clearCart: () => set({ cartItems: [], cartCount: 0 }),

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
    const prev = get().previousScreen
    set({ activeScreen: prev === 'login' ? 'home' : prev })
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
    const prev = get().previousScreen
    set({ activeScreen: prev === 'login' ? 'home' : prev })
    return { error: null }
  },

  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, activeScreen: 'splash' })
  },
}))
