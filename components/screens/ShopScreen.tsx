'use client'
import { useState, useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import type { Product } from '@/lib/store/useAppStore'
import styles from './Shop.module.css'

const FILTERS = ['Todos', 'Wallboxes', 'Cables', 'Adaptadores', 'Diagnóstico']

const FILTER_MAP: Record<string, string[]> = {
  'Todos': [],
  'Wallboxes': ['wallbox'],
  'Cables': ['cable'],
  'Adaptadores': ['adaptador'],
  'Diagnóstico': ['diagnostico'],
}

export default function ShopScreen() {
  const { activeScreen, cartCount, addToCart, setScreen, setSelectedProduct } = useAppStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [added, setAdded] = useState<Record<string, boolean>>({})

  const isActive = activeScreen === 'shop'

  useEffect(() => {
    fetch('/api/productos')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'Todos'
    ? products
    : products.filter((p) => FILTER_MAP[activeFilter]?.includes(p.cat))

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
        {loading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingDots}>
              <span /><span /><span />
            </div>
            <p className={styles.loadingText}>Cargando productos...</p>
          </div>
        ) : (
          <>
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
                      {p.specs.slice(0, 3).map((s, i) => (
                        <span key={i} className={styles.chip}>{s}</span>
                      ))}
                    </div>
                    <div className={styles.rating}>
                      <span className={styles.stars}>★★★★★</span>
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
                    className={`${styles.addBtn} ${added[p.id] ? styles.addedBtn : ''} ${!p.inStock ? styles.disabledBtn : ''}`}
                    onClick={(e) => handleAdd(e, p)}
                    disabled={!p.inStock}
                  >
                    {!p.inStock ? 'Agotado' : added[p.id] ? '✓' : 'Agregar'}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
