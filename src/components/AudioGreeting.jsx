import React, { useState, useRef } from 'react'

export default function AudioGreeting({ onDone }) {
  const [playing, setPlaying] = useState(false)
const [finished, setFinished] = useState(false)
const [watched, setWatched] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const audioRef = useRef(null)

  function toggle() {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  function handleEnded() { setPlaying(false); setFinished(true); setWatched(true) }

  function handleEnter() {
    setShowToast(true)
    setTimeout(() => { setShowToast(false); onDone() }, 2200)
  }

  return (
    <div style={{ background:'#0e0e0e', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', color:'#f0ebe0', fontFamily:'var(--font)', position:'relative' }}>

      <div style={{
        position:'fixed', top:'50%', left:'50%',
        transform: showToast ? 'translate(-50%,-50%)' : 'translate(-50%,-58%)',
        background:'rgba(14,14,14,0.75)',
        backdropFilter:'blur(16px)',
        WebkitBackdropFilter:'blur(16px)',
        border:'1px solid rgba(200,168,75,0.3)',
        color:'#f0ebe0', padding:'24px 40px',
        zIndex:1000, pointerEvents:'none', textAlign:'center',
        maxWidth:320, width:'88%',
        opacity: showToast ? 1 : 0,
        transition:'opacity 0.4s ease, transform 0.4s ease',
      }}>
        <div style={{ fontSize:11, letterSpacing:'0.25em', color:'rgba(200,168,75,0.7)', textTransform:'uppercase', marginBottom:10 }}>Клуб приветствует вас</div>
        <div style={{ fontSize:18, fontWeight:200, letterSpacing:'0.02em' }}>Приятного пользования,<br />дорогой Максим</div>
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

       <video
  ref={audioRef}
  src="assets/video/greeting.mp4"
  onEnded={handleEnded}
  controls
  style={{ width:'100%', maxWidth:480, marginBottom:'1.5rem', borderRadius:4 }}
/>

        <button onClick={handleEnter} style={{
  background: watched ? '#c8a84b' : 'rgba(255,255,255,0.06)',
  border:`1px solid ${watched ? '#c8a84b' : 'rgba(255,255,255,0.12)'}`,
  color: watched ? '#0e0e0e' : 'rgba(255,255,255,0.4)',
  fontSize:11, fontWeight: watched ? 600 : 400,
          letterSpacing:'0.2em', textTransform:'uppercase',
         padding:'16px 40px', cursor: watched ? 'pointer' : 'default',
pointerEvents: watched ? 'auto' : 'none',
          transition:'all 0.3s', fontFamily:'var(--font)',
        }}>
          Войти в клуб →
        </button>
      </div>
    </div>
  )
}
