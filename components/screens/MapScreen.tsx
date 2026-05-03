'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Map.module.css'

const FILTERS = ['Todos', 'DC Rápido', 'AC Nivel 2', 'Disponibles', '24 horas']

const STATIONS = [
  { name: 'CC Andino — Chico',  address: 'Cl. 82 #11-37, Bogotá',   chips: ['AC 22kW', '4 pts', '24h'], dist: '0.8 km · ~12 min', busy: false },
  { name: 'WBC Usaquén',        address: 'Cr 6 #119-24, Usaquén',   chips: ['DC 50kW', '2 pts'],        dist: '1.4 km · ~5 min',  busy: false },
  { name: 'Salitre Plaza',      address: 'Cr 68B #40-45, Salitre',  chips: ['AC 11kW', '6 pts'],        dist: '2.1 km · ~8 min',  busy: true  },
]

export default function MapScreen() {
  const { activeScreen, theme } = useAppStore()
  const [activeFilter, setActiveFilter] = useState('Todos')
  const isActive = activeScreen === 'map'
  const isLight = theme === 'light'

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
        <svg width="390" height="420" viewBox="0 0 390 420" xmlns="http://www.w3.org/2000/svg">
          <rect width="390" height="420" fill={isLight ? '#e8edf4' : '#0a1220'}/>
          <g stroke={isLight ? '#c8d4e0' : '#1a2535'} strokeWidth="1" opacity="0.8">
            {[60,120,180,240,300,360].map(y => <line key={y} x1="0" y1={y} x2="390" y2={y}/>)}
            {[65,130,195,260,325].map(x => <line key={x} x1={x} y1="0" x2={x} y2="420"/>)}
          </g>
          <g stroke={isLight ? '#b0c4d8' : '#1e3048'} strokeWidth="3">
            <line x1="0" y1="150" x2="390" y2="200"/>
            <line x1="160" y1="0" x2="140" y2="420"/>
            <line x1="0" y1="90" x2="390" y2="60"/>
          </g>
          {[[80,90,60,40],[240,180,80,50],[30,280,50,60]].map(([x,y,w,h],i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill={isLight ? '#c8e6c9' : '#0d2918'} rx="4" opacity="0.7"/>
          ))}
          {/* Stations */}
          <circle cx="180" cy="110" r="10" fill="#22D3A5" opacity="0.2"><animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite"/></circle>
          <circle cx="180" cy="110" r="8" fill="#22D3A5"/>
          <circle cx="280" cy="70" r="10" fill="#22D3A5" opacity="0.2"><animate attributeName="r" values="8;12;8" dur="2s" begin="0.3s" repeatCount="indefinite"/></circle>
          <circle cx="280" cy="70" r="8" fill="#22D3A5"/>
          <circle cx="130" cy="220" r="10" fill="#FF6B35" opacity="0.2"><animate attributeName="r" values="8;12;8" dur="2s" begin="0.6s" repeatCount="indefinite"/></circle>
          <circle cx="130" cy="220" r="8" fill="#FF6B35"/>
          <circle cx="60" cy="180" r="10" fill="#22D3A5" opacity="0.2"/>
          <circle cx="60" cy="180" r="8" fill="#22D3A5"/>
          <circle cx="220" cy="165" r="12" fill="#00B4D8" opacity="0.2"><animate attributeName="r" values="10;14;10" dur="2s" begin="0.4s" repeatCount="indefinite"/></circle>
          <circle cx="220" cy="165" r="10" fill="#00B4D8"/>
          <text x="220" y="169" textAnchor="middle" fontSize="8" fontWeight="700" fill="#0D1117">DC</text>
          <circle cx="90" cy="320" r="8" fill="#22D3A5"/>
          {/* User */}
          <circle cx="195" cy="160" r="18" fill="rgba(21,101,192,0.25)"/>
          <circle cx="195" cy="160" r="10" fill="#1565C0"/>
          <circle cx="195" cy="160" r="5" fill="white"/>
          {/* Legend */}
          <rect x="10" y="10" width="132" height="46" fill={isLight ? 'rgba(255,255,255,0.95)' : 'rgba(17,24,39,0.9)'} rx="8"/>
          <circle cx="26" cy="25" r="6" fill="#22D3A5"/>
          <text x="38" y="29" fontSize="10" fill={isLight ? '#64748B' : '#8B9AB0'}>Disponible</text>
          <circle cx="26" cy="43" r="6" fill="#FF6B35"/>
          <text x="38" y="47" fontSize="10" fill={isLight ? '#64748B' : '#8B9AB0'}>Ocupado</text>
          <circle cx="96" cy="25" r="6" fill="#00B4D8"/>
          <text x="108" y="29" fontSize="10" fill={isLight ? '#64748B' : '#8B9AB0'}>DC</text>
        </svg>

        <div className={styles.gradientOverlay} />

        <div className={styles.overlay}>
          <div className={styles.searchBar}>
            <span>🔍</span>
            <span className={styles.searchTxt}>Buscar electrolinera...</span>
          </div>
          <div className={styles.stationCards}>
            {STATIONS.map((s, i) => (
              <div key={i} className={styles.stationCard}>
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
