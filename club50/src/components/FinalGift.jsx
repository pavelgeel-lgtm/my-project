import React, { useState } from 'react'
import { getPoints } from '../storage'

export default function FinalGift({ onBack }) {
  const [opened, setOpened] = useState(false)
  const points = getPoints()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
      <button onClick={onBack} style={{ position: 'absolute', top: '2rem', left: '2rem', background: 'none', border: 'none', fontSize: 20, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>←</button>

      {!opened ? (
        <>
          <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '2rem' }}>
            День 21 · Финал
          </div>

          <div style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 200, color: '#f5f0e8', lineHeight: 1.2, marginBottom: '1rem' }}>
            Вы прошли<br />все 21 день
          </div>

          <div style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>
            Набрано очков клуба
          </div>

          <div style={{ fontSize: 56, fontWeight: 200, color: 'var(--gold)', marginBottom: '3rem', letterSpacing: '-0.02em' }}>
            {points}
          </div>

          <div style={{ width: 60, height: 60, border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: 24 }}>◆</span>
          </div>

          <button
            onClick={() => setOpened(true)}
            style={{
              background: 'var(--gold)',
              border: 'none',
              color: 'var(--dark)',
              padding: '18px 40px',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}
          >
            Открыть финальный подарок
          </button>
        </>
      ) : (
        <>
          <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '2rem' }}>
            Секретный подарок клуба
          </div>

          {/* Video player */}
          <div style={{ width: '100%', maxWidth: 640, aspectRatio: '16/9', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(180,150,63,0.2)', marginBottom: '2rem', overflow: 'hidden' }}>
            <video
              src="assets/video/final.mp4"
              controls
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ fontSize: 'clamp(20px, 3vw, 30px)', fontWeight: 200, color: '#f5f0e8', lineHeight: 1.4, marginBottom: '1rem' }}>
            Максим, это был особенный клуб.
          </div>
          <div style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.4)', maxWidth: 400, lineHeight: 1.7 }}>
            21 день. 5 карточек в день. Один человек, который прошёл всё это.
          </div>
        </>
      )}
    </div>
  )
}
