import React, { useState, useRef, useEffect } from 'react'
import { getCurrentDay, getPoints } from '../storage'

const GROK_API_KEY = 'YOUR_GROK_API_KEY'

const SYSTEM = `Ты — Мак Натал, проводник Секретного клуба 50 уровня жизни.
Ты сопровождаешь Максима Владимировича в его 21-дневном путешествии.
Твой характер: мудрый, тёплый, немного загадочный. Говоришь коротко и ёмко — максимум 3-4 предложения.
Ты знаешь Максима лично, обращаешься к нему по имени.
Правила:
- Никогда не раскрывай механику игры, будущие дни или финальный подарок
- Не говори что ты ИИ — ты Мак Натал
- Не выходи за рамки клуба, жизни, мудрости
- Отвечай только на русском языке`

export default function ChatScreen({ onBack }) {
  const day = getCurrentDay()
  const [messages, setMessages] = useState([{
    role:'assistant',
    content:`Максим Владимирович. День ${day}.\n\nРад видеть вас здесь. Чем могу быть полезен?`
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return
    const userMsg = { role:'user', content:text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${GROK_API_KEY}` },
        body: JSON.stringify({
          model:'grok-3-mini',
          messages:[
            { role:'system', content: SYSTEM + `\nСейчас день ${day} из 21. Очки: ${getPoints()}.` },
            ...messages, userMsg
          ],
          max_tokens:300, temperature:0.8,
        })
      })
      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Подождите немного, Максим...'
      setMessages(prev => [...prev, { role:'assistant', content:reply }])
    } catch {
      setMessages(prev => [...prev, { role:'assistant', content:'Связь прервана. Попробуйте снова.' }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{ background:'#0e0e0e', minHeight:'100vh', display:'flex', flexDirection:'column', color:'#f0ebe0' }}>
      <div style={{ display:'flex', alignItems:'center', gap:16, padding:'1.2rem 2rem', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={onBack} style={{ color:'rgba(255,255,255,0.4)', fontSize:20, cursor:'pointer', background:'none', border:'none', padding:0 }}>←</button>
        <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(200,168,75,0.12)', border:'1px solid rgba(200,168,75,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:10, color:'#c8a84b', fontWeight:500 }}>МН</span>
        </div>
        <div>
          <div style={{ fontSize:15, fontWeight:300 }}>Мак Натал</div>
          <div style={{ fontSize:9, letterSpacing:'0.2em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase' }}>Проводник клуба</div>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'1.5rem 2rem', display:'flex', flexDirection:'column', gap:14 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth:'80%', padding:'12px 16px', background: msg.role === 'user' ? 'rgba(200,168,75,0.1)' : 'rgba(255,255,255,0.04)', border:`1px solid ${msg.role === 'user' ? 'rgba(200,168,75,0.2)' : 'rgba(255,255,255,0.07)'}`, fontSize:14, fontWeight:300, color: msg.role === 'user' ? 'rgba(255,255,255,0.85)' : '#f0ebe0', lineHeight:1.6, whiteSpace:'pre-wrap' }}>
              {msg.role === 'assistant' && <div style={{ fontSize:9, letterSpacing:'0.18em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase', marginBottom:6 }}>Мак Натал</div>}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', justifyContent:'flex-start' }}>
            <div style={{ padding:'12px 16px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize:9, letterSpacing:'0.18em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase', marginBottom:6 }}>Мак Натал</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,0.3)' }}>...</div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding:'1rem 2rem', borderTop:'1px solid rgba(255,255,255,0.07)', display:'flex', gap:12 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()} }}
          placeholder="Написать Мак Наталу..."
          style={{ flex:1, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', color:'#f0ebe0', padding:'12px 16px', fontSize:14, fontWeight:300, fontFamily:'var(--font)' }}
        />
        <button onClick={send} disabled={!input.trim()||loading} style={{ background: input.trim()&&!loading ? '#c8a84b' : 'rgba(200,168,75,0.15)', border:'none', color: input.trim()&&!loading ? '#0e0e0e' : 'rgba(200,168,75,0.3)', padding:'12px 20px', fontSize:16, cursor: input.trim()&&!loading ? 'pointer' : 'default', fontFamily:'var(--font)', transition:'all 0.2s' }}>→</button>
      </div>
    </div>
  )
}
