'use client'
import { useAppStore, type Screen } from '@/lib/store/useAppStore'
import styles from './Controls.module.css'

const SCREENS: { id: Screen; label: string }[] = [
  { id: 'splash',  label: '① Splash'  },
  { id: 'home',    label: '② Home'    },
  { id: 'shop',    label: '③ Tienda'  },
  { id: 'product', label: '③b Detalle' },
  { id: 'cart',    label: '③c Carrito' },
  { id: 'login',   label: '④ Login'   },
  { id: 'map',     label: '⑤ Mapa'    },
  { id: 'support', label: '⑥ IA'      },
]

export default function Controls() {
  const { theme, activeScreen, toggleTheme, setScreen } = useAppStore()
  const isDark = theme === 'dark'

  return (
    <div className={styles.controls}>
      <div className={styles.screenNav}>
        {SCREENS.map(({ id, label }) => (
          <button
            key={id}
            className={`${styles.navBtn} ${activeScreen === id ? styles.active : ''}`}
            onClick={() => setScreen(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Cambiar tema">
        <span className={styles.icon}>{isDark ? '🌙' : '☀️'}</span>
        <div className={styles.track}>
          <div className={styles.thumb} />
        </div>
        <span className={styles.label}>{isDark ? 'Oscuro' : 'Claro'}</span>
      </button>
    </div>
  )
}
