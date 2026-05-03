'use client'
import { useAppStore } from '@/lib/store/useAppStore'
import Controls       from '@/components/layout/Controls'
import BottomNav      from '@/components/layout/BottomNav'
import SplashScreen   from '@/components/screens/SplashScreen'
import HomeScreen     from '@/components/screens/HomeScreen'
import ShopScreen     from '@/components/screens/ShopScreen'
import LoginScreen    from '@/components/screens/LoginScreen'
import MapScreen      from '@/components/screens/MapScreen'
import SupportScreen  from '@/components/screens/SupportScreen'
import styles from './App.module.css'

const SCREEN_LABELS: Record<string, string> = {
  splash:  '① Splash Screen',
  home:    '② Home · Dashboard',
  shop:    '③ Tienda · Catálogo',
  login:   '④ Login · Autenticación',
  map:     '⑤ Mapa · Electrolineras',
  support: '⑥ Soporte IA · Agente',
}

export default function AppPage() {
  const { activeScreen, theme } = useAppStore()
  const hideNav = activeScreen === 'splash' || activeScreen === 'login'

  return (
    <main className={styles.shell}>
      <Controls />
      <div className={styles.phoneWrap}>
        <div className={styles.phone}>
          <SplashScreen  />
          <HomeScreen    />
          <ShopScreen    />
          <LoginScreen   />
          <MapScreen     />
          <SupportScreen />
          {!hideNav && <BottomNav />}
        </div>
      </div>
      <p className={styles.screenLabel}>
        {SCREEN_LABELS[activeScreen]} · Modo {theme === 'dark' ? 'Oscuro' : 'Claro'}
      </p>
    </main>
  )
}
