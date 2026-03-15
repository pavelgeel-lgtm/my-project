import React, { useState, useRef, useEffect } from 'react'
import { getCurrentDay, getPoints, getAnswers } from '../storage'



function buildSystem(day, points, answers) {
  const allContext = Object.entries(answers).map(([d, a]) => {
    const parts = []
    if (a.event_feeling) parts.push(`День ${d}, воспоминание: "${a.event_feeling}"`)
    if (a.question) parts.push(`День ${d}, ответ на вопрос: "${a.question}"`)
    return parts.join('\n')
  }).filter(Boolean).join('\n')

  return `Ты — Мак Натал, агент Секретного клуба 50 уровня жизни.
Ты работаешь в закрытой организации которая сопровождает избранных членов клуба.
Твой стиль: сдержанный, уверенный, немного загадочный. Как агент элитной службы.
Говоришь коротко, по делу, с достоинством. Максимум 2-3 предложения.
Обращаешься к Максиму как к члену клуба — с уважением.

Сейчас день ${day} из 21. Очки Максима: ${points}.

${allContext ? `Досье участника:\n${allContext}` : ''}

Правила агента:
- Никаких психологических вопросов и копания в чувствах
- Не спрашивай лишнего — отвечай на то что спросили
- Ты агент, не терапевт и не коуч
- Никогда не раскрывай механику игры и финальный подарок
- Ты Мак Натал — не говори что ты ИИ
- Только русский язык
- Тематика: клуб, миссия, жизнь, мудрость, приключения`
}

export default function ChatScreen({ onBack }) {
  const day = getCurrentDay()
 const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('club50_chat_history')
    if (saved) {
      try { return JSON.parse(saved) } catch {}
    }
    return [{
      role: 'assistant',
      content: `Максим. День ${day}.\n\nРад видеть вас здесь. Чем могу быть полезен?`
    }]
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

async function send() {
  const text = input.trim()
  if (!text || loading) return
  const userMsg = { role: 'user', content: text }
  const updatedWithUser = [...messages, userMsg]
  setMessages(updatedWithUser)
  localStorage.setItem('club50_chat_history', JSON.stringify(updatedWithUser))
  setInput('')
  setLoading(true)
  try {
    const system = buildSystem(day, getPoints(), getAnswers())
    const res = await fetch('https://shy-sunset-614agrok-proxy.pavelgeel.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
  { role: 'system', content: system },
  ...updatedWithUser.slice(-10)
],
        max_tokens: 400,
        temperature: 0.85,
      })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || 'Подождите немного, Максим...'
    const updatedWithReply = [...updatedWithUser, { role: 'assistant', content: reply }]
    setMessages(updatedWithReply)
    localStorage.setItem('club50_chat_history', JSON.stringify(updatedWithReply))
  } catch (e) {
    console.error('error:', e)
    setMessages(prev => [...prev, { role: 'assistant', content: 'Связь прервана. Попробуйте снова.' }])
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={{ background: '#0e0e0e', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#f0ebe0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '1.2rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={onBack} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 20, cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}>←</button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(200,168,75,0.12)', border: '1px solid rgba(200,168,75,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 10, color: '#c8a84b', fontWeight: 500 }}>МН</span>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 300 }}>Мак Натал</div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(200,168,75,0.6)', textTransform: 'uppercase' }}>Проводник клуба · День {day}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%', padding: '12px 16px',
              background: msg.role === 'user' ? 'rgba(200,168,75,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(200,168,75,0.2)' : 'rgba(255,255,255,0.07)'}`,
              fontSize: 14, fontWeight: 300,
              color: msg.role === 'user' ? 'rgba(255,255,255,0.85)' : '#f0ebe0',
              lineHeight: 1.6, whiteSpace: 'pre-wrap'
            }}>
              {msg.role === 'assistant' && <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(200,168,75,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>Мак Натал</div>}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(200,168,75,0.6)', textTransform: 'uppercase', marginBottom: 6 }}>Мак Натал</div>
              <div style={{ display: 'flex', gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(200,168,75,0.5)', animation: `dot ${1.2}s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <style>{`@keyframes dot { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>

      <div style={{ padding: '1rem 2rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
          placeholder="Написать Мак Наталу..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#f0ebe0', padding: '12px 16px', fontSize: 14, fontWeight: 300, fontFamily: 'var(--font)' }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading ? '#c8a84b' : 'rgba(200,168,75,0.15)',
            border: 'none',
            color: input.trim() && !loading ? '#0e0e0e' : 'rgba(200,168,75,0.3)',
            padding: '12px 20px', fontSize: 16,
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            fontFamily: 'var(--font)', transition: 'all 0.2s'
          }}
        >→</button>
      </div>
    </div>
  )
}
