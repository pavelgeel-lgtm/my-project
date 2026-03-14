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

export default function App() {
  const [screen, setScreen] = useState(() => {
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
