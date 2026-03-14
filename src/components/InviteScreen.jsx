import React, { useState } from 'react'
import { activate } from '../storage'

const STEPS = [
  'Проверка доступа',
  'Идентификация личности',
  'Уровень жизни: 50 — подтверждён',
  'Доступ разрешён',
]

function Modal({ children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'2rem' }}>
      <div style={{ background:'#161616', border:'1px solid rgba(200,168,75,0.25)', padding:'3rem 2.5rem', maxWidth:420, width:'100%', textAlign:'center' }}>
        {children}
      </div>
    </div>
  )
}

export default function InviteScreen({ onActivated }) {
  const [phase, setPhase] = useState('idle') // idle | checking | done
  const [activeStep, setActiveStep] = useState(-1)
  const [doneSteps, setDoneSteps] = useState([])

  function handleActivate() {
    if (phase !== 'idle') return
    setPhase('checking')
    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i)
        if (i > 0) setDoneSteps(prev => [...prev, i - 1])
      }, i * 900)
    })
    setTimeout(() => {
      setDoneSteps([0,1,2,3])
      setActiveStep(-1)
      setPhase('done')
      activate()
      setTimeout(() => onActivated(), 1500)
    }, STEPS.length * 900 + 600)
  }

  return (
    <div style={{ background:'#0e0e0e', minHeight:'100vh', display:'flex', flexDirection:'column', fontFamily:'var(--font)', position:'relative', overflow:'hidden', color:'#f0ebe0' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg,rgba(255,255,255,0.012) 0px,rgba(255,255,255,0.012) 1px,transparent 1px,transparent 3px)', pointerEvents:'none' }} />

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.5rem 2.5rem', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'relative', zIndex:2, flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:10, height:10, background:'#c8a84b', transform:'rotate(45deg)', flexShrink:0 }} />
          <span style={{ fontSize:11, fontWeight:300, letterSpacing:'0.25em', color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>Секретный клуб · Закрытый доступ</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'#1d9e75' }} />
          <span style={{ fontSize:11, fontWeight:300, letterSpacing:'0.18em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>Система активна</span>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem 2rem', position:'relative', zIndex:2 }}>
        <div style={{ maxWidth:480, width:'100%' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'2.5rem' }}>
            <div style={{ height:1, width:32, background:'rgba(200,168,75,0.5)', flexShrink:0 }} />
            <span style={{ fontSize:11, fontWeight:300, letterSpacing:'0.3em', color:'#c8a84b', textTransform:'uppercase' }}>Персональное приглашение</span>
            <div style={{ height:1, width:32, background:'rgba(200,168,75,0.5)', flexShrink:0 }} />
          </div>

          <div style={{ fontSize:120, fontWeight:100, color:'transparent', WebkitTextStroke:'1px rgba(200,168,75,0.15)', lineHeight:0.85, letterSpacing:'-0.04em', marginBottom:-10, userSelect:'none' }}>50</div>
          <div style={{ fontSize:'clamp(34px,5vw,50px)', fontWeight:200, color:'#f0ebe0', letterSpacing:'-0.02em', lineHeight:1.1 }}>Секретный клуб</div>
          <div style={{ fontSize:'clamp(34px,5vw,50px)', fontWeight:200, color:'#c8a84b', letterSpacing:'-0.02em', lineHeight:1.1, marginBottom:'2rem' }}>50 уровня жизни</div>

          <div style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', border:'1px solid rgba(200,168,75,0.25)', background:'rgba(200,168,75,0.05)', marginBottom:'2rem' }}>
            <span style={{ fontSize:11, fontWeight:300, letterSpacing:'0.25em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase', whiteSpace:'nowrap' }}>Для</span>
            <div style={{ width:1, height:28, background:'rgba(200,168,75,0.2)', flexShrink:0 }} />
            <span style={{ fontSize:24, fontWeight:200, color:'#fff' }}>Максим Владимирович</span>
          </div>

          <button onClick={handleActivate} disabled={phase !== 'idle'} style={{
            width:'100%', background: phase === 'idle' ? '#c8a84b' : 'rgba(200,168,75,0.2)',
            border:'none', color: phase === 'idle' ? '#0e0e0e' : 'rgba(200,168,75,0.3)',
            fontSize:13, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase',
            padding:'20px 28px', cursor: phase === 'idle' ? 'pointer' : 'default',
            display:'flex', alignItems:'center', justifyContent:'space-between', fontFamily:'var(--font)',
          }}>
            <span>Активировать приглашение</span>
            <span style={{ fontSize:18 }}>→</span>
          </button>
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 2.5rem', borderTop:'1px solid rgba(255,255,255,0.06)', position:'relative', zIndex:2, flexWrap:'wrap', gap:12 }}>
        <span style={{ fontSize:10, fontWeight:300, letterSpacing:'0.2em', color:'rgba(255,255,255,0.18)', textTransform:'uppercase' }}>Est. 2025</span>
        <span style={{ fontSize:10, fontWeight:300, letterSpacing:'0.2em', color:'rgba(255,255,255,0.18)', textTransform:'uppercase' }}>21 день · Только для членов клуба</span>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:20, height:1, background:'rgba(29,158,117,0.35)' }} />
          <span style={{ fontSize:10, letterSpacing:'0.18em', color:'rgba(29,158,117,0.55)', textTransform:'uppercase' }}>Закрытый доступ</span>
        </div>
      </div>

      {/* Modal with access check animation */}
      {phase !== 'idle' && (
        <Modal>
          <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center', marginBottom:'2rem' }}>
            <div style={{ width:8, height:8, background:'#c8a84b', transform:'rotate(45deg)' }} />
            <span style={{ fontSize:10, letterSpacing:'0.28em', color:'rgba(200,168,75,0.7)', textTransform:'uppercase' }}>Система проверки</span>
          </div>
          {STEPS.map((step, i) => {
            const isDone = doneSteps.includes(i)
            const isActive = activeStep === i
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 0', borderBottom: i < STEPS.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ width:18, height:18, borderRadius:'50%', border:`1px solid ${isDone ? '#1d9e75' : isActive ? '#c8a84b' : 'rgba(255,255,255,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.3s' }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background: isDone ? '#1d9e75' : isActive ? '#c8a84b' : 'rgba(255,255,255,0.1)', transition:'all 0.3s' }} />
                </div>
                <span style={{ fontSize:13, fontWeight:300, color: isDone ? '#1d9e75' : isActive ? '#f0ebe0' : 'rgba(255,255,255,0.2)', transition:'color 0.3s', textAlign:'left' }}>{step}</span>
                {isDone && <span style={{ marginLeft:'auto', fontSize:12, color:'#1d9e75' }}>✓</span>}
              </div>
            )
          })}
          {phase === 'done' && (
            <div style={{ marginTop:'1.5rem', padding:'12px 20px', background:'rgba(29,158,117,0.08)', border:'1px solid rgba(29,158,117,0.3)' }}>
              <span style={{ fontSize:13, fontWeight:300, color:'#1d9e75' }}>Добро пожаловать в клуб, Максим Владимирович</span>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
