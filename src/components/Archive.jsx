import React from 'react'
import { getCurrentDay, isDayCompleted, getCompletedDays, getPoints } from '../storage'
import { WISDOM } from '../data/content'

export default function Archive({ onBack, onOpenDay, onOpenChat }) {
  const currentDay = getCurrentDay()
  const completedDays = getCompletedDays()
  const points = getPoints()

  return (
    <div style={{ background:'#0e0e0e', minHeight:'100vh', color:'#f0ebe0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.2rem 2rem', borderBottom:'1px solid rgba(255,255,255,0.07)', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <button onClick={onBack} style={{ color:'rgba(255,255,255,0.4)', fontSize:20, cursor:'pointer', background:'none', border:'none', padding:0 }}>←</button>
          <div>
            <div style={{ fontSize:10, letterSpacing:'0.22em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase' }}>Секретный клуб</div>
            <div style={{ fontSize:20, fontWeight:200 }}>Архив клуба</div>
          </div>
        </div>
        <button onClick={onOpenChat} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(200,168,75,0.1)', border:'1px solid rgba(200,168,75,0.25)', color:'#c8a84b', padding:'8px 16px', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer', fontFamily:'var(--font)' }}>
          <div style={{ width:6, height:6, background:'#c8a84b', transform:'rotate(45deg)' }} />
          Мак Натал
        </button>
      </div>

      <div style={{ padding:'clamp(1.5rem,4vw,2.5rem)' }}>
        <div style={{ display:'flex', gap:12, marginBottom:'2rem', flexWrap:'wrap' }}>
          <div style={{ background:'rgba(200,168,75,0.08)', border:'1px solid rgba(200,168,75,0.2)', padding:'12px 20px' }}>
            <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(200,168,75,0.5)', textTransform:'uppercase', marginBottom:4 }}>Очки клуба</div>
            <div style={{ fontSize:24, fontWeight:200, color:'#c8a84b' }}>{points}</div>
          </div>
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', padding:'12px 20px' }}>
            <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:4 }}>Пройдено</div>
            <div style={{ fontSize:24, fontWeight:200 }}>{completedDays.length} / 21</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10 }}>
          {Array.from({length:21},(_,i)=>i+1).map(day => {
            const unlocked = day <= currentDay
            const completed = isDayCompleted(day)
            return (
              <div key={day} onClick={() => unlocked && onOpenDay(day)} style={{
                padding:'1.25rem', cursor: unlocked ? 'pointer' : 'default',
                background: completed ? 'rgba(29,158,117,0.06)' : unlocked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border:`1px solid ${completed ? 'rgba(29,158,117,0.25)' : unlocked ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                opacity: unlocked ? 1 : 0.4, transition:'all 0.2s',
              }}
                onMouseEnter={e => { if(unlocked) e.currentTarget.style.borderColor = completed ? 'rgba(29,158,117,0.4)' : 'rgba(200,168,75,0.3)' }}
                onMouseLeave={e => { if(unlocked) e.currentTarget.style.borderColor = completed ? 'rgba(29,158,117,0.25)' : 'rgba(255,255,255,0.08)' }}
              >
                <div style={{ fontSize:9, letterSpacing:'0.2em', color: completed ? '#1d9e75' : 'rgba(200,168,75,0.6)', textTransform:'uppercase', marginBottom:8 }}>
                  День {day} {completed ? '✓' : unlocked ? '— открыт' : '— закрыт'}
                </div>
                {completed && <div style={{ fontSize:12, fontWeight:300, color:'rgba(255,255,255,0.4)', lineHeight:1.5 }}>«{WISDOM[day-1].text.slice(0,55)}...»</div>}
                {!completed && unlocked && <div style={{ fontSize:12, fontWeight:300, color:'rgba(255,255,255,0.25)' }}>Нажмите чтобы открыть</div>}
                {!unlocked && <div style={{ fontSize:12, fontWeight:300, color:'rgba(255,255,255,0.2)' }}>Откроется в 7:00 МСК</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
