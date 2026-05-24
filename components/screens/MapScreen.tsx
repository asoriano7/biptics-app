'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import { createClient } from '@/lib/supabase/client'
import styles from './Map.module.css'

const FILTERS = ['Todos', 'DC Rápido', 'AC Nivel 2', '24 horas']

const CITIES = [
  { name: 'Mi ubicación', lng: null as number | null, lat: null as number | null },
  { name: 'Bogotá', lng: -74.0721, lat: 4.7110 },
  { name: 'Medellín', lng: -75.5812, lat: 6.2518 },
  { name: 'Cali', lng: -76.5225, lat: 3.4516 },
  { name: 'Barranquilla', lng: -74.7936, lat: 11.0041 },
]

// Vehículos EV y su batería en kWh
const EV_BATTERY: Record<string, number> = {
  'BYD Yuan Up': 38,
  'BYD Seagull': 38,
  'BYD Yuan Plus': 60,
  'Chery iCAR 03': 61,
  'Kia EV5': 77,
  'Kia EV6': 77,
  'Volvo EX30': 69,
  'Tesla Model 3': 75,
  'Tesla Model Y': 82,
  'GAC Aion V': 80,
  'Renault Kwid E-Tech': 26,
  'Nissan Leaf': 40,
}

const TARIFA_KWH = 1200 // COP por kWh

interface Station {
  id: string
  name: string
  address: string
  chips: string[]
  lng: number
  lat: number
  city: string
  dist: string
  hasDC: boolean
  hasAC: boolean
  is24h: boolean
  horario: string
  maxPower: number
  avgRating: number
  totalReviews: number
}

