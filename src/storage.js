const KEY_ACTIVATED = 'club50_activated_at'
const KEY_ANSWERS = 'club50_answers'
const KEY_POINTS = 'club50_points'
const KEY_COMPLETED = 'club50_completed_days'
const KEY_GAME_ORDER = 'club50_game_order'

function nowMSK() {
  const now = new Date()
  return new Date(now.getTime() + (now.getTimezoneOffset() + 180) * 60000)
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

export function getCurrentDay() {
  const activatedAt = getActivatedAt()
  if (!activatedAt) return 0
  const msk = nowMSK()
  const activationMsk = new Date(activatedAt + (new Date(activatedAt).getTimezoneOffset() + 180) * 60000)
  const activationDate = new Date(activationMsk)
  activationDate.setHours(0, 0, 0, 0)
  const todayMsk = new Date(msk)
  todayMsk.setHours(0, 0, 0, 0)
  const daysElapsed = Math.floor((todayMsk - activationDate) / 86400000)
  const hour = msk.getHours()
  let day = daysElapsed + 1
  if (daysElapsed > 0 && hour < 7) day = daysElapsed
  return Math.min(Math.max(day, 1), 21)
}

export function getMsUntilNextDay() {
  const msk = nowMSK()
  const next = new Date(msk)
  next.setDate(next.getDate() + 1)
  next.setHours(7, 0, 0, 0)
  return Math.max(0, next.getTime() - msk.getTime())
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
