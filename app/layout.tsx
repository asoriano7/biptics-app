import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Biptics — Smart EV Charging Colombia',
  description: 'Cargadores residenciales, mapa de electrolineras y soporte IA para vehículos eléctricos en Colombia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AuthProvider>
          <main style={{ flex: 1, paddingBottom: '60px' }}>
            {children}
          </main>
          <footer style={{
            backgroundColor: '#1E3A5F',
            borderTop: '3px solid #00B4D8',
            padding: '16px 24px',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: 13, color: '#94A3B8' }}>
              © 2026 Biptics — Smart EV Charging Colombia
              {' · '}
              <a
                href="/privacidad"
                style={{ color: '#00B4D8', textDecoration: 'none' }}
              >
                Política de Privacidad
              </a>
            </p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
