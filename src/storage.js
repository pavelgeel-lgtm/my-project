const KEY_ACTIVATED = 'club50_activated_at'
const KEY_ANSWERS = 'club50_answers'
const KEY_POINTS = 'club50_points'
const KEY_COMPLETED = 'club50_completed_days'
const KEY_GAME_ORDER = 'club50_game_order'

// Текущее время в МСК (UTC+3)
function nowMSK() {
  const now = new Date()
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utcMs + 3 * 3600000)
}

// 7:00 МСК сегодня в UTC миллисекундах
function today7amMSK() {
  const msk = nowMSK()
  const d = new Date(msk)
  d.setHours(7, 0, 0, 0)
  // Переводим обратно в UTC
  return d.getTime() - 3 * 3600000 - new Date().getTimezoneOffset() * 60000 + new Date().getTime() - new Date().getTime()
}

export function activate() {
  if (localStorage.getItem(KEY_ACTIVATED)) return
  localStorage.setItem(KEY_ACTIVATED, Date.now().toString())
}

export function getActivatedAt() {
  const val = localStorage.getItem(KEY_ACTIVATED)
  return val ? parseInt(val) : null
}

export function isActivated() {
  return !!localStorage.getItem(KEY_ACTIVATED)
}

// День считается по числу 7:00 МСК которые прошли с активации
// День 1 = сразу после активации
// День 2 = после первой 7:00 МСК следующего дня
export function getCurrentDay() {
  const activatedAt = getActivatedAt()
  if (!activatedAt) return 0

  const msk = nowMSK()
  const nowH = msk.getHours()

  // Дата активации в МСК
  const activationMsk = new Date(activatedAt + msk.getTimezoneOffset() * 60000 + 3 * 3600000)
  const activationDateStr = `${activationMsk.getFullYear()}-${activationMsk.getMonth()}-${activationMsk.getDate()}`

  // Сегодняшняя дата в МСК
  const todayStr = `${msk.getFullYear()}-${msk.getMonth()}-${msk.getDate()}`

  // Дней прошло с даты активации
  const activationDay = new Date(activationMsk.getFullYear(), activationMsk.getMonth(), activationMsk.getDate())
  const todayDay = new Date(msk.getFullYear(), msk.getMonth(), msk.getDate())
  const daysElapsed = Math.floor((todayDay - activationDay) / 86400000)

  // День 1 = день активации (всегда)
  // День N открывается в 7:00 МСК на N-й день после активации
  let day = daysElapsed + 1
  if (daysElapsed > 0 && nowH < 7) {
    day = daysElapsed // до 7:00 МСК — предыдущий день
  }

  return Math.min(Math.max(day, 1), 21)
}

// Миллисекунды до следующей 7:00 МСК
export function getMsUntilNextDay() {
  const msk = nowMSK()
  const next7am = new Date(msk)

  // Если сейчас до 7:00 — до сегодняшней 7:00
  // Если после 7:00 — до завтрашней 7:00
  if (msk.getHours() >= 7) {
    next7am.setDate(next7am.getDate() + 1)
  }
  next7am.setHours(7, 0, 0, 0)

  return Math.max(0, next7am.getTime() - msk.getTime())
}

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
  try { return JSON.parse(localStorage.getItem(KEY_ANSWERS) || '{}') }
  catch { return {} }
}

export function getAnswerForDay(day, cardType) {
  return getAnswers()[day]?.[cardType] ?? null
}

export function getDayContext(day) {
  const a = getAnswers()[day] || {}
  const parts = []
  if (a.event_feeling) parts.push(`Воспоминание дня: "${a.event_feeling}"`)
  if (a.question) parts.push(`Ответ на вопрос клуба: "${a.question}"`)
  if (a.game !== undefined) parts.push('Игра пройдена')
  if (a.challenge) parts.push('Челлендж принят')
  return parts.join('\n')
}

export function addPoints(pts) {
  localStorage.setItem(KEY_POINTS, (getPoints() + pts).toString())
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
  try { return JSON.parse(localStorage.getItem(KEY_COMPLETED) || '[]') }
  catch { return [] }
}

export function isDayCompleted(day) {
  return getCompletedDays().includes(day)
}

export function getGameOrder() {
  const stored = localStorage.getItem(KEY_GAME_ORDER)
  if (stored) return JSON.parse(stored)
  const order = Array.from({ length: 21 }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]]
  }
  localStorage.setItem(KEY_GAME_ORDER, JSON.stringify(order))
  return order
}
