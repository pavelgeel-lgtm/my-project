import React, { useState } from 'react'
import { CHALLENGES, QUESTIONS, WISDOM, GAMES, EVENTS } from '../data/content'
import { saveAnswer, getAnswerForDay, addPoints, markDayCompleted } from '../storage'

const POINTS = { event:10, question:10, game:15, wisdom:5, challenge:15 }

function TopBar({ day, onBack, onChat }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.2rem 2rem', borderBottom:'1px solid rgba(255,255,255,0.07)', flexWrap:'wrap', gap:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <button onClick={onBack} style={{ color:'rgba(255,255,255,0.4)', fontSize:20, cursor:'pointer', background:'none', border:'none', padding:0 }}>←</button>
        <div>
          <div style={{ fontSize:10, letterSpacing:'0.22em', color:'#c8a84b', textTransform:'uppercase' }}>День {day}</div>
          <div style={{ fontSize:18, fontWeight:200, color:'#f0ebe0' }}>Дайджест клуба</div>
        </div>
      </div>
      <button onClick={onChat} style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(200,168,75,0.1)', border:'1px solid rgba(200,168,75,0.25)', color:'#c8a84b', padding:'8px 16px', fontSize:11, letterSpacing:'0.18em', textTransform:'uppercase', cursor:'pointer', fontFamily:'var(--font)' }}>
        <div style={{ width:6, height:6, background:'#c8a84b', transform:'rotate(45deg)' }} />
        Мак Натал
      </button>
    </div>
  )
}

function PointsPopup({ pts, visible }) {
  if (!visible) return null
  return (
    <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', background:'rgba(200,168,75,0.95)', color:'#0e0e0e', padding:'20px 40px', fontSize:28, fontWeight:600, letterSpacing:'-0.02em', zIndex:1000, pointerEvents:'none', animation:'fadeOut 1.5s ease forwards' }}>
      +{pts} очков
      <style>{`@keyframes fadeOut { 0%{opacity:1;transform:translate(-50%,-60%)} 100%{opacity:0;transform:translate(-50%,-80%)} }`}</style>
    </div>
  )
}

export default function DayDigest({ day, onBack, onOpenChat }) {
  const [cardIndex, setCardIndex] = useState(0)
  const [showPoints, setShowPoints] = useState(false)
  const [lastPoints, setLastPoints] = useState(0)
  const cards = ['event','question','game','wisdom','challenge']

  function awardPoints(pts) {
    addPoints(pts)
    setLastPoints(pts)
    setShowPoints(true)
    setTimeout(() => setShowPoints(false), 1600)
  }

  function goNext() {
    if (cardIndex < cards.length - 1) setCardIndex(cardIndex + 1)
    else { markDayCompleted(day); onBack() }
  }

  return (
    <div style={{ background:'#0e0e0e', minHeight:'100vh', display:'flex', flexDirection:'column', color:'#f0ebe0' }}>
      <PointsPopup pts={lastPoints} visible={showPoints} />
      <TopBar day={day} onBack={onBack} onChat={onOpenChat} />

      <div style={{ padding:'clamp(1.5rem,4vw,2.5rem)' }}>
        {/* Progress */}
        <div style={{ display:'flex', gap:6, marginBottom:'2rem' }}>
          {cards.map((c, i) => (
            <div key={c} style={{ height:2, flex:1, background: i <= cardIndex ? '#c8a84b' : 'rgba(200,168,75,0.15)', transition:'background 0.3s' }} />
          ))}
        </div>

        {cards[cardIndex] === 'event' && <EventCard day={day} onNext={goNext} onPoints={awardPoints} />}
        {cards[cardIndex] === 'question' && <QuestionCard day={day} onNext={goNext} onPoints={awardPoints} />}
        {cards[cardIndex] === 'game' && <GameCard day={day} onNext={goNext} onPoints={awardPoints} />}
        {cards[cardIndex] === 'wisdom' && <WisdomCard day={day} onNext={goNext} onPoints={awardPoints} />}
        {cards[cardIndex] === 'challenge' && <ChallengeCard day={day} onNext={goNext} onPoints={awardPoints} />}
      </div>
    </div>
  )
}

function Btn({ onClick, disabled, children }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:'100%', background: disabled ? 'rgba(255,255,255,0.05)' : '#c8a84b',
      border:'none', color: disabled ? 'rgba(255,255,255,0.2)' : '#0e0e0e',
      padding:'18px 28px', fontSize:12, fontWeight:600, letterSpacing:'0.2em',
      textTransform:'uppercase', cursor: disabled ? 'default' : 'pointer',
      fontFamily:'var(--font)', display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.2s',
    }}>
      <span>{children}</span><span style={{ fontSize:16 }}>→</span>
    </button>
  )
}

