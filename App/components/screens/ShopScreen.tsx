'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Shop.module.css'

const FILTERS = ['Todos', 'Wallboxes', 'Cables', 'Adaptadores', 'Diagnóstico']

const PRODUCTS = [
  {
    badge: '⭐ TOP', emoji: '⚡', cat: 'Cargador AC',
    name: 'Wallbox 7.4kW Monofásico Tipo 2',
    specs: ['7.4 kW', '32A', 'OCPP 1.6', 'IP54'],
    stars: 5, reviews: 127, stock: '16 unidades en stock',
    price: '$1.250.000', iva: '✓ IVA 5% · Ley 1964',
    note: '+ Instalación desde $350.000',
  },
  {
    badge: '', emoji: '⚡⚡', cat: 'Cargador AC',
    name: 'Wallbox 11kW Trifásico Tipo 2',
    specs: ['11 kW', '16A 3F', 'OCPP 1.6', 'IP55'],
    stars: 5, reviews: 43, stock: '3 unidades · Kia · Volvo · Tesla',
    price: '$1.850.000', iva: '✓ IVA 5% · Ley 1964',
    note: 'Red trifásica 380V requerida',
  },
  {
    badge: '', emoji: '🔌', cat: 'Cable de Carga',
    name: 'Cable Tipo 2 a Tipo 2 — 7m / 32A',
    specs: ['T2-T2', '7 metros', '32A'],
    stars: 4, reviews: 89, stock: 'Disponible · Todos los EVs T2',
    price: '$320.000', iva: '✓ IVA 5% incluido',
    note: '',
  },
  {
    badge: '', emoji: '🔧', cat: 'Diagnóstico',
    name: 'Scanner OBD2 EV Multimarca',
    specs: ['BYD', 'Kia', 'Chery', 'Volvo'],
    stars: 5, reviews: 12, stock: 'Disponible',
    price: '$450.000', iva: 'IVA 19%',
    note: 'Campo + soporte remoto',
  },
]

export default function ShopScreen() {
  const { activeScreen, addToCart } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [added, setAdded] = useState<Record<number, boolean>>({})

  const isActive = activeScreen === 'shop'

  const handleAdd = (i: number) => {
    setAdded((prev) => ({ ...prev, [i]: true }))
    addToCart()
  }

  return (
    <div className={`${styles.shop} ${isActive ? styles.active : ''}`}>
      <div className={styles.statusBar}><span>9:41</span><span>●●● 100%</span></div>

      <div className={styles.header}>
        <h2 className={styles.title}>Tienda ⚡</h2>
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
          <span className={styles.count}>8 productos · IVA 5% Ley 1964</span>
          <button className={styles.sortBtn}>Precio ↕</button>
        </div>

        {PRODUCTS.map((p, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.img}>
                {p.badge && <span className={styles.badge}>{p.badge}</span>}
                {p.emoji}
              </div>
              <div className={styles.info}>
                <p className={styles.cat}>{p.cat}</p>
                <p className={styles.name}>{p.name}</p>
                <div className={styles.specs}>
                  {p.specs.map((s) => <span key={s} className={styles.chip}>{s}</span>)}
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
                className={`${styles.addBtn} ${added[i] ? styles.addedBtn : ''}`}
                onClick={() => handleAdd(i)}
              >
                {added[i] ? '✓ Listo' : 'Agregar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
