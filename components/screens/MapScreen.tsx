'use client'
import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Map.module.css'

const FILTERS = ['Todos', 'DC Rápido', 'AC Nivel 2', 'Disponibles', '24 horas']

const STATIONS = [
  // Bogotá
  { name: 'CC Andino — Chico', address: 'Cl. 82 #11-37, Bogotá', chips: ['AC 22kW', '4 pts', '24h'], busy: false, lng: -74.0527, lat: 4.6664, city: 'Bogotá' },
  { name: 'WBC Usaquén', address: 'Cr 6 #119-24, Usaquén', chips: ['DC 50kW', '2 pts'], busy: false, lng: -74.0523, lat: 4.6952, city: 'Bogotá' },
  { name: 'Salitre Plaza', address: 'Cr 68B #40-45, Salitre', chips: ['AC 11kW', '6 pts'], busy: true, lng: -74.1058, lat: 4.6567, city: 'Bogotá' },
  { name: 'Gran Estación', address: 'Av. Cl. 26 #62-47, Bogotá', chips: ['DC 50kW', 'AC 22kW', '24h'], busy: false, lng: -74.1089, lat: 4.6476, city: 'Bogotá' },
  { name: 'CC Santa Fe', address: 'Av. El Dorado #69-71, Bogotá', chips: ['AC 11kW', '3 pts'], busy: false, lng: -74.1129, lat: 4.6583, city: 'Bogotá' },
  // Medellín
  { name: 'CC El Tesoro', address: 'Cl. 9 Sur #31-111, Medellín', chips: ['DC 50kW', '2 pts', '24h'], busy: false, lng: -75.5673, lat: 6.1772, city: 'Medellín' },
  { name: 'Santafé Medellín', address: 'Cl. 27A #43A-50, Medellín', chips: ['AC 22kW', '4 pts'], busy: true, lng: -75.5814, lat: 6.2013, city: 'Medellín' },
  // Cali
  { name: 'Jardín Plaza Cali', address: 'Cl. 16 Norte #100-00, Cali', chips: ['DC 50kW', 'AC 11kW'], busy: false, lng: -76.5225, lat: 3.4516, city: 'Cali' },
  { name: 'CC Palmetto Cali', address: 'Cr 100 #11-60, Cali', chips: ['AC 22kW', '2 pts'], busy: false, lng: -76.5541, lat: 3.3722, city: 'Cali' },
  // Barranquilla
  { name: 'Buenavista Barranquilla', address: 'Cr 53 #98-99, Barranquilla', chips: ['DC 50kW', '2 pts'], busy: false, lng: -74.7936, lat: 11.0041, city: 'Barranquilla' },
  { name: 'CC Portal del Prado', address: 'Cr 46 #76-201, Barranquilla', chips: ['AC 11kW', '3 pts'], busy: true, lng: -74.8134, lat: 10.9878, city: 'Barranquilla' },
]

const CITIES = [
  { name: 'Mi ubicación', lng: null, lat: null },
  { name: 'Bogotá', lng: -74.0721, lat: 4.7110 },
  { name: 'Medellín', lng: -75.5812, lat: 6.2518 },
  { name: 'Cali', lng: -76.5225, lat: 3.4516 },
  { name: 'Barranquilla', lng: -74.7936, lat: 11.0041 },
]

// Calcular distancia entre dos puntos (km)
function calcDist(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
}

