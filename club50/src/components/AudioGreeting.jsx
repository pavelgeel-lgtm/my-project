import React, { useState, useRef } from 'react'

export default function AudioGreeting({ onDone }) {
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const audioRef = useRef(null)

  function toggle() {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  function handleEnded() {
    setPlaying(false)
    setFinished(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--dark)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '3rem' }}>
          Секретный клуб · Добро пожаловать
        </div>

        <div style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 200, color: '#f5f0e8', lineHeight: 1.2, marginBottom: '1rem' }}>
          Послушайте<br />приветствие клуба
        </div>

        <div style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.05em', marginBottom: '3rem' }}>
          Специальное обращение для Максима
        </div>

        {/* Audio player */}
        <audio ref={audioRef} src="assets/audio/greeting.mp3" onEnded={handleEnded} />

        <button
          onClick={toggle}
          style={{
            width: 80, height: 80,
            borderRadius: '50%',
            border: '1px solid var(--gold)',
            background: playing ? 'var(--gold)' : 'transparent',
            color: playing ? 'var(--dark)' : 'var(--gold)',
            fontSize: 24,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            transition: 'all 0.2s',
            fontFamily: 'var(--font)',
          }}
        >
          {playing ? '❚❚' : '▶'}
        </button>

        <div style={{ fontSize: 11, fontWeight: 300, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: '3rem' }}>
          {playing ? 'Воспроизведение...' : finished ? 'Прослушано' : 'Нажмите для воспроизведения'}
        </div>

        <button
          onClick={onDone}
          style={{
            background: finished ? 'var(--gold)' : 'transparent',
            border: '1px solid ' + (finished ? 'var(--gold)' : 'rgba(255,255,255,0.2)'),
            color: finished ? 'var(--dark)' : 'rgba(255,255,255,0.4)',
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '14px 40px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontFamily: 'var(--font)',
          }}
        >
          Войти в клуб →
        </button>

        {!finished && (
          <div style={{ marginTop: 16 }}>
            <button
              onClick={onDone}
              style={{ background: 'none', border: 'none', fontSize: 10, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font)' }}
            >
              Пропустить
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
