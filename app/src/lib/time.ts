import { EVENT_NOW } from '../data/catalog'

const tz = 'Europe/London'
const now = new Date(EVENT_NOW)

const dayKey = (d: Date) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)

export function kickoffTime(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export function dayOffset(iso: string) {
  const a = dayKey(now).split('/').reverse().join('-')
  const b = dayKey(new Date(iso)).split('/').reverse().join('-')
  return Math.round((Date.parse(b) - Date.parse(a)) / 86400000)
}

export function dayLabel(iso: string) {
  const o = dayOffset(iso)
  if (o === 0) return 'Today'
  if (o === 1) return 'Tomorrow'
  return new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso))
}

export function longDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(iso))
}

export const secondsUntil = (iso: string, elapsed: number) => Math.max(0, Math.round((Date.parse(iso) - now.getTime()) / 1000) - elapsed)
