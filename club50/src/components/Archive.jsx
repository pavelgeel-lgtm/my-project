import React from 'react'
import { getCurrentDay, isDayCompleted, getCompletedDays, getAnswerForDay, getPoints } from '../storage'
import { CHALLENGES, QUESTIONS, WISDOM } from '../data/content'

export default function Archive({ onBack, onOpenDay }) {
  const currentDay = getCurrentDay()
  const completedDays = getCompletedDays()
  const points = getPoints()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>←</button>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>Секретный клуб</div>
          <div style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 200, color: 'var(--text-primary)' }}>Архив клуба</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--dark)', padding: '12px 20px' }}>
          <div style={{ fontSize: 8, letterSpacing: '0.2em', color: 'rgba(212,175,95,0.5)', textTransform: 'uppercase', marginBottom: 4 }}>Очки</div>
          <div style={{ fontSize: 22, fontWeight: 200, color: 'var(--gold)' }}>{points}</div>
        </div>
        <div style={{ background: 'var(--cream-dark)', padding: '12px 20px' }}>
          <div style={{ fontSize: 8, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Пройдено</div>
          <div style={{ fontSize: 22, fontWeight: 200, color: 'var(--text-primary)' }}>{completedDays.length} / 21</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {Array.from({ length: 21 }, (_, i) => i + 1).map(day => {
          const unlocked = day <= currentDay
          const completed = isDayCompleted(day)
          return (
            <DayCard
              key={day}
              day={day}
              unlocked={unlocked}
              completed={completed}
              onClick={() => unlocked && onOpenDay(day)}
            />
          )
        })}
      </div>
    </div>
  )
}

function DayCard({ day, unlocked, completed, onClick }) {
  const wisdom = WISDOM[day - 1]

  return (
    <div
      onClick={onClick}
      style={{
        padding: '1.25rem',
        background: completed ? 'rgba(74,154,90,0.04)' : unlocked ? 'var(--cream-dark)' : 'rgba(0,0,0,0.04)',
        border: '1px solid ' + (completed ? 'rgba(74,154,90,0.2)' : unlocked ? 'rgba(180,150,63,0.15)' : 'rgba(0,0,0,0.08)'),
        cursor: unlocked ? 'pointer' : 'default',
        opacity: unlocked ? 1 : 0.5,
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => { if (unlocked) e.currentTarget.style.background = completed ? 'rgba(74,154,90,0.08)' : 'var(--cream)' }}
      onMouseLeave={e => { if (unlocked) e.currentTarget.style.background = completed ? 'rgba(74,154,90,0.04)' : 'var(--cream-dark)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.2em', color: completed ? '#4a9a5a' : 'var(--gold)', textTransform: 'uppercase' }}>
          День {day} {completed ? '✓' : unlocked ? '— Открыт' : '— Закрыт'}
        </div>
      </div>
      {completed && (
        <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          «{wisdom.text.slice(0, 60)}...»
        </div>
      )}
      {!completed && unlocked && (
        <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--text-muted)' }}>Нажмите чтобы открыть</div>
      )}
      {!unlocked && (
        <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--text-muted)' }}>Откроется в 7:00 МСК</div>
      )}
    </div>
  )
}
