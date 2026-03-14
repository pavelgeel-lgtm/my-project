import React, { useState, useRef } from 'react'

export default function AudioGreeting({ onDone }) {
  const [playing, setPlaying] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const audioRef = useRef(null)

  function toggle() {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  function handleEnded() { setPlaying(false); setFinished(true) }

  function handleEnter() {
    setShowToast(true)
    setTimeout(() => { setShowToast(false); onDone() }, 2200)
  }

  return (
    <div style={{ background:'#0e0e0e', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', color:'#f0ebe0', fontFamily:'var(--font)', position:'relative' }}>

      {/* Toast */}
      <div style={{
        position:'fixed', top:'50%', left:'50%',
        transform: showToast ? 'translate(-50%,-50%)' : 'translate(-50%,-58%)',
        background:'rgba(200,168,75,0.85)',
        backdropFilter:'blur(12px)',
        WebkitBackdropFilter:'blur(12px)',
        color:'#0e0e0e', padding:'22px 40px',
        zIndex:1000, pointerEvents:'none', textAlign:'center',
        maxWidth:300, width:'88%',
        opacity: showToast ? 1 : 0,
        transition:'opacity 0.4s ease, transform 0.4s ease',
      }}>
        <div style={{ fontSize:15, fontWeight:400, letterSpacing:'0.04em', marginBottom:4 }}>Приятного пользования,</div>
        <div style={{ fontSize:20, fontWeight:200, letterSpacing:'0.02em' }}>дорогой Максим</div>
      </div>

      <div style={{ maxWidth:480, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:9, letterSpacing:'0.3em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase', marginBottom:'3rem' }}>
          Секретный клуб · Добро пожаловать
        </div>

        <div style={{ fontSize:'clamp(26px,5vw,40px)', fontWeight:200, lineHeight:1.2, marginBottom:'1rem' }}>
          Послушайте видео<br />от Поля и Хелен
        </div>
        <div style={{ fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.35)', letterSpacing:'0.05em', marginBottom:'3rem' }}>
          Специальное обращение для Максима Владимировича
        </div>

        <audio ref={audioRef} src="assets/audio/greeting.mp3" onEnded={handleEnded} />

        <button onClick={toggle} style={{
          width:80, height:80, borderRadius:'50%',
          border:'1px solid rgba(200,168,75,0.5)',
          background: playing ? '#c8a84b' : 'transparent',
          color: playing ? '#0e0e0e' : '#c8a84b',
          fontSize:22, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 1.5rem', transition:'all 0.2s', fontFamily:'var(--font)',
        }}>
          {playing ? '❚❚' : '▶'}
        </button>

        <div style={{ fontSize:11, fontWeight:300, letterSpacing:'0.15em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginBottom:'3rem' }}>
          {playing ? 'Воспроизведение...' : finished ? 'Прослушано' : 'Нажмите для воспроизведения'}
        </div>

        <button onClick={handleEnter} style={{
          background: finished ? '#c8a84b' : 'rgba(255,255,255,0.06)',
          border:`1px solid ${finished ? '#c8a84b' : 'rgba(255,255,255,0.12)'}`,
          color: finished ? '#0e0e0e' : 'rgba(255,255,255,0.4)',
          fontSize:11, fontWeight: finished ? 600 : 400,
          letterSpacing:'0.2em', textTransform:'uppercase',
          padding:'16px 40px', cursor:'pointer',
          transition:'all 0.3s', fontFamily:'var(--font)',
        }}>
          Войти в клуб →
        </button>
      </div>
    </div>
  )
}
