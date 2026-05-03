'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Login.module.css'

export default function LoginScreen() {
  const { activeScreen, setScreen, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAppStore()
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isActive = activeScreen === 'login'

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)
    await signInWithGoogle()
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!email || !password) { setError('Completa todos los campos'); return }
    setLoading(true)
    setError(null)
    const result = isRegister
      ? await signUpWithEmail(name, email, password)
      : await signInWithEmail(email, password)
    if (result.error) setError(result.error)
    setLoading(false)
  }

  return (
    <div className={`${styles.login} ${isActive ? styles.active : ''}`}>
      <div className={styles.backRow}>
        <button className={styles.backBtn} onClick={() => setScreen('home')}>←</button>
      </div>
      <div className={styles.content}>
        <div className={styles.logoBox}>⚡</div>
        <h2 className={styles.title}>Bienvenido a Biptics</h2>
        <p className={styles.sub}>Inicia sesión para gestionar tu cargador y acceder al soporte IA.</p>

        <button
          className={styles.googleBtn}
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {loading ? 'Conectando...' : 'Continuar con Google'}
        </button>

        <div className={styles.divider}><span>o ingresa con tu cuenta Biptics</span></div>

        {error && <div className={styles.errorMsg}>⚠ {error}</div>}

        <div className={styles.form}>
          {isRegister && (
            <div className={styles.fieldWrap}>
              <label className={styles.label}>Nombre</label>
              <input type="text" placeholder="Tu nombre" className={styles.input}
                value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Correo electrónico</label>
            <input type="email" placeholder="tu@correo.com" className={styles.input}
              value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={styles.fieldWrap}>
            <label className={styles.label}>Contraseña</label>
            <input type="password" placeholder="••••••••" className={styles.input}
              value={password} onChange={e => setPassword(e.target.value)} />
            {!isRegister && <p className={styles.forgot}>¿Olvidaste tu contraseña?</p>}
          </div>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Cargando...' : isRegister ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </div>

        <p className={styles.switchLink}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
          <span onClick={() => { setIsRegister(!isRegister); setError(null) }}>
            {isRegister ? 'Ingresar' : 'Crear cuenta gratis'}
          </span>
        </p>
        <p className={styles.terms}>
          Al continuar aceptas los <span>Términos</span> y la <span>Política de privacidad</span>
        </p>
      </div>
    </div>
  )
}
