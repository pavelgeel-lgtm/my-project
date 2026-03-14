import React, { useState, useRef, useEffect } from 'react'
import { getCurrentDay, getPoints } from '../storage'

const GROK_API_KEY = 'YOUR_GROK_API_KEY' // Заменить на реальный ключ

const SYSTEM_PROMPT = `Ты — Мак Натал, проводник Секретного клуба 50 уровня жизни.
Ты сопровождаешь Максима в его 21-дневном путешествии по клубу.

Твой характер: мудрый, тёплый, немного загадочный. Говоришь коротко, ёмко, по делу. Никогда не многословен.
Ты знаешь Максима лично и обращаешься к нему по имени.

Твои правила:
- Никогда не раскрывай механику игры, будущие дни или финальный подарок
- Не говори что ты ИИ — ты Мак Натал, проводник клуба
- Не выходи за рамки тематики клуба, жизни, мудрости, воспоминаний
- Можешь давать жизненные советы, поддерживать, философствовать
- Если спрашивают о технической стороне — мягко уводи разговор в сторону
- Отвечай на русском языке
- Максимум 3-4 предложения в ответе`

export default function ChatScreen({ onBack }) {
  const currentDay = getCurrentDay()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Максим. День ${currentDay}. Рад видеть вас здесь.\n\nЧем могу быть полезен сегодня?`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'grok-3-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT + `\n\nСейчас день ${currentDay} из 21. Очки Максима: ${getPoints()}.` },
            ...messages,
            userMsg,
          ],
          max_tokens: 300,
          temperature: 0.8,
        }),
      })

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Подождите немного, Максим...'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Связь прервана. Попробуйте снова.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--dark)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(180,150,63,0.15)', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0 }}>←</button>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(180,150,63,0.15)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 500 }}>МН</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 300, color: '#f5f0e8' }}>Мак Натал</div>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase' }}>Проводник клуба</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              background: msg.role === 'user' ? 'rgba(180,150,63,0.12)' : 'rgba(255,255,255,0.05)',
              border: '1px solid ' + (msg.role === 'user' ? 'rgba(180,150,63,0.25)' : 'rgba(255,255,255,0.08)'),
              fontSize: 14,
              fontWeight: 300,
              color: msg.role === 'user' ? 'rgba(255,255,255,0.85)' : '#f5f0e8',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}>
              {msg.role === 'assistant' && (
                <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>Мак Натал</div>
              )}
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 6 }}>Мак Натал</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>...</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1rem 2rem', borderTop: '1px solid rgba(180,150,63,0.15)', display: 'flex', gap: 12 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Написать Мак Наталу..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(180,150,63,0.2)',
            color: '#f5f0e8',
            padding: '12px 16px',
            fontSize: 14,
            fontWeight: 300,
            fontFamily: 'var(--font)',
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{
            background: input.trim() && !loading ? 'var(--gold)' : 'rgba(180,150,63,0.2)',
            border: 'none',
            color: input.trim() && !loading ? 'var(--dark)' : 'rgba(180,150,63,0.4)',
            padding: '12px 20px',
            fontSize: 14,
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            fontFamily: 'var(--font)',
            transition: 'all 0.2s',
          }}
        >
          →
        </button>
      </div>
    </div>
  )
}
