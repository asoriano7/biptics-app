'use client'
import { useAppStore, type Screen } from '@/lib/store/useAppStore'
import styles from './BottomNav.module.css'

export default function BottomNav() {
  const { activeScreen, setScreen, user } = useAppStore()

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const userAvatar = user?.user_metadata?.avatar_url || null
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '👤'

  const NAV_ITEMS: { icon: React.ReactNode; label: string; screen: Screen }[] = [
    { icon: '🏠', label: 'Inicio', screen: 'home' },
    { icon: '🛍️', label: 'Tienda', screen: 'shop' },
    { icon: '📍', label: 'Mapa EV', screen: 'map' },
    { icon: '🤖', label: 'Soporte', screen: 'support' },
    {
      icon: user ? (
        userAvatar ? (
          <img src={userAvatar} alt={userName} className={styles.avatarImg} />
        ) : (
          <div className={styles.avatarInitials}>{initials}</div>
        )
      ) : '👤',
      label: user ? (userName.split(' ')[0] || 'Perfil') : 'Perfil',
      screen: 'profile'
    },
  ]

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(({ icon, label, screen }) => (
        <button
          key={screen}
          className={`${styles.item} ${activeScreen === screen ? styles.active : ''}`}
          onClick={() => setScreen(screen)}
          aria-label={label}
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </nav>
  )
}
