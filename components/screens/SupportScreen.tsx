'use client'
import { useState } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Support.module.css'

export default function SupportScreen() {
  const { activeScreen } = useAppStore()
  const [restarted, setRestarted] = useState(false)
  const isActive = activeScreen === 'support'

  return (
    <div className={`${styles.support} ${isActive ? styles.active : ''}`}>
      <div className={styles.statusBar}><span>9:41</span><span>●●● 100%</span></div>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <div className={styles.avatar}>
            🤖<div className={styles.onlineDot} />
          </div>
          <div>
            <p className={styles.agentName}>Biptics IA</p>
            <p className={styles.agentStatus}>● En línea · OCPP activo</p>
          </div>
          <div className={styles.planBadge}>Plan Básico</div>
        </div>
        <div className={styles.ocppCard}>
          <div>
            <p className={styles.ocppLabel}>WALLBOX DETECTADO</p>
            <p className={styles.ocppVal}>BYD Yuan Up · Garaje Norte</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className={styles.ocppLabel}>ESTADO</p>
            <div className={styles.ocppStatus}>
              <div className={styles.ocppDot} />
              <span className={styles.ocppOnline}>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className={styles.chat}>
        <div className={`${styles.msg} ${styles.bot}`}>
          <div className={styles.avatar2}>⚡</div>
          <div>
            <div className={styles.bubble}>¡Hola! Soy el agente Biptics IA. Veo tu wallbox conectado en Garaje Norte. ¿En qué te ayudo? 👋</div>
          </div>
          <span className={styles.time}>9:41</span>
        </div>

        <div className={`${styles.msg} ${styles.user}`}>
          <div className={styles.bubble}>Mi wallbox no enciende desde ayer</div>
          <span className={styles.time}>9:42</span>
        </div>

        <div className={`${styles.msg} ${styles.bot}`}>
          <div className={styles.avatar2}>⚡</div>
          <div>
            <div className={styles.bubble}>Revisé el OCPP de tu wallbox ahora mismo. Encontré el problema:</div>
            <div className={styles.errorCard}>
              <p className={styles.errTitle}>⚠ Error E-04 detectado</p>
              <p className={styles.errDetail}>Pérdida de conexión WiFi desde las 7:12pm de ayer. Último registro: 38.4°C temperatura nominal.</p>
            </div>
          </div>
          <span className={styles.time}>9:42</span>
        </div>

        <div className={`${styles.msg} ${styles.bot}`} style={{ animationDelay: '0.2s' }}>
          <div className={styles.avatar2}>⚡</div>
          <div>
            <div className={styles.bubble}>Puedo reiniciarlo remotamente ahora. ¿Lo hacemos?</div>
          </div>
          <span className={styles.time}>9:42</span>
        </div>
      </div>

      {/* Typing */}
      <div className={styles.typing}>
        <span /><span /><span />
      </div>

      {/* Action pills */}
      <div className={styles.pills}>
        <button
          className={`${styles.pill} ${restarted ? styles.pillDone : ''}`}
          onClick={() => setRestarted(true)}
        >
          <p className={styles.pillTitle}>{restarted ? '✓ Reiniciando...' : 'Reiniciar remotamente'}</p>
          <p className={styles.pillSub}>vía OCPP · ~30 seg</p>
        </button>
        <button className={styles.pill}>
          <p className={styles.pillTitle}>Agendar técnico</p>
          <p className={styles.pillSub}>Visita presencial</p>
        </button>
        <button className={styles.pill}>
          <p className={styles.pillTitle}>Ver historial</p>
          <p className={styles.pillSub}>Últimas sesiones</p>
        </button>
      </div>

      {/* Upgrade banner */}
      <div className={styles.upgradeBanner}>
        <div>
          <p className={styles.upgradeTitle}>Plan Pro — Análisis de imagen</p>
          <p className={styles.upgradeSub}>Envía foto del display para diagnóstico exacto</p>
        </div>
        <button className={styles.upgradeBtn}>Ver plan</button>
      </div>

      {/* Input */}
      <div className={styles.inputRow}>
        <input className={styles.chatInput} placeholder="Escribe tu consulta..." />
        <button className={styles.voiceBtn}>🎤</button>
        <button className={styles.sendBtn}>➤</button>
      </div>
    </div>
  )
}
