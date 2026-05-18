'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './ProductDetail.module.css'

export default function ProductDetailScreen() {
  const { activeScreen, selectedProduct, setScreen, addToCart } = useAppStore()
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'specs' | 'compatible' | 'info'>('specs')

  const isActive = activeScreen === 'product'
  const p = selectedProduct

  if (!p) return null

  const handleAdd = () => {
    addToCart(p)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    addToCart(p)
    setScreen('cart')
  }

  return (
    <div className={`${styles.detail} ${isActive ? styles.active : ''}`}>
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>9:41</span><span>●●● 100%</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => setScreen('shop')}>
          ← Tienda
        </button>
        <button className={styles.cartBtn} onClick={() => setScreen('cart')}>
          🛒
        </button>
      </div>

      {/* Scroll content */}
      <div className={styles.scroll}>

        {/* Hero imagen */}
        <div className={styles.hero}>
          {p.badge && <span className={styles.heroBadge}>{p.badge}</span>}
          <div className={styles.heroEmoji}>{p.emoji}</div>
          <span className={styles.heroIva}>{p.iva}</span>
        </div>

        {/* Info principal */}
        <div className={styles.main}>
          <p className={styles.cat}>{p.cat}</p>
          <h1 className={styles.name}>{p.name}</h1>

          {/* Rating */}
          <div className={styles.rating}>
            <span className={styles.stars}>{'★'.repeat(p.stars)}{'☆'.repeat(5 - p.stars)}</span>
            <span className={styles.reviews}>{p.reviews} reseñas</span>
            <span className={styles.stock}>· ✓ {p.stock}</span>
          </div>

          {/* Precio */}
          <div className={styles.priceRow}>
            <span className={styles.price}>{p.price}</span>
            <span className={styles.ivaTag}>{p.iva}</span>
          </div>
          {p.note && <p className={styles.note}>📌 {p.note}</p>}
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {(['specs', 'compatible', 'info'] as const).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'specs' ? 'Especificaciones' : tab === 'compatible' ? 'Compatible con' : 'Info legal'}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.tabContent}>
          {activeTab === 'specs' && (
            <div className={styles.specsList}>
              {p.specs.map((s) => (
                <div key={s} className={styles.specItem}>
                  <span className={styles.specDot}>⚡</span>
                  <span className={styles.specText}>{s}</span>
                </div>
              ))}
              <div className={styles.specItem}>
                <span className={styles.specDot}>📡</span>
                <span className={styles.specText}>OCPP 1.6 — monitoreo remoto</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specDot}>🔒</span>
                <span className={styles.specText}>Certificación CE, RoHS, IEC 61851</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specDot}>🛡️</span>
                <span className={styles.specText}>Garantía 12 meses</span>
              </div>
            </div>
          )}

          {activeTab === 'compatible' && (
            <div className={styles.compatList}>
              {p.compatible.map((c) => (
                <div key={c} className={styles.compatItem}>
                  <span className={styles.compatIcon}>🚗</span>
                  <span className={styles.compatText}>{c}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'info' && (
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <span className={styles.infoTitle}>IVA preferencial 5%</span>
                <p className={styles.infoText}>Aplica Ley 1964 de 2019 — Movilidad Eléctrica. El cliente ahorra 14% vs IVA normal del 19%.</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoTitle}>Instalación RETIE 2024</span>
                <p className={styles.infoText}>Toda instalación incluye declaración de conformidad firmada por técnico matriculado ante CONTE o COPNIA.</p>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoTitle}>Garantía</span>
                <p className={styles.infoText}>12 meses desde la instalación. Reposición o reembolso para unidades defectuosas en Colombia.</p>
              </div>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div className={styles.desc}>
          <p className={styles.descTitle}>Descripción</p>
          <p className={styles.descText}>{p.description}</p>
        </div>

        {/* Instalación CTA */}
        <div className={styles.installCard}>
          <div>
            <p className={styles.installTitle}>¿Necesitas instalación?</p>
            <p className={styles.installSub}>Técnico certificado RETIE 2024 · Bogotá D.C.</p>
          </div>
          <button className={styles.installBtn} onClick={() => setScreen('support')}>
            Agendar →
          </button>
        </div>

        {/* Spacer para los botones flotantes */}
        <div style={{ height: 100 }} />
      </div>

      {/* Botones flotantes */}
      <div className={styles.actions}>
        <button
          className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
          onClick={handleAdd}
        >
          {added ? '✓ Agregado' : 'Agregar al carrito'}
        </button>
        <button className={styles.buyBtn} onClick={handleBuyNow}>
          Comprar ahora
        </button>
      </div>
    </div>
  )
}