function MacNatal({ text }) {
  return (
    <div style={{ marginTop:'1.5rem', display:'flex', gap:12, alignItems:'flex-start' }}>
      <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(200,168,75,0.12)', border:'1px solid rgba(200,168,75,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <span style={{ fontSize:10, color:'#c8a84b', fontWeight:500 }}>МН</span>
      </div>
      <div style={{ background:'rgba(200,168,75,0.05)', border:'1px solid rgba(200,168,75,0.15)', padding:'12px 16px', flex:1 }}>
        <div style={{ fontSize:9, letterSpacing:'0.18em', color:'rgba(200,168,75,0.7)', textTransform:'uppercase', marginBottom:6 }}>Мак Натал</div>
        <div style={{ fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>{text}</div>
      </div>
    </div>
  )
}

function Label({ children, pts }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.5rem' }}>
      <span style={{ fontSize:10, letterSpacing:'0.25em', color:'#c8a84b', textTransform:'uppercase' }}>{children}</span>
      {pts && <span style={{ fontSize:10, letterSpacing:'0.15em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase' }}>+{pts} очков</span>}
    </div>
  )
}

function EventCard({ day, onNext, onPoints }) {
  const event = EVENTS[day - 1]
  const done = getAnswerForDay(day, 'event')

  function handle() {
    if (!done) { saveAnswer(day, 'event', true); onPoints(POINTS.event) }
    onNext()
  }

  return (
    <div>
      <Label pts={POINTS.event}>Событие дня</Label>
      {event.photo
        ? <img src={event.photo} alt={event.title} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover', marginBottom:'1.5rem' }} />
        : <div style={{ width:'100%', height:220, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.5rem' }}>
            <span style={{ fontSize:10, letterSpacing:'0.2em', color:'rgba(255,255,255,0.2)', textTransform:'uppercase' }}>Фото появится здесь</span>
          </div>
      }
      {event.year && <div style={{ fontSize:10, letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', marginBottom:8 }}>{event.year}</div>}
      <div style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:200, color:'#f0ebe0', marginBottom:'1rem', letterSpacing:'-0.01em' }}>{event.title}</div>
      <div style={{ fontSize:15, fontWeight:300, color:'rgba(255,255,255,0.6)', lineHeight:1.7, marginBottom:'1.5rem' }}>{event.description}</div>
      <MacNatal text="Каждый такой момент — часть того, кто вы есть сегодня." />
      <div style={{ marginTop:'1.5rem' }}><Btn onClick={handle}>Читал, далее</Btn></div>
    </div>
  )
}

function QuestionCard({ day, onNext, onPoints }) {
  const question = QUESTIONS[day - 1]
  const saved = getAnswerForDay(day, 'question')
  const [answer, setAnswer] = useState(saved || '')
  const [submitted, setSubmitted] = useState(!!saved)

  function submit() {
    if (!answer.trim()) return
    saveAnswer(day, 'question', answer)
    onPoints(POINTS.question)
    setSubmitted(true)
  }

  return (
    <div>
      <Label pts={POINTS.question}>Вопрос клуба</Label>
      <div style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:200, color:'#f0ebe0', lineHeight:1.4, marginBottom:'2rem' }}>{question}</div>
      {!submitted
        ? <>
            <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Ваш ответ..." style={{ width:'100%', minHeight:120, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', padding:'1rem', fontSize:14, fontWeight:300, color:'#f0ebe0', fontFamily:'var(--font)', resize:'vertical', lineHeight:1.6, marginBottom:'1rem' }} />
            <button onClick={submit} disabled={!answer.trim()} style={{ background: answer.trim() ? '#c8a84b' : 'rgba(200,168,75,0.15)', color: answer.trim() ? '#0e0e0e' : 'rgba(200,168,75,0.3)', border:'none', padding:'12px 24px', fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', cursor: answer.trim() ? 'pointer' : 'default', fontFamily:'var(--font)', marginBottom:'1.5rem' }}>Ответить</button>
          </>
        : <>
            <div style={{ background:'rgba(200,168,75,0.05)', border:'1px solid rgba(200,168,75,0.2)', padding:'1rem 1.25rem', marginBottom:'1rem' }}>
              <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase', marginBottom:6 }}>Ваш ответ</div>
              <div style={{ fontSize:14, fontWeight:300, color:'rgba(255,255,255,0.7)', lineHeight:1.6 }}>{answer}</div>
            </div>
            <MacNatal text="Честный ответ — редкость. Спасибо за него." />
            <div style={{ marginTop:'1.5rem' }}><Btn onClick={onNext}>Далее</Btn></div>
          </>
      }
    </div>
  )
}

function GameCard({ day, onNext, onPoints }) {
  const game = GAMES[day - 1]
  const saved = getAnswerForDay(day, 'game')
  const [chosen, setChosen] = useState(saved)
  const [revealed, setRevealed] = useState(saved !== null)

  function pick(val) {
    if (revealed) return
    setChosen(val)
    setRevealed(true)
    saveAnswer(day, 'game', val ? 'true' : 'false')
    onPoints(POINTS.game)
  }

  const userCorrect = revealed && chosen === game.truth

  return (
    <div>
      <Label pts={POINTS.game}>Миф или легенда?</Label>
      <div style={{ fontSize:'clamp(17px,2.5vw,22px)', fontWeight:200, color:'#f0ebe0', lineHeight:1.5, marginBottom:'2rem' }}>{game.statement}</div>

      <div style={{ display:'flex', gap:12, marginBottom:'1.5rem' }}>
        {[{label:'Правда', val:true},{label:'Миф',val:false}].map(({label,val}) => {
          const isCorrect = revealed && val === game.truth
          const isWrong = revealed && chosen === val && val !== game.truth
          return (
            <button key={label} onClick={() => pick(val)} style={{
              flex:1, padding:'16px', border:`1px solid ${isCorrect ? '#1d9e75' : isWrong ? 'rgba(220,80,80,0.5)' : 'rgba(255,255,255,0.12)'}`,
              background: isCorrect ? 'rgba(29,158,117,0.1)' : isWrong ? 'rgba(220,80,80,0.08)' : 'rgba(255,255,255,0.03)',
              color: isCorrect ? '#1d9e75' : isWrong ? 'rgba(220,80,80,0.8)' : 'rgba(255,255,255,0.7)',
              fontSize:14, fontWeight:300, cursor: revealed ? 'default' : 'pointer',
              fontFamily:'var(--font)', transition:'all 0.2s',
            }}>{label}</button>
          )
        })}
      </div>

      {revealed && (
        <>
          {userCorrect && game.truth && game.comment && (
            <div style={{ padding:'1rem 1.25rem', background:'rgba(29,158,117,0.07)', borderLeft:'2px solid #1d9e75', marginBottom:'1rem' }}>
              <div style={{ fontSize:9, letterSpacing:'0.2em', color:'#1d9e75', textTransform:'uppercase', marginBottom:6 }}>✓ Правда!</div>
              <div style={{ fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>{game.comment}</div>
            </div>
          )}
          {!userCorrect && (
            <div style={{ padding:'1rem 1.25rem', background:'rgba(200,168,75,0.05)', borderLeft:'2px solid rgba(200,168,75,0.4)', marginBottom:'1rem' }}>
              <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(200,168,75,0.7)', textTransform:'uppercase', marginBottom:6 }}>Это миф!</div>
              <div style={{ fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>Клуб благодарит за участие.</div>
            </div>
          )}
          <MacNatal text="В этом клубе важно участие, а не результат." />
          <div style={{ marginTop:'1.5rem' }}><Btn onClick={onNext}>Далее</Btn></div>
        </>
      )}
    </div>
  )
}

function WisdomCard({ day, onNext, onPoints }) {
  const wisdom = WISDOM[day - 1]
  const done = getAnswerForDay(day, 'wisdom')

  function handle() {
    if (!done) { saveAnswer(day, 'wisdom', true); onPoints(POINTS.wisdom) }
    onNext()
  }

  return (
    <div>
      <Label pts={POINTS.wisdom}>Мудрость клуба</Label>
      <div style={{ padding:'2rem', background:'rgba(200,168,75,0.05)', border:'1px solid rgba(200,168,75,0.15)', marginBottom:'2rem' }}>
        <div style={{ fontSize:'clamp(20px,3vw,28px)', fontWeight:200, color:'#f0ebe0', lineHeight:1.5, marginBottom:'1.5rem' }}>«{wisdom.text}»</div>
        <div style={{ fontSize:11, letterSpacing:'0.2em', color:'rgba(200,168,75,0.7)', textTransform:'uppercase' }}>— {wisdom.author}</div>
      </div>
      <Btn onClick={handle}>Принято, далее</Btn>
    </div>
  )
}

function ChallengeCard({ day, onNext, onPoints }) {
  const challenge = CHALLENGES[day - 1]
  const saved = getAnswerForDay(day, 'challenge')
  const [accepted, setAccepted] = useState(!!saved)

  function accept() {
    if (!saved) { saveAnswer(day, 'challenge', true); onPoints(POINTS.challenge) }
    setAccepted(true)
  }

  return (
    <div>
      <Label pts={POINTS.challenge}>Челлендж дня</Label>
      <div style={{ fontSize:'clamp(18px,2.5vw,24px)', fontWeight:200, color:'#f0ebe0', lineHeight:1.5, marginBottom:'2rem' }}>{challenge}</div>
      {!accepted
        ? <button onClick={accept} style={{ background:'#c8a84b', border:'none', color:'#0e0e0e', padding:'16px 32px', fontSize:12, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:'var(--font)' }}>Принять челлендж</button>
        : <>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(29,158,117,0.07)', borderLeft:'2px solid #1d9e75', marginBottom:'1.5rem' }}>
              <span style={{ fontSize:10, letterSpacing:'0.2em', color:'#1d9e75', textTransform:'uppercase' }}>✓ Челлендж принят</span>
            </div>
            <MacNatal text="Маленькие действия — основа большой жизни." />
            <div style={{ marginTop:'1.5rem' }}><Btn onClick={onNext}>Завершить день</Btn></div>
          </>
      }
    </div>
  )
}
