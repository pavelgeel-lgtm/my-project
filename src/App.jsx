import React, { useState } from 'react'
import './styles.css'
import { isActivated, isDayCompleted } from './storage'
import InviteScreen from './components/InviteScreen'
import AudioGreeting from './components/AudioGreeting'
import Dashboard from './components/Dashboard'
import DayDigest from './components/DayDigest'
import Archive from './components/Archive'
import ChatScreen from './components/ChatScreen'
import FinalGift from './components/FinalGift'

const AUDIO_KEY = 'club50_audio_shown'

const CODE_KEY = 'club50_unlocked'
const SECRET = 'спот'

export default function App() {
  const [screen, setScreen] = useState(() => {
    if (!localStorage.getItem(CODE_KEY)) return 'code'
    if (!isActivated()) return 'invite'
    if (!localStorage.getItem(AUDIO_KEY)) return 'audio'
    return 'dashboard'
  })
  const [activeDay, setActiveDay] = useState(null)
  const [prevScreen, setPrevScreen] = useState('dashboard')

  function openDay(day) { setActiveDay(day); setScreen('day') }
  function openChat() { setPrevScreen(screen); setScreen('chat') }
  function backFromChat() { setScreen(prevScreen) }
  function backToDashboard() { setScreen('dashboard'); setActiveDay(null) }

  return (
    <>
      {screen === 'code' && (
        <CodeScreen onUnlock={() => {
          localStorage.setItem(CODE_KEY, '1')
          setScreen('invite')
        }} />
      )}
      {screen === 'invite' && <InviteScreen onActivated={() => setScreen('audio')} />}
      {screen === 'audio' && <AudioGreeting onDone={() => { localStorage.setItem(AUDIO_KEY,'1'); setScreen('dashboard') }} />}
      {screen === 'dashboard' && <Dashboard onOpenDay={openDay} onOpenArchive={() => setScreen('archive')} onOpenChat={openChat} />}
      {screen === 'day' && activeDay && (
        activeDay === 21 && isDayCompleted(21)
          ? <FinalGift onBack={backToDashboard} />
          : <DayDigest day={activeDay} onBack={backToDashboard} onOpenChat={openChat} />
      )}
      {screen === 'archive' && <Archive onBack={backToDashboard} onOpenDay={openDay} onOpenChat={openChat} />}
      {screen === 'chat' && <ChatScreen onBack={backFromChat} />}
    </>
  )
}

function CodeScreen({ onUnlock }) {
  const SECRET = 'спот'
  const [val, setVal] = React.useState('')
  const [error, setError] = React.useState(false)

  function check() {
    if (val.trim().toLowerCase() === SECRET) {
      onUnlock()
    } else {
      setError(true)
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <div style={{ background:'#0e0e0e', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', fontFamily:'var(--font)' }}>
      <div style={{ maxWidth:380, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:9, letterSpacing:'0.3em', color:'rgba(200,168,75,0.6)', textTransform:'uppercase', marginBottom:'3rem' }}>Секретный клуб · Доступ</div>
        <div style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:200, color:'#f0ebe0', marginBottom:'0.5rem' }}>Введите кодовое слово</div>
        <div style={{ fontSize:13, fontWeight:300, color:'rgba(255,255,255,0.3)', marginBottom:'3rem' }}>Только для членов клуба</div>
        <input
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="Кодовое слово..."
          style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:`1px solid ${error ? 'rgba(220,80,80,0.5)' : 'rgba(200,168,75,0.2)'}`, color:'#f0ebe0', padding:'14px 20px', fontSize:16, fontFamily:'var(--font)', textAlign:'center', marginBottom:'1rem', outline:'none', transition:'border 0.2s' }}
        />
        {error && <div style={{ fontSize:12, color:'rgba(220,80,80,0.7)', marginBottom:'1rem', letterSpacing:'0.1em' }}>Неверное слово</div>}
        <button onClick={check} style={{ width:'100%', background:'#c8a84b', border:'none', color:'#0e0e0e', padding:'16px', fontSize:11, fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', fontFamily:'var(--font)' }}>
          Войти →
        </button>
      </div>
    </div>
  )
}
