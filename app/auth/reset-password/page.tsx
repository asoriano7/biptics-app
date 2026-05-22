'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async () => {
    if (!password || !confirm) { setError('Completa todos los campos'); return }
    if (password.length < 6) { setError('La contraseña debe tener mínimo 6 caracteres'); return }
    if (password !== confirm) { setError('Las contraseñas no coinciden'); return }

    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0F1E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Sora', sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#131929',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0,
      }}>
        {/* Logo */}
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: 'linear-gradient(135deg,#00B4D8,#22D3A5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, marginBottom: 20,
        }}>⚡</div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#F1F5F9', marginBottom: 8, textAlign: 'center' }}>
          Nueva contraseña
        </h1>
        <p style={{ fontSize: 13, color: '#94A3B8', textAlign: 'center', lineHeight: 1.6, marginBottom: 28 }}>
          Ingresa y confirma tu nueva contraseña para Biptics.
        </p>

        {success ? (
          <>
            <div style={{
              width: '100%', background: 'rgba(34,197,94,.1)',
              border: '1px solid rgba(34,197,94,.3)', borderRadius: 12,
              padding: '14px 16px', fontSize: 13, color: '#4ade80',
              textAlign: 'center', lineHeight: 1.6, marginBottom: 24,
            }}>
              ✅ ¡Contraseña actualizada correctamente!
            </div>
            <a href="/?loggedIn=true" style={{
              width: '100%', padding: '14px', textAlign: 'center',
              background: 'linear-gradient(135deg,#00B4D8,#0097b2)',
              border: 'none', borderRadius: 14, color: '#fff',
              fontSize: 15, fontWeight: 600, cursor: 'pointer',
              textDecoration: 'none', display: 'block',
            }}>
              Ir a Biptics →
            </a>
          </>
        ) : (
          <>
            {error && (
              <div style={{
                width: '100%', background: 'rgba(230,57,70,.1)',
                border: '1px solid rgba(230,57,70,.3)', borderRadius: 10,
                padding: '10px 14px', fontSize: 12, color: '#f87171',
                marginBottom: 16, textAlign: 'center',
              }}>
                ⚠ {error}
              </div>
            )}

            <div style={{ width: '100%', marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 5 }}>
                Nueva contraseña
              </label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: '100%', background: '#1E293B',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '12px 14px',
                  color: '#F1F5F9', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ width: '100%', marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', display: 'block', marginBottom: 5 }}>
                Confirmar contraseña
              </label>
              <input
                type="password"
                placeholder="Repite tu nueva contraseña"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                style={{
                  width: '100%', background: '#1E293B',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '12px 14px',
                  color: '#F1F5F9', fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                width: '100%', padding: '15px',
                background: 'linear-gradient(135deg,#00B4D8,#0097b2)',
                border: 'none', borderRadius: 14, color: '#fff',
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
