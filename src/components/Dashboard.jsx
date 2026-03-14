import React, { useState, useEffect } from 'react'
import { getCurrentDay, getPoints, getCompletedDays, getMsUntilNextDay, isDayCompleted } from '../storage'

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
}

function TopBar({ onOpenChat }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.2rem 2rem', borderBottom:'1px solid rgba(255,255,255,0.07)', flexWrap:'wrap', gap:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:8, height:8, background:'#c8a84b', transform:'rotate(45deg)' }} />
        <span style={{ fontSize:11, fontWeight:300, letterSpacing:'0.25em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase' }}>Секретный клуб · 50 уровня жизни</span>
      </div>
      <button onClick={onOpenChat} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(200,168,75,0.1)', border:'1px solid rgba(200,168,75,0.25)', color:'#c8a84b', padding:'8px 16px', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer', fontFamily:'var(--font)', transition:'all 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.background='rgba(200,168,75,0.18)'}
        onMouseLeave={e => e.currentTarget.style.background='rgba(200,168,75,0.1)'}
      >
        <div style={{ width:6, height:6, background:'#c8a84b', transform:'rotate(45deg)' }} />
        Мак Натал
      </button>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: accent ? 'rgba(200,168,75,0.08)' : 'rgba(255,255,255,0.04)', border:`1px solid ${accent ? 'rgba(200,168,75,0.25)' : 'rgba(255,255,255,0.07)'}`, padding:'1rem 1.25rem' }}>
      <div style={{ fontSize:9, letterSpacing:'0.22em', color: accent ? 'rgba(200,168,75,0.6)' : 'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:'clamp(20px,2.5vw,26px)', fontWeight:200, color: accent ? '#c8a84b' : '#f0ebe0', letterSpacing:'-0.02em' }}>{value}</div>
    </div>
  )
}

export default function Dashboard({ onOpenDay, onOpenArchive, onOpenChat }) {
  const [currentDay, setCurrentDay] = useState(getCurrentDay())
  const [points, setPoints] = useState(getPoints())
  const [completedDays, setCompletedDays] = useState(getCompletedDays())
  const [countdown, setCountdown] = useState(getMsUntilNextDay())

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentDay(getCurrentDay())
      setPoints(getPoints())
      setCompletedDays(getCompletedDays())
      setCountdown(getMsUntilNextDay())
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const todayCompleted = isDayCompleted(currentDay)
  const progress = Math.round((completedDays.length / 21) * 100)

  return (
    <div style={{ background:'#0e0e0e', minHeight:'100vh', display:'flex', flexDirection:'column', color:'#f0ebe0' }}>
      <TopBar onOpenChat={onOpenChat} />

      <div style={{ flex:1, padding:'clamp(1.5rem,4vw,2.5rem)' }}>
        {/* Welcome */}
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ fontSize:10, letterSpacing:'0.25em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase', marginBottom:8 }}>Добро пожаловать</div>
          <div style={{ fontSize:'clamp(22px,3vw,32px)', fontWeight:200, color:'#f0ebe0', letterSpacing:'-0.02em' }}>Максим Владимирович</div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:10, marginBottom:'2rem' }}>
          <StatCard label="Уровень жизни" value="50" accent />
          <StatCard label="День клуба" value={`${currentDay} / 21`} />
          <StatCard label="Очки клуба" value={points} />
          <StatCard label="Пройдено" value={completedDays.length} />
        </div>

        {/* Progress */}
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontSize:10, letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Прогресс клуба</span>
            <span style={{ fontSize:10, letterSpacing:'0.15em', color:'#c8a84b' }}>{progress}%</span>
          </div>
          <div style={{ height:2, background:'rgba(200,168,75,0.1)' }}>
            <div style={{ height:'100%', width:`${progress}%`, background:'#c8a84b', transition:'width 0.5s ease' }} />
          </div>
        </div>

        {/* Today */}
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:8 }}>
            <span style={{ fontSize:10, letterSpacing:'0.22em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>День {currentDay} — Дайджест</span>
            {todayCompleted && <span style={{ fontSize:10, letterSpacing:'0.15em', color:'#1d9e75', textTransform:'uppercase' }}>✓ Выполнен</span>}
          </div>

          <button onClick={() => onOpenDay(currentDay)} style={{
            width:'100%', background: todayCompleted ? 'rgba(29,158,117,0.06)' : 'rgba(200,168,75,0.08)',
            border:`1px solid ${todayCompleted ? 'rgba(29,158,117,0.25)' : 'rgba(200,168,75,0.25)'}`,
            color:'#f0ebe0', padding:'1.5rem 2rem', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            fontFamily:'var(--font)', transition:'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = todayCompleted ? 'rgba(29,158,117,0.1)' : 'rgba(200,168,75,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = todayCompleted ? 'rgba(29,158,117,0.06)' : 'rgba(200,168,75,0.08)'}
          >
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(255,255,255,0.3)', marginBottom:6 }}>
                {todayCompleted ? 'Просмотреть ещё раз' : 'Открыть дайджест'}
              </div>
              <div style={{ fontSize:'clamp(16px,2.5vw,20px)', fontWeight:200 }}>День {currentDay} — 5 карточек</div>
            </div>
            <span style={{ fontSize:24, opacity:0.5 }}>→</span>
          </button>
        </div>

        {/* Timer */}
        {todayCompleted && currentDay < 21 && (
          <div style={{ background:'rgba(200,168,75,0.05)', border:'1px solid rgba(200,168,75,0.15)', padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:12 }}>
            <span style={{ fontSize:10, letterSpacing:'0.2em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase' }}>До открытия дня {currentDay + 1}</span>
            <span style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:200, color:'#f0ebe0', letterSpacing:'0.05em', fontVariantNumeric:'tabular-nums' }}>{formatCountdown(countdown)}</span>
          </div>
        )}

        {/* Archive */}
        <button onClick={onOpenArchive} style={{
          background:'transparent', border:'1px solid rgba(255,255,255,0.1)',
          color:'rgba(255,255,255,0.4)', padding:'12px 24px',
          fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase',
          cursor:'pointer', fontFamily:'var(--font)', width:'100%', transition:'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,168,75,0.3)'; e.currentTarget.style.color='#c8a84b' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.color='rgba(255,255,255,0.4)' }}
        >
          Архив клуба — {completedDays.length} из 21 дней
        </button>
      </div>
    </div>
  )
}
