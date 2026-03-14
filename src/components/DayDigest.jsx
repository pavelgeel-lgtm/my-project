import React, { useState } from 'react'
import { CHALLENGES, QUESTIONS, WISDOM, GAMES, EVENTS } from '../data/content'
import { saveAnswer, getAnswerForDay, addPoints, markDayCompleted, isDayCompleted } from '../storage'

const CARD_POINTS = { event: 10, question: 10, game: 15, wisdom: 5, challenge: 15 }

export default function DayDigest({ day, onBack }) {
  const [cardIndex, setCardIndex] = useState(0)
  const cards = ['event', 'question', 'game', 'wisdom', 'challenge']
  const currentCard = cards[cardIndex]

  function goNext() {
    if (cardIndex < cards.length - 1) setCardIndex(cardIndex + 1)
    else {
      markDayCompleted(day)
      onBack()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', padding: 'clamp(1.5rem, 4vw, 3rem)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>←</button>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase' }}>День {day}</div>
          <div style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 200, color: 'var(--text-primary)' }}>Дайджест клуба</div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6, marginBottom: '2rem' }}>
        {cards.map((c, i) => (
          <div key={c} style={{
            height: 2,
            flex: 1,
            background: i <= cardIndex ? 'var(--gold)' : 'rgba(180,150,63,0.2)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {/* Card */}
      {currentCard === 'event' && <EventCard day={day} onNext={goNext} />}
      {currentCard === 'question' && <QuestionCard day={day} onNext={goNext} />}
      {currentCard === 'game' && <GameCard day={day} onNext={goNext} />}
      {currentCard === 'wisdom' && <WisdomCard day={day} onNext={goNext} />}
      {currentCard === 'challenge' && <ChallengeCard day={day} onNext={goNext} isLast />}
    </div>
  )
}

function CardShell({ label, children, onNext, nextLabel = 'Далее', points, disabled }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        {label}
        {points && <span style={{ color: 'var(--text-muted)' }}>+{points} очков</span>}
      </div>
      <div style={{ marginBottom: '2rem' }}>{children}</div>
      <button
        onClick={onNext}
        disabled={disabled}
        style={{
          background: disabled ? '#ccc' : 'var(--dark)',
          color: disabled ? '#999' : 'var(--cream)',
          border: 'none',
          padding: '16px 28px',
          fontSize: 10,
          fontWeight: 400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          cursor: disabled ? 'default' : 'pointer',
          fontFamily: 'var(--font)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          transition: 'background 0.2s',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <span>{nextLabel}</span>
        <span>→</span>
      </button>
    </div>
  )
}

function EventCard({ day, onNext }) {
  const event = EVENTS[day - 1]
  const alreadyDone = getAnswerForDay(day, 'event')

  function handleNext() {
    if (!alreadyDone) {
      saveAnswer(day, 'event', true)
      addPoints(CARD_POINTS.event)
    }
    onNext()
  }

  return (
    <CardShell label="Событие дня" points={CARD_POINTS.event} onNext={handleNext} nextLabel="Читал, далее">
      {event.photo && (
        <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--dark)', marginBottom: '1.5rem', overflow: 'hidden' }}>
          <img src={event.photo} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      {!event.photo && (
        <div style={{ width: '100%', height: 200, background: 'var(--dark)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>Фото будет добавлено</span>
        </div>
      )}
      <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>{event.year}</div>
      <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 200, color: 'var(--text-primary)', marginBottom: '1rem', letterSpacing: '-0.01em' }}>{event.title}</div>
      <div style={{ fontSize: 15, fontWeight: 300, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{event.description}</div>
      <MacNatalComment text="Каждый такой момент — часть того, кто вы есть сегодня." />
    </CardShell>
  )
}

function QuestionCard({ day, onNext }) {
  const question = QUESTIONS[day - 1]
  const saved = getAnswerForDay(day, 'question')
  const [answer, setAnswer] = useState(saved || '')
  const [submitted, setSubmitted] = useState(!!saved)

  function handleSubmit() {
    if (!answer.trim()) return
    saveAnswer(day, 'question', answer)
    addPoints(CARD_POINTS.question)
    setSubmitted(true)
  }

  return (
    <CardShell label="Вопрос клуба" points={CARD_POINTS.question} onNext={onNext} disabled={!submitted}>
      <div style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 200, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '2rem', letterSpacing: '-0.01em' }}>
        {question}
      </div>
      {!submitted ? (
        <div>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Ваш ответ..."
            style={{
              width: '100%',
              minHeight: 120,
              background: 'var(--cream-dark)',
              border: '1px solid rgba(180,150,63,0.2)',
              padding: '1rem',
              fontSize: 14,
              fontWeight: 300,
              color: 'var(--text-primary)',
              fontFamily: 'var(--font)',
              resize: 'vertical',
              lineHeight: 1.6,
              marginBottom: '1rem',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            style={{
              background: answer.trim() ? 'var(--gold)' : 'rgba(180,150,63,0.2)',
              color: answer.trim() ? 'var(--dark)' : 'var(--text-muted)',
              border: 'none',
              padding: '12px 24px',
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: answer.trim() ? 'pointer' : 'default',
              fontFamily: 'var(--font)',
              transition: 'all 0.2s',
            }}
          >
            Ответить
          </button>
        </div>
      ) : (
        <div>
          <div style={{ background: 'rgba(180,150,63,0.06)', border: '1px solid rgba(180,150,63,0.2)', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>Ваш ответ</div>
            <div style={{ fontSize: 14, fontWeight: 300, color: 'var(--text-primary)', lineHeight: 1.6 }}>{answer}</div>
          </div>
          <MacNatalComment text="Честный ответ — редкость. Спасибо за него." />
        </div>
      )}
    </CardShell>
  )
}

function GameCard({ day, onNext }) {
  const game = GAMES[day - 1]
  const saved = getAnswerForDay(day, 'game')
  const [chosen, setChosen] = useState(saved)
  const [revealed, setRevealed] = useState(!!saved)

  function handleAnswer(ans) {
    if (revealed) return
    setChosen(ans)
    setRevealed(true)
    saveAnswer(day, 'game', ans)
    addPoints(CARD_POINTS.game)
  }

  const isCorrect = game.type === 'truth'
    ? chosen === game.answer
    : chosen === game.answer

  return (
    <CardShell label="Мини-игра" points={CARD_POINTS.game} onNext={onNext} disabled={!revealed}>
      <div style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 200, color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '2rem' }}>
        {game.question}
      </div>

      {game.type === 'truth' && (
        <div style={{ display: 'flex', gap: 12 }}>
          {['Правда', 'Миф'].map((label, i) => {
            const val = i === 0
            const isSelected = chosen === val
            const isRight = revealed && val === game.answer
            return (
              <button
                key={label}
                onClick={() => handleAnswer(val)}
                style={{
                  flex: 1,
                  padding: '16px',
                  border: '1px solid ' + (isRight ? 'rgba(74,154,90,0.5)' : isSelected && !isRight ? 'rgba(200,80,80,0.5)' : 'rgba(180,150,63,0.3)'),
                  background: isRight ? 'rgba(74,154,90,0.08)' : isSelected && !isRight ? 'rgba(200,80,80,0.08)' : 'transparent',
                  color: isRight ? '#4a9a5a' : isSelected && !isRight ? '#c85050' : 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 300,
                  letterSpacing: '0.05em',
                  cursor: revealed ? 'default' : 'pointer',
                  fontFamily: 'var(--font)',
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {game.type === 'guess' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {game.options.map(opt => {
            const isSelected = chosen === opt
            const isRight = revealed && opt === game.answer
            return (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: '14px',
                  border: '1px solid ' + (isRight ? 'rgba(74,154,90,0.5)' : isSelected && !isRight ? 'rgba(200,80,80,0.5)' : 'rgba(180,150,63,0.3)'),
                  background: isRight ? 'rgba(74,154,90,0.08)' : isSelected && !isRight ? 'rgba(200,80,80,0.08)' : 'transparent',
                  color: isRight ? '#4a9a5a' : isSelected && !isRight ? '#c85050' : 'var(--text-primary)',
                  fontSize: 13,
                  fontWeight: 300,
                  cursor: revealed ? 'default' : 'pointer',
                  fontFamily: 'var(--font)',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                }}
              >
                {opt}
              </button>
            )
          })}
        </div>
      )}

      {revealed && (
        <div style={{ marginTop: '1.5rem', padding: '1rem 1.25rem', background: isCorrect ? 'rgba(74,154,90,0.06)' : 'rgba(180,150,63,0.06)', borderLeft: '2px solid ' + (isCorrect ? '#4a9a5a' : 'var(--gold)') }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: isCorrect ? '#4a9a5a' : 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>
            {isCorrect ? '✓ Верно!' : 'Почти!'}
          </div>
          <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {game.fact || `Правильный ответ: ${game.answer}`}
          </div>
        </div>
      )}

      {revealed && <MacNatalComment text="В этом клубе важно участие, а не результат." />}
    </CardShell>
  )
}

function WisdomCard({ day, onNext }) {
  const wisdom = WISDOM[day - 1]
  const saved = getAnswerForDay(day, 'wisdom')

  function handleNext() {
    if (!saved) {
      saveAnswer(day, 'wisdom', true)
      addPoints(CARD_POINTS.wisdom)
    }
    onNext()
  }

  return (
    <CardShell label="Мудрость клуба" points={CARD_POINTS.wisdom} onNext={handleNext} nextLabel="Принято, далее">
      <div style={{ padding: '2rem', background: 'var(--dark)', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 200, color: '#f5f0e8', lineHeight: 1.5, marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>
          «{wisdom.text}»
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>
          — {wisdom.author}
        </div>
      </div>
    </CardShell>
  )
}

function ChallengeCard({ day, onNext, isLast }) {
  const challenge = CHALLENGES[day - 1]
  const saved = getAnswerForDay(day, 'challenge')
  const [accepted, setAccepted] = useState(!!saved)

  function handleAccept() {
    if (!saved) {
      saveAnswer(day, 'challenge', true)
      addPoints(CARD_POINTS.challenge)
    }
    setAccepted(true)
  }

  return (
    <CardShell label="Челлендж дня" points={CARD_POINTS.challenge} onNext={onNext} nextLabel={isLast ? 'Завершить день' : 'Далее'} disabled={!accepted}>
      <div style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 200, color: 'var(--text-primary)', lineHeight: 1.5, marginBottom: '2rem', letterSpacing: '-0.01em' }}>
        {challenge}
      </div>

      {!accepted ? (
        <button
          onClick={handleAccept}
          style={{
            background: 'var(--gold)',
            border: 'none',
            color: 'var(--dark)',
            padding: '14px 28px',
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'var(--font)',
          }}
        >
          Принять челлендж
        </button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(74,154,90,0.06)', borderLeft: '2px solid #4a9a5a' }}>
          <span style={{ fontSize: 9, letterSpacing: '0.2em', color: '#4a9a5a', textTransform: 'uppercase' }}>✓ Челлендж принят</span>
        </div>
      )}

      {accepted && <MacNatalComment text="Маленькие действия — основа большой жизни." />}
    </CardShell>
  )
}

function MacNatalComment({ text }) {
  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ width: 32, height: 32, background: 'var(--dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 500 }}>МН</span>
      </div>
      <div style={{ background: 'rgba(180,150,63,0.06)', border: '1px solid rgba(180,150,63,0.15)', padding: '10px 14px', flex: 1 }}>
        <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>Мак Натал</div>
        <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  )
}
