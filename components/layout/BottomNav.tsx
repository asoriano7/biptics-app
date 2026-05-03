'use client'
import { useAppStore, type Screen } from '@/lib/store/useAppStore'
import styles from './BottomNav.module.css'

const NAV_ITEMS: { icon: string; label: string; screen: Screen }[] = [
  { icon: '🏠', label: 'Inicio',   screen: 'home'    },
  { icon: '🛍️', label: 'Tienda',  screen: 'shop'    },
  { icon: '📍', label: 'Mapa EV', screen: 'map'     },
  { icon: '🤖', label: 'Soporte', screen: 'support' },
  { icon: '👤', label: 'Perfil',  screen: 'login'   },
]

export default function BottomNav() {
  const { activeScreen, setScreen } = useAppStore()

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
