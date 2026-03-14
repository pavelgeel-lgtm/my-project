import React, { useState } from 'react'
import { activate } from '../storage'

const s = {
  root: {
    minHeight: '100vh',
    background: 'var(--cream)',
    display: 'flex',
    alignItems: 'stretch',
    overflow: 'hidden',
  },
  left: {
    width: '55%',
    padding: '3.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'var(--cream)',
    position: 'relative',
    zIndex: 2,
  },
  right: {
    width: '45%',
    background: 'var(--dark)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  texture: {
    position: 'absolute',
    inset: 0,
    backgroundImage: 'repeating-linear-gradient(135deg, rgba(212,175,95,0.04) 0px, rgba(212,175,95,0.04) 1px, transparent 1px, transparent 14px)',
  },
  circleOuter: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300, height: 300,
    borderRadius: '50%',
    border: '1px solid var(--gold)',
  },
  circleInner: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200, height: 200,
    borderRadius: '50%',
    border: '1px solid rgba(180,150,63,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogram: {
    fontSize: 100,
    fontWeight: 200,
    color: 'var(--gold)',
    lineHeight: 1,
    letterSpacing: '-0.04em',
    userSelect: 'none',
  },
  topMeta: { display: 'flex', alignItems: 'center', gap: 14 },
  metaMark: { width: 24, height: 1, background: 'var(--gold)' },
  metaText: { fontSize: 9, fontWeight: 300, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase' },
  eyebrow: { fontSize: 10, fontWeight: 300, letterSpacing: '0.22em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1.4rem' },
  titleMain: { fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 200, color: 'var(--text-primary)', lineHeight: 1.08, letterSpacing: '-0.025em', display: 'block' },
  titleAccent: { fontSize: 'clamp(32px, 4vw, 46px)', fontWeight: 200, color: 'var(--gold)', lineHeight: 1.08, letterSpacing: '-0.025em', display: 'block', marginBottom: '1.6rem' },
  subtitle: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '2.5rem', flexWrap: 'wrap' },
  subText: { fontSize: 10, fontWeight: 300, letterSpacing: '0.18em', color: 'var(--text-muted)', textTransform: 'uppercase' },
  subDot: { width: 2, height: 2, background: 'var(--gold)', borderRadius: '50%' },
  recLabel: { fontSize: 9, fontWeight: 300, letterSpacing: '0.28em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 },
  recName: { fontSize: 'clamp(28px, 3.5vw, 38px)', fontWeight: 200, color: 'var(--text-primary)', letterSpacing: '-0.02em', borderBottom: '1px solid rgba(180,150,63,0.3)', paddingBottom: 10, display: 'inline-block', marginBottom: '2.5rem' },
  btn: {
    background: 'var(--dark)',
    border: 'none',
    color: 'var(--cream)',
    fontSize: 11,
    fontWeight: 400,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    padding: '18px 28px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    transition: 'background 0.2s',
    fontFamily: 'var(--font)',
  },
  btnDisabled: { background: '#ccc', color: '#999', cursor: 'default' },
  terminal: { borderTop: '1px solid rgba(180,150,63,0.2)', paddingTop: 16, marginTop: 14 },
  tRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' },
  tIcon: { width: 14, height: 14, border: '1px solid #ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.3s' },
  tIconDot: { width: 4, height: 4, borderRadius: '50%', background: '#ccc', transition: 'all 0.3s' },
  tText: { fontSize: 10, fontWeight: 300, letterSpacing: '0.1em', color: '#bbb', transition: 'color 0.3s' },
  welcome: { display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, padding: '12px 16px', background: 'rgba(180,150,63,0.08)', borderLeft: '2px solid var(--gold)' },
  welcomeText: { fontSize: 14, fontWeight: 300, color: 'var(--gold)', letterSpacing: '0.06em' },
  bottomMeta: { display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' },
  bText: { fontSize: 8, fontWeight: 300, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' },
  bSep: { color: 'var(--gold)', fontSize: 10 },
}

const STEPS = [
  'Проверка доступа',
  'Идентификация личности',
  'Уровень жизни: 50 — подтверждён',
  'Доступ разрешён',
]

export default function InviteScreen({ onActivated }) {
  const [phase, setPhase] = useState('idle') // idle | loading | done
  const [activeStep, setActiveStep] = useState(-1)
  const [doneSteps, setDoneSteps] = useState([])

  function handleActivate() {
    if (phase !== 'idle') return
    setPhase('loading')

    STEPS.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i)
        if (i > 0) setDoneSteps(prev => [...prev, i - 1])
      }, i * 800)
    })

    setTimeout(() => {
      setDoneSteps([0, 1, 2, 3])
      setActiveStep(-1)
      setPhase('done')
      activate()
      setTimeout(() => onActivated(), 1200)
    }, STEPS.length * 800 + 400)
  }

  const isMobile = window.innerWidth < 768

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column', padding: '2.5rem 2rem' }}>
        <div style={s.topMeta}>
          <div style={s.metaMark}></div>
          <div style={s.metaText}>Membres Seulement</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 0' }}>
          <div style={{ ...s.eyebrow, color: 'rgba(255,255,255,0.3)' }}>Персональное приглашение</div>
          <span style={{ ...s.titleMain, color: '#f5f0e8', fontSize: 'clamp(28px, 8vw, 42px)' }}>Секретный клуб</span>
          <span style={{ ...s.titleAccent, fontSize: 'clamp(28px, 8vw, 42px)' }}>50 уровня жизни</span>

          <div style={{ ...s.subtitle, marginBottom: '3rem' }}>
            <span style={s.subText}>21 день</span>
            <span style={s.subDot}></span>
            <span style={s.subText}>Закрытый доступ</span>
          </div>

          <div style={s.recLabel}>Приглашение для</div>
          <div style={{ ...s.recName, color: '#fff', borderColor: 'rgba(180,150,63,0.3)' }}>Максим</div>

          {phase === 'idle' && (
            <button style={{ ...s.btn, background: 'var(--gold)', color: 'var(--dark)', fontWeight: 500 }} onClick={handleActivate}>
              <span>Активировать приглашение</span>
              <span>→</span>
            </button>
          )}

          {phase !== 'idle' && (
            <div style={s.terminal}>
              {STEPS.map((step, i) => (
                <div key={i} style={s.tRow}>
                  <div style={{ ...s.tIcon, borderColor: doneSteps.includes(i) ? '#4a9a5a' : activeStep === i ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}>
                    <div style={{ ...s.tIconDot, background: doneSteps.includes(i) ? '#4a9a5a' : activeStep === i ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}></div>
                  </div>
                  <div style={{ ...s.tText, color: doneSteps.includes(i) ? '#4a9a5a' : activeStep === i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)' }}>{step}</div>
                </div>
              ))}
              {phase === 'done' && (
                <div style={s.welcome}>
                  <div style={s.welcomeText}>Добро пожаловать в клуб, Максим</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={s.bottomMeta}>
          <div style={{ ...s.bText, color: 'rgba(255,255,255,0.2)' }}>Est. 2025</div>
          <div style={s.bSep}>·</div>
          <div style={{ ...s.bText, color: 'rgba(255,255,255,0.2)' }}>Клуб 50 уровня жизни</div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.root}>
      <div style={s.left}>
        <div style={s.topMeta}>
          <div style={s.metaMark}></div>
          <div style={s.metaText}>Membres Seulement</div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 0' }}>
          <div style={s.eyebrow}>Персональное приглашение</div>
          <div>
            <span style={s.titleMain}>Секретный клуб</span>
            <span style={s.titleAccent}>50 уровня жизни</span>
          </div>

          <div style={s.subtitle}>
            <span style={s.subText}>21 день</span>
            <span style={s.subDot}></span>
            <span style={s.subText}>Закрытый доступ</span>
            <span style={s.subDot}></span>
            <span style={s.subText}>Только для членов</span>
          </div>

          <div style={s.recLabel}>Приглашение для</div>
          <div style={s.recName}>Максим</div>

          {phase === 'idle' && (
            <button
              style={s.btn}
              onClick={handleActivate}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--dark-mid)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--dark)'}
            >
              <span>Активировать приглашение</span>
              <span style={{ fontSize: 16 }}>→</span>
            </button>
          )}

          {phase !== 'idle' && (
            <div>
              <button style={{ ...s.btn, ...s.btnDisabled }} disabled>
                <span>Активировать приглашение</span>
                <span style={{ fontSize: 16 }}>→</span>
              </button>
              <div style={s.terminal}>
                {STEPS.map((step, i) => (
                  <div key={i} style={s.tRow}>
                    <div style={{ ...s.tIcon, borderColor: doneSteps.includes(i) ? '#4a9a5a' : activeStep === i ? 'var(--gold)' : '#ccc' }}>
                      <div style={{ ...s.tIconDot, background: doneSteps.includes(i) ? '#4a9a5a' : activeStep === i ? 'var(--gold)' : '#ccc' }}></div>
                    </div>
                    <div style={{ ...s.tText, color: doneSteps.includes(i) ? '#4a9a5a' : activeStep === i ? '#333' : '#bbb' }}>{step}</div>
                  </div>
                ))}
                {phase === 'done' && (
                  <div style={s.welcome}>
                    <div style={s.welcomeText}>Добро пожаловать в клуб, Максим</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div style={s.bottomMeta}>
          <div style={s.bText}>Est. 2025</div>
          <div style={s.bSep}>·</div>
          <div style={s.bText}>Клуб 50 уровня жизни</div>
          <div style={s.bSep}>·</div>
          <div style={s.bText}>Приватный</div>
        </div>
      </div>

      <div style={s.right}>
        <div style={s.texture}></div>
        <div style={s.circleOuter}></div>
        <div style={s.circleInner}>
          <div style={s.monogram}>50</div>
        </div>
      </div>
    </div>
  )
}
