'use client'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Map.module.css'

const FILTERS = ['Todos', 'DC Rápido', 'AC Nivel 2', 'Disponibles', '24 horas']

const STATIONS = [
  { name: 'CC Andino — Chico', address: 'Cl. 82 #11-37, Bogotá', chips: ['AC 22kW', '4 pts', '24h'], dist: '0.8 km · ~12 min', busy: false, lng: -74.0527, lat: 4.6664 },
  { name: 'WBC Usaquén', address: 'Cr 6 #119-24, Usaquén', chips: ['DC 50kW', '2 pts'], dist: '1.4 km · ~5 min', busy: false, lng: -74.0523, lat: 4.6952 },
  { name: 'Salitre Plaza', address: 'Cr 68B #40-45, Salitre', chips: ['AC 11kW', '6 pts'], dist: '2.1 km · ~8 min', busy: true, lng: -74.1058, lat: 4.6567 },
  { name: 'Centro Comercial Gran Estación', address: 'Av. Cl. 26 #62-47, Bogotá', chips: ['DC 50kW', 'AC 22kW', '24h'], dist: '3.2 km · ~10 min', busy: false, lng: -74.1089, lat: 4.6476 },
  { name: 'CC Santa Fe', address: 'Av. El Dorado #69-71, Bogotá', chips: ['AC 11kW', '3 pts'], dist: '4.1 km · ~15 min', busy: false, lng: -74.1129, lat: 4.6583 },
]

export default function MapScreen() {
  const { activeScreen, theme } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const isActive = activeScreen === 'map'

  useEffect(() => {
    if (!isActive || mapRef.current || !mapContainer.current) return

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: theme === 'dark'
          ? 'mapbox://styles/mapbox/dark-v11'
          : 'mapbox://styles/mapbox/streets-v12',
        center: [-74.0721, 4.7110],
        zoom: 11,
      })

      mapRef.current = map

      // Agregar controles de navegación
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Agregar marcadores de electrolineras
      STATIONS.forEach(station => {
        const el = document.createElement('div')
        el.style.cssText = `
          width: 28px; height: 28px;
          border-radius: 50%;
          background: ${station.busy ? '#FF6B35' : '#22D3A5'};
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
        `
        el.innerHTML = '⚡'

        new mapboxgl.Marker({ element: el })
          .setLngLat([station.lng, station.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div style="font-family: sans-serif; padding: 4px;">
                <strong style="font-size: 13px;">${station.name}</strong><br/>
                <span style="font-size: 11px; color: #64748B;">${station.address}</span><br/>
                <span style="font-size: 11px; color: ${station.busy ? '#FF6B35' : '#22D3A5'};">
                  ${station.busy ? '🔴 Ocupado' : '🟢 Disponible'}
                </span>
              </div>
            `)
          )
          .addTo(map)
      })

      // Ubicación del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { longitude, latitude } = pos.coords
          map.flyTo({ center: [longitude, latitude], zoom: 13 })

          new mapboxgl.Marker({ color: '#1565C0' })
            .setLngLat([longitude, latitude])
            .addTo(map)
        })
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isActive, theme])

  return (
    <div className={`${styles.map} ${isActive ? styles.active : ''}`}>
      <div className={styles.statusBar}><span>9:41</span><span>●●● 100%</span></div>

      <div className={styles.header}>
        <h2 className={styles.title}>Electrolineras 📍</h2>
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

      <div className={styles.mapArea}>
        {/* Mapa Mapbox */}
        <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />

        <div className={styles.gradientOverlay} />

        <div className={styles.overlay}>
          <div className={styles.stationCards}>
            {STATIONS.map((s, i) => (
              <div key={i} className={styles.stationCard} onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({ center: [s.lng, s.lat], zoom: 15 })
                }
              }}>
                <div className={styles.stHeader}>
                  <p className={styles.stName}>{s.name}</p>
                  <div className={`${styles.stDot} ${s.busy ? styles.busy : ''}`} />
                </div>
                <p className={styles.stAddress}>{s.address}</p>
                <div className={styles.stChips}>
                  {s.chips.map((c) => (
                    <span key={c} className={`${styles.chip} ${c.includes('kW') ? styles.fastChip : ''}`}>{c}</span>
                  ))}
                </div>
                <p className={styles.stDist}>📍 {s.dist}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
