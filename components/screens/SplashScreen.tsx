'use client'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Splash.module.css'

export default function SplashScreen() {
  const { activeScreen, setScreen } = useAppStore()
  const isActive = activeScreen === 'splash'

  return (
    <div className={`${styles.splash} ${isActive ? styles.active : ""}`}>
      <div className={styles.glow1} />
      <div className={styles.glow2} />
      <div className={styles.rings}>
        <div className={styles.ring} />
        <div className={styles.ring} />
        <div className={styles.ring} />
      </div>

      <div className={styles.logoBox}>⚡</div>
      <h1 className={styles.brand}>
        Bi<span className={styles.brandAccent}>ptics</span>
      </h1>
      <p className={styles.tagline}>⚡ Smart EV Charging · Colombia</p>

      <div className={styles.cta}>
        <button
          className={styles.btnPrimary}
          onClick={() => setScreen('home')}
        >
          Comenzar
        </button>
        <p className={styles.signinLink}>
          ¿Ya tienes cuenta?{' '}
          <span onClick={() => setScreen('login')}>Ingresar</span>
        </p>
      </div>
    </div>
  )
}
