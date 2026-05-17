export function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function dayKey(date) {
  const d = startOfDay(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function lastNDaysLabels(n, locale = 'en-US') {
  const labels = []
  const keys = []
  const today = startOfDay(new Date())
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    labels.push(d.toLocaleDateString(locale, { month: 'short', day: 'numeric' }))
    keys.push(dayKey(d))
  }
  return { labels, keys }
}

export function clampDateToStartOfDay(date) {
  return startOfDay(date)
}

export function rangeLabels(fromDate, toDate, groupBy = 'day', locale = 'en-US') {
  const labels = []
  const keys = []
  if (!fromDate || !toDate) return { labels, keys }

  const from = startOfDay(fromDate)
  const to = startOfDay(toDate)

  const addKey = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const monthKey = (d) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    return `${y}-${m}`
  }

  if (groupBy === 'month') {
    const d = new Date(from)
    d.setDate(1)
    while (d <= to) {
      const k = monthKey(d)
      keys.push(k)
      labels.push(d.toLocaleDateString(locale, { month: 'short', year: '2-digit' }))
      d.setMonth(d.getMonth() + 1)
      d.setDate(1)
    }
    return { labels, keys }
  }

  if (groupBy === 'week') {
    const d = new Date(from)
    // align to Monday
    const day = d.getDay() || 7
    d.setDate(d.getDate() - (day - 1))
    while (d <= to) {
      const k = addKey(d)
      keys.push(k)
      labels.push(d.toLocaleDateString(locale, { month: 'short', day: 'numeric' }))
      d.setDate(d.getDate() + 7)
    }
    return { labels, keys }
  }

  // day
  const d = new Date(from)
  while (d <= to) {
    keys.push(addKey(d))
    labels.push(d.toLocaleDateString(locale, { month: 'short', day: 'numeric' }))
    d.setDate(d.getDate() + 1)
  }
  return { labels, keys }
}

export function sumNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}
