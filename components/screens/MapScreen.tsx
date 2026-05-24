'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Map.module.css'

const FILTERS = ['Todos', 'DC Rápido', 'AC Nivel 2', 'Disponibles', '24 horas']

const CITIES = [
  { name: 'Mi ubicación', lng: null as number | null, lat: null as number | null },
  { name: 'Bogotá', lng: -74.0721, lat: 4.7110 },
  { name: 'Medellín', lng: -75.5812, lat: 6.2518 },
  { name: 'Cali', lng: -76.5225, lat: 3.4516 },
  { name: 'Barranquilla', lng: -74.7936, lat: 11.0041 },
]

interface Station {
  name: string
  address: string
  chips: string[]
  busy: boolean
  lng: number
  lat: number
  city: string
  dist: string
  hasDC: boolean
  hasAC: boolean
  is24h: boolean
}

function calcDist(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1)
}

// Convertir datos de OpenChargeMap al formato de Biptics
function parseOCMStation(item: any, userLat?: number, userLng?: number): Station {
  const addr = item.AddressInfo
  const conns = item.Connections || []

  const hasDC = conns.some((c: any) => c.CurrentTypeID === 30)
  const hasAC = conns.some((c: any) => c.CurrentTypeID === 10 || c.CurrentTypeID === 20)
  const maxPower = Math.max(...conns.map((c: any) => c.PowerKW || 0))
  const numPoints = conns.length

  const chips: string[] = []
  if (hasDC) chips.push(`DC ${maxPower > 0 ? maxPower + 'kW' : 'Rápido'}`)
  if (hasAC) chips.push(`AC ${maxPower > 0 && !hasDC ? maxPower + 'kW' : ''}`.trim())
  if (numPoints > 0) chips.push(`${numPoints} pts`)

  const lat = addr.Latitude
  const lng = addr.Longitude
  const dist = userLat && userLng ? `${calcDist(userLat, userLng, lat, lng)} km` : ''

  return {
    name: addr.Title || 'Electrolinera',
    address: `${addr.AddressLine1 || ''}, ${addr.Town || ''}`.trim().replace(/^,|,$/g, ''),
    chips: chips.filter(Boolean),
    busy: item.StatusTypeID === 50,
    lng,
    lat,
    city: addr.Town || '',
    dist,
    hasDC,
    hasAC,
    is24h: false,
  }
}

export default function MapScreen() {
  const { activeScreen, theme } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [selectedCity, setSelectedCity] = useState('Mi ubicación')
  const [userLocation, setUserLocation] = useState<{lng: number, lat: number} | null>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(false)
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const isActive = activeScreen === 'map'

  const fetchStations = useCallback(async (lat: number, lng: number, userLat?: number, userLng?: number) => {
    setLoading(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_OCM_API_KEY
      const url = `https://api.openchargemap.io/v3/poi/?output=json&countrycode=CO&latitude=${lat}&longitude=${lng}&distance=50&distanceunit=KM&maxresults=50&compact=true&verbose=false&key=${apiKey}`
      const res = await fetch(url)
      const data = await res.json()
      const parsed = data.map((item: any) => parseOCMStation(item, userLat, userLng))
      if (userLat && userLng) {
        parsed.sort((a: Station, b: Station) => parseFloat(a.dist || '999') - parseFloat(b.dist || '999'))
      }
      setStations(parsed)

      // Actualizar marcadores en el mapa
      if (mapRef.current) {
        const mapboxgl = (await import('mapbox-gl')).default
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []

        parsed.forEach((station: Station) => {
          const el = document.createElement('div')
          el.style.cssText = `
            width: 32px; height: 32px;
            border-radius: 50%;
            background: ${station.busy ? '#FF6B35' : station.hasDC ? '#00B4D8' : '#22D3A5'};
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            font-size: 14px;
          `
          el.innerHTML = '⚡'

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([station.lng, station.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
                <div style="font-family: sans-serif; padding: 8px; min-width: 180px;">
                  <strong style="font-size: 13px; color: #1E3A5F;">${station.name}</strong><br/>
                  <span style="font-size: 11px; color: #64748B;">${station.address}</span><br/>
                  <div style="margin-top: 6px;">
                    ${station.chips.map((c: string) => `<span style="background: #f1f5f9; border-radius: 4px; padding: 2px 6px; font-size: 10px; margin-right: 4px;">${c}</span>`).join('')}
                  </div>
                  <div style="margin-top: 6px; font-size: 11px; color: ${station.busy ? '#FF6B35' : '#22D3A5'}; font-weight: 600;">
                    ${station.busy ? '🔴 Ocupado' : '🟢 Disponible'}
                  </div>
                  ${station.dist ? `<p style="margin-top: 4px; font-size: 11px; color: #22D3A5;">📍 ${station.dist}</p>` : ''}
                  <a href="https://maps.google.com/?q=${station.lat},${station.lng}" target="_blank"
                    style="display: block; margin-top: 8px; font-size: 11px; color: #00B4D8; font-weight: 600; text-decoration: none;">
                    🧭 Cómo llegar →
                  </a>
                </div>
              `)
            )
            .addTo(mapRef.current)

          markersRef.current.push(marker)
        })
      }
    } catch (e) {
      console.error('OCM error:', e)
    }
    setLoading(false)
  }, [])

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

      // Cargar electrolineras de Bogotá por defecto
      fetchStations(4.7110, -74.0721)

      // Ubicación del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { longitude, latitude } = pos.coords
          setUserLocation({ lng: longitude, lat: latitude })

          map.flyTo({ center: [longitude, latitude], zoom: 12, duration: 1500 })

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

          // Recargar con ubicación real del usuario
          fetchStations(latitude, longitude, latitude, longitude)

        }, () => {})
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [isActive, theme, fetchStations])

  const filteredStations = stations.filter(s => {
    if (activeFilter === 'DC Rápido') return s.hasDC
    if (activeFilter === 'AC Nivel 2') return s.hasAC
    if (activeFilter === 'Disponibles') return !s.busy
    if (activeFilter === '24 horas') return s.is24h
    return true
  })

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName)
    const city = CITIES.find(c => c.name === cityName)
    if (!city || !mapRef.current) return

    if (cityName === 'Mi ubicación' && userLocation) {
      mapRef.current.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 12, duration: 1000 })
      fetchStations(userLocation.lat, userLocation.lng, userLocation.lat, userLocation.lng)
    } else if (city.lng && city.lat) {
      mapRef.current.flyTo({ center: [city.lng, city.lat], zoom: 12, duration: 1000 })
      fetchStations(city.lat, city.lng, userLocation?.lat, userLocation?.lng)
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
          {loading && (
            <div style={{ textAlign: 'center', padding: '8px', fontSize: 12, color: 'var(--accent-cyan)' }}>
              ⚡ Cargando electrolineras...
            </div>
          )}
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
                    <span key={c} className={`${styles.chip} ${c.includes('kW') || c.includes('DC') ? styles.fastChip : ''}`}>{c}</span>
                  ))}
                </div>
                {s.dist && <p className={styles.stDist}>📍 {s.dist}</p>}
              </div>
            ))}
            {!loading && filteredStations.length === 0 && (
              <div style={{ padding: '12px', fontSize: 12, color: 'var(--text-secondary)' }}>
                No hay electrolineras para este filtro.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
