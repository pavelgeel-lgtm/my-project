import React, { useState, useEffect } from 'react'
import './styles.css'
import { isActivated, isDayCompleted } from './storage'
import InviteScreen from './components/InviteScreen'
import AudioGreeting from './components/AudioGreeting'
import Dashboard from './components/Dashboard'
import DayDigest from './components/DayDigest'
import Archive from './components/Archive'
import ChatScreen from './components/ChatScreen'
import FinalGift from './components/FinalGift'

const SCREENS = {
  INVITE: 'invite',
  AUDIO: 'audio',
  DASHBOARD: 'dashboard',
  DAY: 'day',
  ARCHIVE: 'archive',
  CHAT: 'chat',
  FINAL: 'final',
}

const AUDIO_SHOWN_KEY = 'club50_audio_shown'

export default function App() {
  const [screen, setScreen] = useState(() => {
    if (!isActivated()) return SCREENS.INVITE
    if (!localStorage.getItem(AUDIO_SHOWN_KEY)) return SCREENS.AUDIO
    return SCREENS.DASHBOARD
  })
  const [activeDay, setActiveDay] = useState(null)

  function handleActivated() {
    setScreen(SCREENS.AUDIO)
  }

  function handleAudioDone() {
    localStorage.setItem(AUDIO_SHOWN_KEY, '1')
    setScreen(SCREENS.DASHBOARD)
  }

  function openDay(day) {
    setActiveDay(day)
    setScreen(SCREENS.DAY)
  }

  function backToDashboard() {
    setScreen(SCREENS.DASHBOARD)
    setActiveDay(null)
  }

  return (
    <>
      {screen === SCREENS.INVITE && (
        <InviteScreen onActivated={handleActivated} />
      )}
      {screen === SCREENS.AUDIO && (
        <AudioGreeting onDone={handleAudioDone} />
      )}
      {screen === SCREENS.DASHBOARD && (
        <Dashboard
          onOpenDay={openDay}
          onOpenArchive={() => setScreen(SCREENS.ARCHIVE)}
          onOpenChat={() => setScreen(SCREENS.CHAT)}
        />
      )}
      {screen === SCREENS.DAY && activeDay && (
        activeDay === 21 && isDayCompleted(21)
          ? <FinalGift onBack={backToDashboard} />
          : <DayDigest day={activeDay} onBack={backToDashboard} />
      )}
      {screen === SCREENS.ARCHIVE && (
        <Archive
          onBack={backToDashboard}
          onOpenDay={openDay}
        />
      )}
      {screen === SCREENS.CHAT && (
        <ChatScreen onBack={backToDashboard} />
      )}
      {screen === SCREENS.FINAL && (
        <FinalGift onBack={backToDashboard} />
      )}
    </>
  )
}
