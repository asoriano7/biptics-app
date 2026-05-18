'use client'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Home.module.css'

const PRODUCTS = [
  { emoji: '⚡',  tag: '⭐ Top ventas',      name: 'Wallbox 7kW Tipo 2',    price: '$1.250.000' },
  { emoji: '⚡⚡', tag: 'Alto rendimiento',    name: 'Wallbox 11kW Tipo 2',   price: '$1.850.000' },
  { emoji: '🔌',  tag: 'Accesorio clave',     name: 'Cable T2-T2 7m / 32A', price: '$320.000' },
  { emoji: '🔧',  tag: 'Diagnóstico Pro',     name: 'Scanner OBD2 EV',       price: '$450.000' },
]

export default function HomeScreen() {
  const { activeScreen, setScreen } = useAppStore()
  const isActive = activeScreen === 'home'

  return (
    <div className={`${styles.home} ${isActive ? styles.active : ""}`}>
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>9:41</span><span>●●● 100%</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.greeting}>
          Hola, <span className={styles.name}>Alex</span> 👋
        </h2>
        <p className={styles.sub}>Bienvenido a Biptics</p>
      </div>

      {/* Search */}
      <div className={styles.search}>
        <span className={styles.searchIcon}>🔍</span>
        <span className={styles.searchTxt}>Buscar productos o electrolineras...</span>
      </div>

      {/* Scroll area */}
      <div className={styles.scrollArea}>

        {/* BLOQUE 1 — Más vendidos */}
        <p className={styles.sectionTitle}>Más vendidos ⚡</p>
        <div className={styles.productCarousel}>
          {PRODUCTS.map((p) => (
            <div key={p.name} className={styles.productCard} onClick={() => setScreen('shop')}>
              <div className={styles.productImg}>{p.emoji}</div>
              <span className={styles.productTag}>{p.tag}</span>
              <p className={styles.productName}>{p.name}</p>
              <p className={styles.productPrice}>{p.price}</p>
            </div>
          ))}
        </div>

        {/* BLOQUE 2 — Mapa */}
        <div className={styles.sectionBlock} onClick={() => setScreen('map')}>
          <div className={styles.blockText}>
            <p className={styles.blockEyebrow}>📍 Electrolineras</p>
            <h3 className={styles.blockTitle}>¿Buscas dónde recargar tu auto cerca de ti?</h3>
            <p className={styles.blockSub}>Encuentra estaciones disponibles en tiempo real en toda Colombia.</p>
            <p className={styles.blockCta}>Ver mapa <span className={styles.arrow}>→</span></p>
          </div>
          <div className={styles.mapPreview}>
            <svg width="110" height="90" viewBox="0 0 110 90" xmlns="http://www.w3.org/2000/svg">
              <rect width="110" height="90" rx="12" fill="var(--map-preview-bg)"/>
              <line x1="0" y1="30" x2="110" y2="30" stroke="var(--map-preview-grid)" strokeWidth="1"/>
              <line x1="0" y1="60" x2="110" y2="60" stroke="var(--map-preview-grid)" strokeWidth="1"/>
              <line x1="36" y1="0" x2="36" y2="90" stroke="var(--map-preview-grid)" strokeWidth="1"/>
              <line x1="73" y1="0" x2="73" y2="90" stroke="var(--map-preview-grid)" strokeWidth="1"/>
              <line x1="0" y1="18" x2="110" y2="40" stroke="var(--map-preview-road)" strokeWidth="2.5"/>
              <line x1="45" y1="0" x2="40" y2="90" stroke="var(--map-preview-road)" strokeWidth="2.5"/>
              <circle cx="52" cy="28" r="8" fill="rgba(34,211,165,0.2)"/>
              <circle cx="52" cy="28" r="5" fill="#22D3A5"/>
              <circle cx="80" cy="55" r="8" fill="rgba(0,180,216,0.2)"/>
              <circle cx="80" cy="55" r="5" fill="#00B4D8"/>
              <circle cx="25" cy="62" r="8" fill="rgba(255,107,53,0.2)"/>
              <circle cx="25" cy="62" r="5" fill="#FF6B35"/>
              <circle cx="65" cy="18" r="8" fill="rgba(34,211,165,0.2)"/>
              <circle cx="65" cy="18" r="5" fill="#22D3A5"/>
              <circle cx="50" cy="48" r="7" fill="rgba(21,101,192,0.3)"/>
              <circle cx="50" cy="48" r="4" fill="#1565C0"/>
              <circle cx="50" cy="48" r="2" fill="white"/>
            </svg>
          </div>
        </div>

        {/* BLOQUE 3 — Soporte IA */}
        <div className={`${styles.sectionBlock} ${styles.aiBlock}`} onClick={() => setScreen('support')}>
          <div className={styles.blockText}>
            <p className={`${styles.blockEyebrow} ${styles.greenEyebrow}`}>🤖 IA 24/7</p>
            <h3 className={styles.blockTitle}>¿Necesitas soporte para tu auto eléctrico?</h3>
            <p className={styles.blockSub}>Diagnóstico remoto, errores del wallbox y consultas técnicas al instante.</p>
            <p className={`${styles.blockCta} ${styles.greenCta}`}>Chatear con IA <span className={styles.arrow}>→</span></p>
          </div>
          <div className={styles.aiPreview}>
            <div className={`${styles.aiBubble} ${styles.botBubble}`}>¡Hola! ¿En qué te ayudo? ⚡</div>
            <div className={`${styles.aiBubble} ${styles.userBubble}`}>Mi wallbox no carga</div>
            <div className={`${styles.aiBubble} ${styles.botBubble}`}>Error E-04 detectado 🔍</div>
          </div>
        </div>

        {/* BLOQUE 4 — Tips */}
        <p className={styles.sectionTitle} style={{ marginTop: 4 }}>Tips Biptics</p>
        <div className={styles.tipCard}>
          <div className={styles.tipIcon} style={{ background: 'rgba(0,180,216,.12)' }}>💡</div>
          <div>
            <p className={styles.tipTitle}>Carga en hora valle y ahorra</p>
            <p className={styles.tipSub}>Entre 10pm y 6am la tarifa baja hasta 35%</p>
          </div>
        </div>
        <div className={styles.tipCard}>
          <div className={styles.tipIcon} style={{ background: 'rgba(34,211,165,.12)' }}>📊</div>
          <div>
            <p className={styles.tipTitle}>BYD lidera con 52% del mercado</p>
            <p className={styles.tipSub}>8.045 unidades vendidas en Colombia 2025</p>
          </div>
        </div>

        {/* FOOTER — Política de Privacidad */}
        <div style={{
          marginTop: 24,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
          paddingBottom: 8,
        }}>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted, #64748B)' }}>
            © 2026 Biptics · {' '}
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00B4D8', textDecoration: 'none', fontSize: 11 }}
            >
              Política de Privacidad
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}
