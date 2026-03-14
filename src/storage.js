const KEY_ACTIVATED = 'club50_activated_at'
const KEY_ANSWERS = 'club50_answers'
const KEY_POINTS = 'club50_points'
const KEY_COMPLETED = 'club50_completed_days'
const KEY_NOTIF = 'club50_notifications'

// Moscow timezone offset in minutes (UTC+3)
const MSK_OFFSET = 3 * 60

function nowMSK() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + MSK_OFFSET * 60000)
}

function startOfDayMSK(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function activate() {
  if (localStorage.getItem(KEY_ACTIVATED)) return
  const msk = nowMSK()
  // Store activation as MSK midnight of today so day 1 = today
  const midnight = startOfDayMSK(msk)
  localStorage.setItem(KEY_ACTIVATED, midnight.getTime().toString())
}

export function getActivatedAt() {
  const val = localStorage.getItem(KEY_ACTIVATED)
  return val ? parseInt(val) : null
}

export function isActivated() {
  return !!localStorage.getItem(KEY_ACTIVATED)
}

// Returns current unlocked day (1-21), or 0 if not activated
export function getCurrentDay() {
  const activatedAt = getActivatedAt()
  if (!activatedAt) return 0

  const msk = nowMSK()
  const now = startOfDayMSK(msk)

  // Check if it's past 7:00 MSK today
  const currentHour = nowMSK().getHours()
  const activationDay = new Date(activatedAt)

  // Days elapsed since activation
  const msPerDay = 24 * 60 * 60 * 1000
  let daysElapsed = Math.floor((now.getTime() - activationDay.getTime()) / msPerDay)

  // Day 1 is available immediately after activation
  // Next days open at 7:00 MSK
  let day = daysElapsed + 1

  // If it's before 7:00 MSK and we're past day 1, don't unlock yet
  if (daysElapsed > 0 && currentHour < 7) {
    day = daysElapsed
  }

  return Math.min(Math.max(day, 1), 21)
}

// Returns milliseconds until next day unlocks (7:00 MSK)
export function getMsUntilNextDay() {
  const msk = nowMSK()
  const tomorrow = new Date(msk)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(7, 0, 0, 0)
  return tomorrow.getTime() - msk.getTime()
}

// Returns whether a specific day is unlocked
export function isDayUnlocked(day) {
  return day <= getCurrentDay()
}

export function saveAnswer(day, cardType, answer) {
  const answers = getAnswers()
  if (!answers[day]) answers[day] = {}
  answers[day][cardType] = answer
  localStorage.setItem(KEY_ANSWERS, JSON.stringify(answers))
}

export function getAnswers() {
  try {
    return JSON.parse(localStorage.getItem(KEY_ANSWERS) || '{}')
  } catch {
    return {}
  }
}

export function getAnswerForDay(day, cardType) {
  const answers = getAnswers()
  return answers[day]?.[cardType] ?? null
}

export function addPoints(pts) {
  const current = getPoints()
  localStorage.setItem(KEY_POINTS, (current + pts).toString())
}

export function getPoints() {
  return parseInt(localStorage.getItem(KEY_POINTS) || '0')
}

export function markDayCompleted(day) {
  const completed = getCompletedDays()
  if (!completed.includes(day)) {
    completed.push(day)
    localStorage.setItem(KEY_COMPLETED, JSON.stringify(completed))
  }
}

export function getCompletedDays() {
  try {
    return JSON.parse(localStorage.getItem(KEY_COMPLETED) || '[]')
  } catch {
    return []
  }
}

export function isDayCompleted(day) {
  return getCompletedDays().includes(day)
}

export function setNotificationsEnabled(val) {
  localStorage.setItem(KEY_NOTIF, val ? '1' : '0')
}

export function getNotificationsEnabled() {
  return localStorage.getItem(KEY_NOTIF) === '1'
}
