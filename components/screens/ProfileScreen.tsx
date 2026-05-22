'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Profile.module.css'

type SubScreen = 'main' | 'misDatos' | 'misPedidos' | 'direccion'

export default function ProfileScreen() {
  const { activeScreen, setScreen, user, signOut, cartItems } = useAppStore()
  const isActive = activeScreen === 'profile'
  const [subScreen, setSubScreen] = useState<SubScreen>('main')
  const [editando, setEditando] = useState<'personal' | 'contacto' | null>(null)

  // Datos del usuario
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'
  const userEmail = user?.email || ''
  const userAvatar = user?.user_metadata?.avatar_url || null
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  // Estado editable
  const [nombre, setNombre] = useState(userName)
  const [cedula, setCedula] = useState('')
  const [telefono, setTelefono] = useState('')

  const handleSignOut = async () => {
    await signOut()
    setScreen('splash')
  }

  const handleBack = () => {
    if (subScreen !== 'main') { setSubScreen('main'); setEditando(null) }
    else setScreen('home')
  }

  // ── SUB-PANTALLA: MIS DATOS ──
  if (isActive && subScreen === 'misDatos') {
    return (
      <div className={`${styles.profile} ${styles.active}`}>
        <div className={styles.statusBar}><span>9:41</span><span>●●● 100%</span></div>
        <div className={styles.header} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className={styles.backBtn} onClick={handleBack}>←</button>
          <h2 className={styles.title}>Mis datos</h2>
        </div>
        <div className={styles.scroll}>

          {/* Información personal */}
          <div className={styles.dataCard}>
            <p className={styles.dataCardTitle}>Información personal</p>
            {editando === 'personal' ? (
              <>
                <div className={styles.fieldWrap}>
                  <label className={styles.dataLabel}>Nombre completo</label>
                  <input className={styles.dataInput} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo" />
                </div>
                <div className={styles.fieldWrap}>
                  <label className={styles.dataLabel}>Cédula (CC)</label>
                  <input className={styles.dataInput} value={cedula} onChange={e => setCedula(e.target.value)} placeholder="Ej: 72343028" />
                </div>
                <button className={styles.saveBtn} onClick={() => setEditando(null)}>Guardar</button>
              </>
            ) : (
              <>
                <p className={styles.dataValue}>{nombre}</p>
                <p className={styles.dataValueSub}>CC {cedula || '—'}</p>
                <button className={styles.editLink} onClick={() => setEditando('personal')}>✏️ Editar</button>
              </>
            )}
          </div>

          {/* Contraseña */}
          <div className={styles.dataCard}>
            <p className={styles.dataCardTitle}>Contraseña</p>
            <p className={styles.dataValue}>••••••••</p>
            <button className={styles.editLink} onClick={() => window.open('/auth/reset-password', '_blank')}>
              ✏️ Cambiar
            </button>
          </div>

          {/* Información de contacto */}
          <div className={styles.dataCard}>
            <p className={styles.dataCardTitle}>Información de contacto</p>
            {editando === 'contacto' ? (
              <>
                <div className={styles.fieldWrap}>
                  <label className={styles.dataLabel}>Correo electrónico</label>
                  <input className={styles.dataInput} value={userEmail} disabled style={{ opacity: 0.6 }} />
                  <span className={styles.dataHint}>El correo no se puede cambiar</span>
                </div>
                <div className={styles.fieldWrap}>
                  <label className={styles.dataLabel}>Teléfono celular</label>
                  <input className={styles.dataInput} value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej: 316 528 4375" />
                </div>
                <button className={styles.saveBtn} onClick={() => setEditando(null)}>Guardar</button>
              </>
            ) : (
              <>
                <p className={styles.dataLabel}>Correo electrónico</p>
                <p className={styles.dataValue}>{userEmail}</p>
                <div style={{ height: 12 }} />
                <p className={styles.dataLabel}>Teléfono celular</p>
                <p className={styles.dataValue}>{telefono || '—'}</p>
                <button className={styles.editLink} onClick={() => setEditando('contacto')}>✏️ Editar</button>
              </>
            )}
          </div>

          <div style={{ height: 100 }} />
        </div>
      </div>
    )
  }

  // ── SUB-PANTALLA: MIS PEDIDOS ──
  if (isActive && subScreen === 'misPedidos') {
    return (
      <div className={`${styles.profile} ${styles.active}`}>
        <div className={styles.statusBar}><span>9:41</span><span>●●● 100%</span></div>
        <div className={styles.header} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className={styles.backBtn} onClick={handleBack}>←</button>
          <h2 className={styles.title}>Mis Pedidos</h2>
        </div>
        <div className={styles.scroll}>
          <div className={styles.emptyState}>
            <span style={{ fontSize: 48 }}>📦</span>
            <p className={styles.emptyTitle}>Aún no tienes pedidos</p>
            <p className={styles.emptySub}>Cuando realices tu primera compra, aparecerá aquí.</p>
            <button className={styles.loginBtn} onClick={() => setScreen('shop')}>
              Ver tienda ⚡
            </button>
          </div>
          <div style={{ height: 100 }} />
        </div>
      </div>
    )
  }

  // ── SUB-PANTALLA: DIRECCIÓN ──
  if (isActive && subScreen === 'direccion') {
    return (
      <div className={`${styles.profile} ${styles.active}`}>
        <div className={styles.statusBar}><span>9:41</span><span>●●● 100%</span></div>
        <div className={styles.header} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className={styles.backBtn} onClick={handleBack}>←</button>
          <h2 className={styles.title}>Dirección de envío</h2>
        </div>
        <div className={styles.scroll}>
          <div className={styles.emptyState}>
            <span style={{ fontSize: 48 }}>📍</span>
            <p className={styles.emptyTitle}>Sin dirección registrada</p>
            <p className={styles.emptySub}>Agrega tu dirección para agilizar tus pedidos.</p>
          </div>
          <div className={styles.dataCard}>
            <p className={styles.dataCardTitle}>Nueva dirección</p>
            <div className={styles.fieldWrap}>
              <label className={styles.dataLabel}>Ciudad</label>
              <input className={styles.dataInput} placeholder="Ej: Bogotá D.C." />
            </div>
            <div className={styles.fieldWrap}>
              <label className={styles.dataLabel}>Dirección</label>
              <input className={styles.dataInput} placeholder="Ej: Cra 15 # 80-20" />
            </div>
            <div className={styles.fieldWrap}>
              <label className={styles.dataLabel}>Barrio / Apto</label>
              <input className={styles.dataInput} placeholder="Ej: Chapinero, Apto 301" />
            </div>
            <button className={styles.saveBtn}>Guardar dirección</button>
          </div>
          <div style={{ height: 100 }} />
        </div>
      </div>
    )
  }

  // ── PANTALLA PRINCIPAL ──
  return (
    <div className={`${styles.profile} ${isActive ? styles.active : ''}`}>
      <div className={styles.statusBar}>
        <span>9:41</span><span>●●● 100%</span>
      </div>
      <div className={styles.header}>
        <h2 className={styles.title}>Mi Perfil</h2>
      </div>

      <div className={styles.scroll}>
        {user ? (
          <>
            {/* Avatar */}
            <div className={styles.avatarSection}>
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className={styles.avatarImg} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <span>{initials}</span>
                </div>
              )}
              <h3 className={styles.userName}>{nombre}</h3>
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

            {/* Mi cuenta */}
            <div className={styles.menuSection}>
              <p className={styles.menuTitle}>Mi cuenta</p>

              <button className={styles.menuItem} onClick={() => setSubScreen('misDatos')}>
                <span className={styles.menuIcon}>👤</span>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>Mis datos</span>
                  <span className={styles.menuSub}>Información personal y de contacto</span>
                </div>
                <span className={styles.menuArrow}>→</span>
              </button>

              <button className={styles.menuItem} onClick={() => setSubScreen('misPedidos')}>
                <span className={styles.menuIcon}>📦</span>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>Mis Pedidos</span>
                  <span className={styles.menuSub}>Historial de compras y entregas</span>
                </div>
                <span className={styles.menuArrow}>→</span>
              </button>

              <button className={styles.menuItem} onClick={() => setSubScreen('direccion')}>
                <span className={styles.menuIcon}>📍</span>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>Dirección de envío</span>
                  <span className={styles.menuSub}>Agrega o edita tu dirección</span>
                </div>
                <span className={styles.menuArrow}>→</span>
              </button>
            </div>

            {/* Biptics */}
            <div className={styles.menuSection}>
              <p className={styles.menuTitle}>Biptics</p>

              <button className={styles.menuItem} onClick={() => setScreen('cart')}>
                <span className={styles.menuIcon}>🛒</span>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>Mi carrito</span>
                  <span className={styles.menuSub}>{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}</span>
                </div>
                <span className={styles.menuArrow}>→</span>
              </button>

              <button className={styles.menuItem} onClick={() => setScreen('support')}>
                <span className={styles.menuIcon}>🤖</span>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>Soporte IA</span>
                  <span className={styles.menuSub}>Diagnóstico remoto 24/7</span>
                </div>
                <span className={styles.menuArrow}>→</span>
              </button>

              <button className={styles.menuItem} onClick={() => setScreen('shop')}>
                <span className={styles.menuIcon}>⚡</span>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>Tienda Biptics</span>
                  <span className={styles.menuSub}>Wallboxes y accesorios EV</span>
                </div>
                <span className={styles.menuArrow}>→</span>
              </button>
            </div>

            {/* Legal */}
            <div className={styles.menuSection}>
              <p className={styles.menuTitle}>Legal</p>
              <a href="/privacidad" target="_blank" rel="noopener noreferrer" className={styles.menuItem}>
                <span className={styles.menuIcon}>🔒</span>
                <div className={styles.menuContent}>
                  <span className={styles.menuLabel}>Política de Privacidad</span>
                  <span className={styles.menuSub}>Ley 1581 de 2012 — Habeas Data</span>
                </div>
                <span className={styles.menuArrow}>→</span>
              </a>
            </div>

            <button className={styles.signOutBtn} onClick={handleSignOut}>
              Cerrar sesión
            </button>
            <div style={{ height: 100 }} />
          </>
        ) : (
          <div className={styles.guestState}>
            <div className={styles.guestIcon}>👤</div>
            <h3 className={styles.guestTitle}>¡Bienvenido a Biptics!</h3>
            <p className={styles.guestSub}>Inicia sesión para gestionar tu cargador, ver tu historial y acceder al soporte IA.</p>
            <button className={styles.loginBtn} onClick={() => setScreen('login')}>Iniciar sesión</button>
            <button className={styles.registerBtn} onClick={() => setScreen('login')}>Crear cuenta gratis</button>
          </div>
        )}
      </div>
    </div>
  )
}
