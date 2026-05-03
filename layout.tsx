import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Biptics — Smart EV Charging Colombia',
  description: 'Cargadores residenciales, mapa de electrolineras y soporte IA para vehículos eléctricos en Colombia.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}
