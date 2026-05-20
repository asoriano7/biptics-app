'use client'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Profile.module.css'

export default function ProfileScreen() {
  const { activeScreen, setScreen, user, signOut, cartItems } = useAppStore()
  const isActive = activeScreen === 'profile'

  const handleSignOut = async () => {
    await signOut()
    setScreen('splash')
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'
  const userEmail = user?.email || ''
  const userAvatar = user?.user_metadata?.avatar_url || null
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className={`${styles.profile} ${isActive ? styles.active : ''}`}>
      <div className={styles.statusBar}>
        <span>9:41</span><span>●●● 100%</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Mi Perfil</h2>
      </div>

      <div className={styles.scroll}>
        {user ? (
          <>
            {/* Avatar y datos */}
            <div className={styles.avatarSection}>
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span>{initials}</span>
                </div>
              )}
              <h3 className={styles.userName}>{userName}</h3>
              <p className={styles.userEmail}>{userEmail}</p>
              <div className={styles.planBadge}>Plan Básico</div>
            </div>

            {/* Stats */}
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNum}>{cartItems.length}</span>
                <span className={styles.statLabel}>En carrito</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>0</span>
                <span className={styles.statLabel}>Instalaciones</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNum}>0</span>
                <span className={styles.statLabel}>Tickets</span>
              </div>
            </div>

            {/* Menú opciones */}
            <div className={styles.menuSection}>
              <p className={styles.menuTitle}>Mi cuenta</p>

              <button className={styles.menuItem} onClick={() => setScreen('cart')}>
                <span className={styles.menuIcon}>🛒</span>
                <span className={styles.menuLabel}>Mi carrito</span>
                <span className={styles.menuArrow}>→</span>
              </button>

              <button className={styles.menuItem} onClick={() => setScreen('support')}>
                <span className={styles.menuIcon}>🤖</span>
                <span className={styles.menuLabel}>Soporte IA</span>
                <span className={styles.menuArrow}>→</span>
              </button>

              <button className={styles.menuItem} onClick={() => setScreen('shop')}>
                <span className={styles.menuIcon}>⚡</span>
                <span className={styles.menuLabel}>Tienda Biptics</span>
                <span className={styles.menuArrow}>→</span>
              </button>
            </div>

            <div className={styles.menuSection}>
              <p className={styles.menuTitle}>Legal</p>

              <a href="/privacidad" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
                <span className={styles.menuIcon}>🔒</span>
                <span className={styles.menuLabel}>Política de Privacidad</span>
                <span className={styles.menuArrow}>→</span>
              </a>
            </div>

            {/* Cerrar sesión */}
            <button className={styles.signOutBtn} onClick={handleSignOut}>
              Cerrar sesión
            </button>

            <div style={{ height: 100 }} />
          </>
        ) : (
          /* No logueado */
          <div className={styles.guestState}>
            <div className={styles.guestIcon}>👤</div>
            <h3 className={styles.guestTitle}>¡Bienvenido a Biptics!</h3>
            <p className={styles.guestSub}>Inicia sesión para gestionar tu cargador, ver tu historial y acceder al soporte IA.</p>
            <button className={styles.loginBtn} onClick={() => setScreen('login')}>
              Iniciar sesión
            </button>
            <button className={styles.registerBtn} onClick={() => setScreen('login')}>
              Crear cuenta gratis
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
