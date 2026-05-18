'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import type { Product } from '@/lib/store/useAppStore'
import styles from './Shop.module.css'

const FILTERS = ['Todos', 'Wallboxes', 'Cables', 'Adaptadores', 'Diagnóstico']

export const PRODUCTS: Product[] = [
  {
    id: 1,
    badge: '⭐ TOP', emoji: '⚡', cat: 'Cargador AC',
    name: 'Wallbox 7.4kW Monofásico Tipo 2',
    specs: ['7.4 kW', '32A monofásico', 'OCPP 1.6', 'IP54', 'WiFi integrado'],
    stars: 5, reviews: 127, stock: '16 unidades en stock',
    price: '$1.250.000', priceNum: 1250000,
    iva: '✓ IVA 5% · Ley 1964',
    note: '+ Instalación desde $350.000',
    description: 'El wallbox más vendido de Colombia. Compatible con el 90% de los vehículos eléctricos del mercado colombiano — BYD Yuan Up, Seagull, Chery iCAR y más. Red monofásica 220V estándar.',
    compatible: ['BYD Yuan Up', 'BYD Seagull', 'Chery iCAR 03', 'Renault Kwid E-Tech', 'Todos los EVs Tipo 2'],
  },
  {
    id: 2,
    badge: '', emoji: '⚡⚡', cat: 'Cargador AC',
    name: 'Wallbox 11kW Trifásico Tipo 2',
    specs: ['11 kW', '16A trifásico', 'OCPP 1.6', 'IP55', 'WiFi integrado'],
    stars: 5, reviews: 43, stock: '3 unidades · Kia · Volvo · Tesla',
    price: '$1.850.000', priceNum: 1850000,
    iva: '✓ IVA 5% · Ley 1964',
    note: 'Red trifásica 380V requerida',
    description: 'Para vehículos de alto rendimiento con OBC de 11kW. Requiere red eléctrica trifásica 380V en el hogar. Ideal para estratos 5-6 y primeros clientes comerciales.',
    compatible: ['Kia EV5', 'Kia EV6', 'Volvo EX30', 'Volvo C40', 'Tesla Model 3/Y', 'GAC Aion V', 'BYD Yuan Plus'],
  },
  {
    id: 3,
    badge: '', emoji: '🔌', cat: 'Cable de Carga',
    name: 'Cable Tipo 2 a Tipo 2 — 7m / 32A',
    specs: ['T2-T2', '7 metros', '32A', 'IP55'],
    stars: 4, reviews: 89, stock: 'Disponible · Todos los EVs T2',
    price: '$320.000', priceNum: 320000,
    iva: '✓ IVA 5% incluido',
    note: '',
    description: 'Cable de carga estándar para todos los vehículos eléctricos con conector Tipo 2. Longitud de 7 metros para garajes con mayor distancia entre tablero y vehículo.',
    compatible: ['Todos los EVs con conector Tipo 2', 'BYD', 'Kia', 'Volvo', 'Tesla', 'Chery', 'GAC'],
  },
  {
    id: 4,
    badge: '', emoji: '🔧', cat: 'Diagnóstico',
    name: 'Scanner OBD2 EV Multimarca',
    specs: ['BYD', 'Kia', 'Chery', 'Volvo', 'GAC'],
    stars: 5, reviews: 12, stock: 'Disponible',
    price: '$450.000', priceNum: 450000,
    iva: 'IVA 19%',
    note: 'Campo + soporte remoto',
    description: 'Scanner diagnóstico profesional para vehículos eléctricos multimarca. Lee códigos de error del BMS, batería, motor y sistema de carga. Usado por nuestros técnicos en campo.',
    compatible: ['BYD Yuan Up/Seagull/Plus', 'Chery iCAR 03', 'Kia EV5/EV6', 'Volvo EX30/C40', 'GAC Aion V/UT'],
  },
]

const FILTER_MAP: Record<string, string[]> = {
  'Todos': [],
  'Wallboxes': ['Cargador AC'],
  'Cables': ['Cable de Carga'],
  'Adaptadores': ['Adaptador'],
  'Diagnóstico': ['Diagnóstico'],
}

export default function ShopScreen() {
  const { activeScreen, cartCount, addToCart, setScreen, setSelectedProduct } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [added, setAdded] = useState<Record<number, boolean>>({})

  const isActive = activeScreen === 'shop'

  const filtered = activeFilter === 'Todos'
    ? PRODUCTS
    : PRODUCTS.filter((p) => FILTER_MAP[activeFilter]?.includes(p.cat))

  const handleAdd = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation()
    addToCart(p)
    setAdded((prev) => ({ ...prev, [p.id]: true }))
    setTimeout(() => setAdded((prev) => ({ ...prev, [p.id]: false })), 2000)
  }

  const handleCardClick = (p: Product) => {
    setSelectedProduct(p)
    setScreen('product')
  }

  return (
    <div className={`${styles.shop} ${isActive ? styles.active : ''}`}>
      <div className={styles.statusBar}><span>9:41</span><span>●●● 100%</span></div>

      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Tienda ⚡</h2>
          <button className={styles.cartIconBtn} onClick={() => setScreen('cart')}>
            🛒 {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>
        </div>
        <div className={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.pill} ${activeFilter === f ? styles.pillActive : ''}`}
              onClick={() => setActiveFilter(f)}
            >{f}</button>
          ))}
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.sortRow}>
          <span className={styles.count}>{filtered.length} productos · IVA 5% Ley 1964</span>
          <button className={styles.sortBtn}>Precio ↕</button>
        </div>

        {filtered.map((p) => (
          <div key={p.id} className={styles.card} onClick={() => handleCardClick(p)}>
            <div className={styles.cardTop}>
              <div className={styles.img}>
                {p.badge && <span className={styles.badge}>{p.badge}</span>}
                {p.emoji}
              </div>
              <div className={styles.info}>
                <p className={styles.cat}>{p.cat}</p>
                <p className={styles.name}>{p.name}</p>
                <div className={styles.specs}>
                  {p.specs.slice(0, 3).map((s) => <span key={s} className={styles.chip}>{s}</span>)}
                </div>
                <div className={styles.rating}>
                  <span className={styles.stars}>{'★'.repeat(p.stars)}{'☆'.repeat(5 - p.stars)}</span>
                  <span className={styles.reviews}>{p.reviews} reseñas</span>
                </div>
                <p className={styles.stock}>✓ {p.stock}</p>
              </div>
            </div>
            <div className={styles.cardBottom}>
              <div>
                <p className={styles.price}>{p.price}</p>
                <p className={styles.iva}>{p.iva}</p>
                {p.note && <p className={styles.note}>{p.note}</p>}
              </div>
              <button
                className={`${styles.addBtn} ${added[p.id] ? styles.addedBtn : ''}`}
                onClick={(e) => handleAdd(e, p)}
              >
                {added[p.id] ? '✓' : 'Agregar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
