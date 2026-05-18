'use client'
import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '@/lib/store/useAppStore'
import styles from './Support.module.css'

interface Message {
  id: string
  role: 'bot' | 'user'
  text: string
  time: string
  errorCard?: { title: string; detail: string }
}

const SESSION_ID = `app-${Date.now()}`

const getTime = () =>
  new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'bot',
    text: '¡Hola! Soy BIPA, el agente de Biptics. Puedo ayudarte a diagnosticar tu wallbox, cotizar cargadores y agendar instalaciones. ¿En qué te ayudo? 👋',
    time: getTime(),
  },
]

const QUICK_PILLS = [
  { title: 'Mi wallbox no carga', sub: 'Diagnóstico remoto' },
  { title: '¿Qué wallbox necesito?', sub: 'Para mi vehículo EV' },
  { title: 'Agendar instalación', sub: 'Visita técnica' },
  { title: 'Ver precios', sub: 'Catálogo Biptics' },
]

export default function SupportScreen() {
  const { activeScreen } = useAppStore()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isActive = activeScreen === 'support'

  // Auto scroll al último mensaje
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      time: getTime(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/bipa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          sessionId: SESSION_ID,
          from: 'app-user',
        }),
      })

      const data = await res.json()

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: data.reply || 'No pude procesar tu consulta. Intenta de nuevo.',
        time: getTime(),
      }

      setMessages((prev) => [...prev, botMsg])
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: 'En este momento no puedo conectarme. Por favor escríbenos al WhatsApp +57 314 3974123.',
        time: getTime(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const handlePill = (title: string) => {
    sendMessage(title)
  }

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
            <p className={styles.agentName}>BIPA — Biptics IA</p>
            <p className={styles.agentStatus}>● En línea · Respuesta inmediata</p>
          </div>
          <div className={styles.planBadge}>Plan Básico</div>
        </div>
        <div className={styles.ocppCard}>
          <div>
            <p className={styles.ocppLabel}>ASISTENTE EV</p>
            <p className={styles.ocppVal}>Diagnóstico · Cotización · Soporte</p>
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
      <div className={styles.chat} ref={chatRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.msg} ${styles[msg.role]}`}>
            {msg.role === 'bot' && <div className={styles.avatar2}>⚡</div>}
            <div>
              <div className={styles.bubble}>{msg.text}</div>
              {msg.errorCard && (
                <div className={styles.errorCard}>
                  <p className={styles.errTitle}>{msg.errorCard.title}</p>
                  <p className={styles.errDetail}>{msg.errorCard.detail}</p>
                </div>
              )}
            </div>
            <span className={styles.time}>{msg.time}</span>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div className={`${styles.msg} ${styles.bot}`}>
            <div className={styles.avatar2}>⚡</div>
            <div className={styles.bubble}>
              <div className={styles.typingDots}>
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick pills — solo si no hay conversación */}
      {messages.length <= 1 && !loading && (
        <div className={styles.pills}>
          {QUICK_PILLS.map((p) => (
            <button
              key={p.title}
              className={styles.pill}
              onClick={() => handlePill(p.title)}
            >
              <p className={styles.pillTitle}>{p.title}</p>
              <p className={styles.pillSub}>{p.sub}</p>
            </button>
          ))}
        </div>
      )}

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
        <input
          ref={inputRef}
          className={styles.chatInput}
          placeholder="Escribe tu consulta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className={styles.voiceBtn}>🎤</button>
        <button
          className={styles.sendBtn}
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
        >➤</button>
      </div>
    </div>
  )
}
