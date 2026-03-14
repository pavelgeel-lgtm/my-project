import React, { useState, useEffect } from 'react'
import { getCurrentDay, getPoints, getCompletedDays, getMsUntilNextDay, isDayCompleted } from '../storage'

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':')
}

export default function Dashboard({ onOpenDay, onOpenArchive, onOpenChat }) {
  const [currentDay, setCurrentDay] = useState(getCurrentDay())
  const [points, setPoints] = useState(getPoints())
  const [completedDays, setCompletedDays] = useState(getCompletedDays())
  const [countdown, setCountdown] = useState(getMsUntilNextDay())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDay(getCurrentDay())
      setPoints(getPoints())
      setCompletedDays(getCompletedDays())
      setCountdown(getMsUntilNextDay())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const todayCompleted = isDayCompleted(currentDay)
  const progress = Math.round((completedDays.length / 21) * 100)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.3em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>Секретный клуб</div>
          <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 200, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Добро пожаловать, Максим</div>
        </div>
        <button
          onClick={onOpenChat}
          style={{
            background: 'var(--dark)', color: 'var(--cream)',
            border: 'none', padding: '10px 20px',
            fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
            cursor: 'pointer', fontFamily: 'var(--font)', fontWeight: 400,
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ fontSize: 14 }}>◆</span> Мак Натал
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: '2rem' }}>
        <StatCard label="Уровень жизни" value="50" accent />
        <StatCard label="День клуба" value={`${currentDay} / 21`} />
        <StatCard label="Очки клуба" value={points} />
        <StatCard label="Пройдено дней" value={completedDays.length} />
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Прогресс клуба</span>
          <span style={{ fontSize: 9, letterSpacing: '0.15em', color: 'var(--gold)' }}>{progress}%</span>
        </div>
        <div style={{ height: 2, background: 'rgba(180,150,63,0.15)', borderRadius: 1 }}>
          <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gold)', borderRadius: 1, transition: 'width 0.5s ease' }}></div>
        </div>
      </div>

      {/* Today's digest */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            День {currentDay} — Дайджест
          </div>
          {todayCompleted && (
            <div style={{ fontSize: 9, letterSpacing: '0.15em', color: '#4a9a5a', textTransform: 'uppercase' }}>
              ✓ Выполнен
            </div>
          )}
        </div>

        <button
          onClick={() => onOpenDay(currentDay)}
          style={{
            width: '100%',
            background: todayCompleted ? 'rgba(74,154,90,0.06)' : 'var(--dark)',
            border: todayCompleted ? '1px solid rgba(74,154,90,0.3)' : 'none',
            color: todayCompleted ? '#4a9a5a' : 'var(--cream)',
            padding: '1.5rem 2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (!todayCompleted) e.currentTarget.style.background = 'var(--dark-mid)' }}
          onMouseLeave={e => { if (!todayCompleted) e.currentTarget.style.background = 'var(--dark)' }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5, marginBottom: 6 }}>
              {todayCompleted ? 'Просмотреть ещё раз' : 'Открыть дайджест'}
            </div>
            <div style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 200, letterSpacing: '-0.01em' }}>
              День {currentDay} — 5 карточек ждут
            </div>
          </div>
          <span style={{ fontSize: 24, opacity: 0.6 }}>→</span>
        </button>
      </div>

      {/* Timer for next day */}
      {!todayCompleted ? null : (
        <div style={{
          background: 'rgba(180,150,63,0.06)',
          border: '1px solid rgba(180,150,63,0.2)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>
            До открытия дня {currentDay + 1}
          </div>
          <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 200, color: 'var(--text-primary)', letterSpacing: '0.05em', fontVariantNumeric: 'tabular-nums' }}>
            {formatCountdown(countdown)}
          </div>
        </div>
      )}

      {/* Archive link */}
      <button
        onClick={onOpenArchive}
        style={{
          background: 'transparent',
          border: '1px solid rgba(180,150,63,0.3)',
          color: 'var(--gold)',
          padding: '12px 24px',
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          width: '100%',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(180,150,63,0.06)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        Архив клуба — {completedDays.length} дней
      </button>

      {/* Footer */}
      <div style={{ marginTop: '3rem', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 8, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Клуб 50 уровня жизни</span>
        <span style={{ color: 'var(--gold)', fontSize: 8 }}>·</span>
        <span style={{ fontSize: 8, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Est. 2025</span>
      </div>
    </div>
  )
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: accent ? 'var(--dark)' : 'var(--cream-dark)',
      padding: '1rem 1.25rem',
    }}>
      <div style={{ fontSize: 9, letterSpacing: '0.2em', color: accent ? 'rgba(212,175,95,0.6)' : 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 'clamp(20px, 2.5vw, 26px)', fontWeight: 200, color: accent ? 'var(--gold)' : 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  )
}