interface Review {
  id: string
  calificacion: number
  comentario: string
  created_at: string
  usuario_id: string
  nombre?: string
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

function parseOCMStation(item: any, userLat?: number, userLng?: number): Station {
  const addr = item.AddressInfo
  const conns = item.Connections || []
  const hasDC = conns.some((c: any) => c.CurrentTypeID === 30)
  const hasAC = conns.some((c: any) => c.CurrentTypeID === 10 || c.CurrentTypeID === 20)
  const maxPower = Math.max(0, ...conns.map((c: any) => c.PowerKW || 0))
  const numPoints = conns.length
  const chips: string[] = []
  if (hasDC) chips.push(`DC ${maxPower > 0 ? maxPower + 'kW' : 'Rápido'}`)
  if (hasAC && !hasDC) chips.push(`AC ${maxPower > 0 ? maxPower + 'kW' : ''}`.trim())
  else if (hasAC) chips.push('AC')
  if (numPoints > 0) chips.push(`${numPoints} pts`)
  const lat = addr.Latitude
  const lng = addr.Longitude
  const dist = userLat && userLng ? `${calcDist(userLat, userLng, lat, lng)} km` : ''
  const horario = addr.AccessComments || ''
  const is24h = horario.toLowerCase().includes('24') || horario.toLowerCase().includes('abierto')

  return {
    id: String(item.ID),
    name: addr.Title || 'Electrolinera',
    address: `${addr.AddressLine1 || ''}, ${addr.Town || ''}`.trim().replace(/^,|,$/g, ''),
    chips: chips.filter(Boolean),
    lng, lat,
    city: addr.Town || '',
    dist,
    hasDC, hasAC, is24h,
    horario: horario || 'Consultar horario',
    maxPower,
    avgRating: 0,
    totalReviews: 0,
  }
}

export default function MapScreen() {
  const { activeScreen, theme, user } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const [selectedCity, setSelectedCity] = useState('Mi ubicación')
  const [userLocation, setUserLocation] = useState<{lng: number, lat: number} | null>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState('')
  const [savingReview, setSavingReview] = useState(false)
  const [userVehicle, setUserVehicle] = useState('')
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const isActive = activeScreen === 'map'

  // Cargar vehículo del usuario
  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase.from('usuarios').select('vehiculo').eq('id', user.id).single()
      .then(({ data }) => { if (data?.vehiculo) setUserVehicle(data.vehiculo) })
  }, [user])

  // Cargar reseñas de una estación
  const loadReviews = useCallback(async (stationId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('reseñas_electrolineras')
      .select('*, usuarios(nombre)')
      .eq('estacion_id', stationId)
      .order('created_at', { ascending: false })
    if (data) {
      const parsed = data.map((r: any) => ({
        ...r,
        nombre: r.usuarios?.nombre || 'Usuario'
      }))
      setReviews(parsed)
    }
  }, [])

  const fetchStations = useCallback(async (lat: number, lng: number, userLat?: number, userLng?: number) => {
    setLoading(true)
    try {
      const apiKey = process.env.NEXT_PUBLIC_OCM_API_KEY
      const url = `https://api.openchargemap.io/v3/poi/?output=json&countrycode=CO&latitude=${lat}&longitude=${lng}&distance=50&distanceunit=KM&maxresults=50&compact=true&verbose=false&key=${apiKey}`
      const res = await fetch(url)
      const data = await res.json()
      const parsed: Station[] = data.map((item: any) => parseOCMStation(item, userLat, userLng))

      // Cargar ratings desde Supabase
      const supabase = createClient()
      const ids = parsed.map(s => s.id)
      const { data: reviews } = await supabase
        .from('reseñas_electrolineras')
        .select('estacion_id, calificacion')
        .in('estacion_id', ids)

      if (reviews) {
        parsed.forEach(s => {
          const stReviews = reviews.filter((r: any) => r.estacion_id === s.id)
          if (stReviews.length > 0) {
            s.avgRating = stReviews.reduce((acc: number, r: any) => acc + r.calificacion, 0) / stReviews.length
            s.totalReviews = stReviews.length
          }
        })
      }

      if (userLat && userLng) {
        parsed.sort((a, b) => parseFloat(a.dist || '999') - parseFloat(b.dist || '999'))
      }
      setStations(parsed)

      if (mapRef.current) {
        const mapboxgl = (await import('mapbox-gl')).default
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []

        parsed.forEach((station: Station) => {
          const el = document.createElement('div')
          el.style.cssText = `
            width: 32px; height: 32px; border-radius: 50%;
            background: ${station.hasDC ? '#00B4D8' : '#22D3A5'};
            border: 3px solid white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            cursor: pointer; display: flex; align-items: center;
            justify-content: center; font-size: 14px;
          `
          el.innerHTML = '⚡'
          el.onclick = () => {
            setSelectedStation(station)
            loadReviews(station.id)
          }

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([station.lng, station.lat])
            .addTo(mapRef.current)
          markersRef.current.push(marker)
        })
      }
    } catch (e) { console.error('OCM error:', e) }
    setLoading(false)
  }, [loadReviews])

  useEffect(() => {
    if (!isActive || mapRef.current || !mapContainer.current) return

    const initMap = async () => {
      const mapboxgl = (await import('mapbox-gl')).default
      await import('mapbox-gl/dist/mapbox-gl.css')
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

      const map = new mapboxgl.Map({
        container: mapContainer.current!,
        style: theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/streets-v12',
        center: [-74.0721, 4.7110],
        zoom: 11,
      })

      mapRef.current = map
      map.addControl(new mapboxgl.NavigationControl(), 'top-right')
      fetchStations(4.7110, -74.0721)

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { longitude, latitude } = pos.coords
          setUserLocation({ lng: longitude, lat: latitude })
          map.flyTo({ center: [longitude, latitude], zoom: 12, duration: 1500 })

          const userEl = document.createElement('div')
          userEl.style.cssText = `width:20px;height:20px;border-radius:50%;background:#1565C0;border:3px solid white;box-shadow:0 0 0 6px rgba(21,101,192,0.2);`
          new mapboxgl.Marker({ element: userEl }).setLngLat([longitude, latitude]).addTo(map)
          fetchStations(latitude, longitude, latitude, longitude)
        }, () => {})
      }
    }

    initMap()
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null } }
  }, [isActive, theme, fetchStations])

  const handleSaveReview = async () => {
    if (!user || !selectedStation) return
    setSavingReview(true)
    const supabase = createClient()
    await supabase.from('reseñas_electrolineras').insert({
      estacion_id: selectedStation.id,
      estacion_nombre: selectedStation.name,
      usuario_id: user.id,
      calificacion: newRating,
      comentario: newComment,
    })
    await loadReviews(selectedStation.id)
    setShowReviewForm(false)
    setNewComment('')
    setNewRating(5)
    setSavingReview(false)
  }

  const filteredStations = stations.filter(s => {
    if (activeFilter === 'DC Rápido') return s.hasDC
    if (activeFilter === 'AC Nivel 2') return s.hasAC
    if (activeFilter === '24 horas') return s.is24h
    return true
  })

  // Calcular costo estimado
  const calcCosto = (station: Station) => {
    if (!userVehicle) return null
    const battery = EV_BATTERY[userVehicle]
    if (!battery) return null
    const cost = battery * TARIFA_KWH
    return `~$${cost.toLocaleString('es-CO')} COP carga completa`
  }

  // Calcular tiempo estimado
  const calcTiempo = (station: Station) => {
    if (!userVehicle || !station.maxPower) return null
    const battery = EV_BATTERY[userVehicle]
    if (!battery) return null
    const hours = battery / station.maxPower
    if (hours < 1) return `~${Math.round(hours * 60)} min carga completa`
    return `~${hours.toFixed(1)} horas carga completa`
  }

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
          <select value={selectedCity} onChange={e => handleCityChange(e.target.value)}
            style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 10, padding: '6px 10px', fontSize: 12, color: 'var(--text-primary)', fontFamily: 'Sora, sans-serif', cursor: 'pointer' }}>
            {CITIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        <div className={styles.filters}>
          {FILTERS.map(f => (
            <button key={f} className={`${styles.pill} ${activeFilter === f ? styles.pillActive : ''}`}
              onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      <div className={styles.mapArea}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />
        <div className={styles.gradientOverlay} />

        {/* DETALLE DE ESTACIÓN */}
        {selectedStation ? (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'var(--bg-card)', borderRadius: '20px 20px 0 0',
            padding: '20px 16px 100px 16px', maxHeight: '80%', overflowY: 'auto',
            border: '1px solid var(--border)',
          }}>
            <button onClick={() => setSelectedStation(null)}
              style={{ position: 'absolute', top: 14, right: 16, background: 'var(--bg-input)', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 13 }}>
              ✕
            </button>

            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, paddingRight: 40 }}>{selectedStation.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>{selectedStation.address}</p>

            {/* Chips */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
              {selectedStation.chips.map(c => (
                <span key={c} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 6, padding: '2px 8px', fontSize: 11, color: 'var(--accent-cyan)' }}>{c}</span>
              ))}
            </div>

            {/* Horario */}
            <div style={{ background: 'var(--bg-input)', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>🕐 HORARIO</p>
              <p style={{ fontSize: 12, color: 'var(--text-primary)' }}>{selectedStation.horario}</p>
            </div>

            {/* Costo y tiempo estimado */}
            {userVehicle && (
              <div style={{ background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(0,180,216,0.2)', borderRadius: 10, padding: '10px 12px', marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 4 }}>⚡ PARA TU {userVehicle.toUpperCase()}</p>
                {calcCosto(selectedStation) && <p style={{ fontSize: 12, color: 'var(--text-primary)', marginBottom: 2 }}>💰 {calcCosto(selectedStation)}</p>}
                {calcTiempo(selectedStation) && <p style={{ fontSize: 12, color: 'var(--text-primary)' }}>⏱️ {calcTiempo(selectedStation)}</p>}
              </div>
            )}

            {/* Rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedStation.avgRating > 0 ? selectedStation.avgRating.toFixed(1) : '—'}
                </span>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', marginLeft: 6 }}>
                  ⭐ ({selectedStation.totalReviews} reseñas)
                </span>
              </div>
              <a href={`https://maps.google.com/?q=${selectedStation.lat},${selectedStation.lng}`} target="_blank" rel="noopener noreferrer"
                style={{ background: 'var(--accent-cyan)', color: '#fff', borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                🧭 Cómo llegar
              </a>
            </div>

            {/* Reseñas */}
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Reseñas</p>
            {reviews.length === 0 && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10 }}>Sé el primero en dejar una reseña.</p>}
            {reviews.slice(0, 3).map((r, i) => (
              <div key={i} style={{ background: 'var(--bg-input)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{r.nombre}</span>
                  <span style={{ fontSize: 12 }}>{'⭐'.repeat(r.calificacion)}</span>
                </div>
                {r.comentario && <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>{r.comentario}</p>}
              </div>
            ))}

            {/* Formulario reseña */}
            {user && !showReviewForm && (
              <button onClick={() => setShowReviewForm(true)}
                style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--accent-cyan)', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 8 }}>
                ✍️ Escribir reseña
              </button>
            )}

            {showReviewForm && (
              <div style={{ background: 'var(--bg-input)', borderRadius: 12, padding: '14px', marginBottom: 8 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Tu calificación</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setNewRating(n)}
                      style={{ fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', opacity: n <= newRating ? 1 : 0.3 }}>⭐</button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Cuéntanos tu experiencia..."
                  style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px', color: 'var(--text-primary)', fontSize: 12, fontFamily: 'Sora, sans-serif', resize: 'none', height: 70, boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button onClick={() => setShowReviewForm(false)}
                    style={{ flex: 1, padding: '10px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button onClick={handleSaveReview} disabled={savingReview}
                    style={{ flex: 2, padding: '10px', background: 'linear-gradient(135deg,var(--accent-cyan),#0097b2)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                    {savingReview ? 'Guardando...' : 'Publicar reseña'}
                  </button>
                </div>
              </div>
            )}

            <div style={{ height: 20 }} />
          </div>
        ) : (
          /* CARDS DE ESTACIONES */
          <div className={styles.overlay}>
            {/* Banner Biptics */}
            <div style={{
              background: 'linear-gradient(135deg,#1E3A5F,#00B4D8)',
              borderRadius: 14, padding: '12px 14px', marginBottom: 10,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,180,216,0.3)'
            }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 2 }}>⚡ ¿Prefieres cargar en casa?</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>Biptics instala tu wallbox · Desde $1.250.000</p>
              </div>
              <span style={{ fontSize: 20 }}>→</span>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: '8px', fontSize: 12, color: 'var(--accent-cyan)' }}>⚡ Cargando electrolineras...</div>}
            <div className={styles.stationCards}>
              {filteredStations.map((s, i) => (
                <div key={i} className={styles.stationCard} onClick={() => {
                  if (mapRef.current) mapRef.current.flyTo({ center: [s.lng, s.lat], zoom: 15, duration: 800 })
                  setSelectedStation(s)
                  loadReviews(s.id)
                }}>
                  <div className={styles.stHeader}>
                    <p className={styles.stName}>{s.name}</p>
                    {s.avgRating > 0 && <span style={{ fontSize: 10, color: '#FFB800' }}>⭐ {s.avgRating.toFixed(1)}</span>}
                  </div>
                  <p className={styles.stAddress}>{s.address}</p>
                  <div className={styles.stChips}>
                    {s.chips.map(c => (
                      <span key={c} className={`${styles.chip} ${c.includes('kW') || c.includes('DC') ? styles.fastChip : ''}`}>{c}</span>
                    ))}
                  </div>
                  {s.dist && <p className={styles.stDist}>📍 {s.dist}</p>}
                </div>
              ))}
              {!loading && filteredStations.length === 0 && (
                <div style={{ padding: '12px', fontSize: 12, color: 'var(--text-secondary)' }}>No hay electrolineras para este filtro.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