export default function MapScreen() {
  const { activeScreen, theme } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [selectedCity, setSelectedCity] = useState('Mi ubicación')
  const [userLocation, setUserLocation] = useState<{lng: number, lat: number} | null>(null)
  const [stations, setStations] = useState(STATIONS)
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
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
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Agregar marcadores
      const addMarkers = (stationList: typeof STATIONS) => {
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []

        stationList.forEach(station => {
          const el = document.createElement('div')
          el.style.cssText = `
            width: 32px; height: 32px;
            border-radius: 50%;
            background: ${station.busy ? '#FF6B35' : '#22D3A5'};
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px;
            transition: transform 0.2s;
          `
          el.innerHTML = '⚡'
          el.onmouseenter = () => el.style.transform = 'scale(1.2)'
          el.onmouseleave = () => el.style.transform = 'scale(1)'

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([station.lng, station.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
                <div style="font-family: 'Sora', sans-serif; padding: 8px; min-width: 180px;">
                  <strong style="font-size: 13px; color: #1E3A5F;">${station.name}</strong><br/>
                  <span style="font-size: 11px; color: #64748B;">${station.address}</span><br/>
                  <div style="margin-top: 6px;">
                    ${station.chips.map(c => `<span style="background: #f1f5f9; border-radius: 4px; padding: 2px 6px; font-size: 10px; margin-right: 4px;">${c}</span>`).join('')}
                  </div>
                  <div style="margin-top: 6px; font-size: 11px; color: ${station.busy ? '#FF6B35' : '#22D3A5'}; font-weight: 600;">
                    ${station.busy ? '🔴 Ocupado' : '🟢 Disponible'}
                  </div>
                  <a href="https://maps.google.com/?q=${station.lat},${station.lng}" target="_blank"
                    style="display: block; margin-top: 8px; font-size: 11px; color: #00B4D8; font-weight: 600; text-decoration: none;">
                    🧭 Cómo llegar →
                  </a>
                </div>
              `)
            )
            .addTo(map)

          markersRef.current.push(marker)
        })
      }

      addMarkers(STATIONS)

      // Ubicación del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { longitude, latitude } = pos.coords
          setUserLocation({ lng: longitude, lat: latitude })

          // Centrar en usuario con zoom que muestre contexto
          map.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            duration: 1500,
          })

          // Marcador usuario
          const userEl = document.createElement('div')
          userEl.style.cssText = `
            width: 20px; height: 20px;
            border-radius: 50%;
            background: #1565C0;
            border: 3px solid white;
            box-shadow: 0 0 0 6px rgba(21,101,192,0.2);
          `
          new mapboxgl.Marker({ element: userEl })
            .setLngLat([longitude, latitude])
            .addTo(map)

          // Calcular distancias reales
          const stationsWithDist = STATIONS.map(s => ({
            ...s,
            dist: `${calcDist(latitude, longitude, s.lat, s.lng)} km`
          }))
          // Ordenar por distancia
          stationsWithDist.sort((a, b) => parseFloat(a.dist) - parseFloat(b.dist))
          setStations(stationsWithDist)

        }, () => {
          // Sin permiso — quedarse en Bogotá
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

  // Filtrar estaciones
  const filteredStations = stations.filter(s => {
    if (activeFilter === 'DC Rápido') return s.chips.some(c => c.includes('DC'))
    if (activeFilter === 'AC Nivel 2') return s.chips.some(c => c.includes('AC'))
    if (activeFilter === 'Disponibles') return !s.busy
    if (activeFilter === '24 horas') return s.chips.includes('24h')
    return true
  })

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName)
    const city = CITIES.find(c => c.name === cityName)
    if (!city || !mapRef.current) return

    if (cityName === 'Mi ubicación' && userLocation) {
      mapRef.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 12, duration: 1000 })
    } else if (city.lng && city.lat) {
      mapRef.current.flyTo({ center: [city.lng, city.lat], zoom: 12, duration: 1000 })
    }
  }

  return (
    <div className={`${styles.map} ${isActive ? styles.active : ''}`}>
      <div className={styles.statusBar}><span>9:41</span><span>●●● 100%</span></div>

      <div className={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 className={styles.title} style={{ marginBottom: 0 }}>Electrolineras 📍</h2>
          <select
            value={selectedCity}
            onChange={e => handleCityChange(e.target.value)}
            style={{
              background: 'var(--bg-input)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '6px 10px', fontSize: 12,
              color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif',
              cursor: 'pointer'
            }}
          >
            {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
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

      <div className={styles.mapArea}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
        <div className={styles.gradientOverlay} />
        <div className={styles.overlay}>
          <div className={styles.stationCards}>
            {filteredStations.map((s, i) => (
              <div key={i} className={styles.stationCard} onClick={() => {
                if (mapRef.current) {
                  mapRef.current.flyTo({ center: [s.lng, s.lat], zoom: 15, duration: 800 })
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
