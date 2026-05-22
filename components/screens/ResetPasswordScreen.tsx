'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Login.module.css'

export default function ResetPasswordScreen() {
  const { activeScreen, setScreen } = useAppStore()
  const isActive = activeScreen === 'resetPassword'
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async () => {
    if (!password || !confirm) { setError('Completa todos los campos'); return }
    if (password.length < 6) { setError('La contraseña debe tener mínimo 6 caracteres'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div className={`${styles.login} ${isActive ? styles.active : ''}`}>
      <div className={styles.backRow}>
        <button className={styles.backBtn} onClick={() => setScreen('login')}>←</button>
      </div>
      <div className={styles.content}>
        <div className={styles.logoBox}>⚡</div>
        <h2 className={styles.title}>Nueva contraseña</h2>
        <p className={styles.sub}>Ingresa y confirma tu nueva contraseña para Biptics.</p>

        {success ? (
          <>
            <div className={styles.successMsg}>
              ✅ ¡Contraseña actualizada correctamente!
            </div>
            <button className={styles.submitBtn} onClick={() => setScreen('home')}>
              Ir a Biptics →
            </button>
          </>
        ) : (
          <div className={styles.form}>
            {error && <div className={styles.errorMsg}>⚠ {error}</div>}

            <div className={styles.fieldWrap}>
              <label className={styles.label}>Nueva contraseña</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                className={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.fieldWrap}>
              <label className={styles.label}>Confirmar contraseña</label>
              <input
                type="password"
                placeholder="Repite tu nueva contraseña"
                className={styles.input}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
              />
            </div>

            <button className={styles.submitBtn} onClick={handleReset} disabled={loading}>
              {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
