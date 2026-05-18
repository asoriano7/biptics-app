'use client'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Cart.module.css'

export default function CartScreen() {
  const { activeScreen, cartItems, removeFromCart, updateQuantity, setScreen, clearCart } = useAppStore()
  const isActive = activeScreen === 'cart'

  const subtotal = cartItems.reduce((acc, i) => acc + i.product.priceNum * i.quantity, 0)
  const iva = Math.round(subtotal * 0.05)
  const total = subtotal + iva

  const fmt = (n: number) =>
    '$' + n.toLocaleString('es-CO', { minimumFractionDigits: 0 })

  return (
    <div className={`${styles.cart} ${isActive ? styles.active : ''}`}>
      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>9:41</span><span>●●● 100%</span>
      </div>

      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => setScreen('shop')}>
          ← Tienda
        </button>
        <h2 className={styles.title}>Mi Carrito</h2>
        {cartItems.length > 0 && (
          <button className={styles.clearBtn} onClick={clearCart}>Vaciar</button>
        )}
      </div>

      {/* Contenido */}
      {cartItems.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🛒</div>
          <p className={styles.emptyTitle}>Tu carrito está vacío</p>
          <p className={styles.emptySub}>Agrega productos desde la tienda</p>
          <button className={styles.shopBtn} onClick={() => setScreen('shop')}>
            Ver productos ⚡
          </button>
        </div>
      ) : (
        <>
          <div className={styles.scroll}>
            {cartItems.map((item) => (
              <div key={item.product.id} className={styles.item}>
                <div className={styles.itemImg}>{item.product.emoji}</div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemCat}>{item.product.cat}</p>
                  <p className={styles.itemName}>{item.product.name}</p>
                  <p className={styles.itemPrice}>{item.product.price}</p>
                  <p className={styles.itemIva}>{item.product.iva}</p>
                </div>
                <div className={styles.itemControls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >−</button>
                  <span className={styles.qty}>{item.quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >+</button>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFromCart(item.product.id)}
                  >🗑️</button>
                </div>
              </div>
            ))}

            {/* Resumen */}
            <div className={styles.summary}>
              <p className={styles.summaryTitle}>Resumen del pedido</p>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>IVA 5% · Ley 1964</span>
                <span>{fmt(iva)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Envío</span>
                <span className={styles.free}>Por confirmar</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>

            {/* Info instalación */}
            <div className={styles.installNote}>
              <span>🔧</span>
              <p>La instalación se agenda por separado con nuestro técnico certificado RETIE 2024.</p>
            </div>

            <div style={{ height: 100 }} />
          </div>

          {/* Checkout botón */}
          <div className={styles.actions}>
            <div className={styles.totalPreview}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>{fmt(total)}</span>
            </div>
            <button
              className={styles.checkoutBtn}
              onClick={() => setScreen('login')}
            >
              Continuar → Pagar
            </button>
          </div>
        </>
      )}
    </div>
  )
}
