// R11 · Deposit limits: last 24 hours and last 7 days by elapsed time,
// plus the calendar month in Europe/London. Derived from dated deposits —
// never a counter that resets at midnight.
import { D } from './money'

export type LimitKey = 'daily' | 'weekly' | 'monthly'

export interface DepositRecord {
  id: string
  amount: string
  at: string
  status: 'confirmed' | 'failed'
}

export const LIMIT_LABEL: Record<LimitKey, string> = {
  daily: 'Last 24 hours',
  weekly: 'Last 7 days',
  monthly: 'This calendar month',
}

const H = 3600_000

function londonMonthStart(nowIso: string) {
  const now = new Date(nowIso)
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit' }).formatToParts(now)
  const y = Number(parts.find((p) => p.type === 'year')!.value)
  const m = Number(parts.find((p) => p.type === 'month')!.value)
  // 00:00 local on day 1 — find the UTC instant by checking the offset at that date
  const guess = Date.UTC(y, m - 1, 1, 0, 0)
  const offsetH = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', hourCycle: 'h23' }).format(new Date(guess))
  return guess - Number(offsetH) * H
}

export function used(deposits: DepositRecord[], key: LimitKey, nowIso: string) {
  const now = Date.parse(nowIso)
  const from = key === 'daily' ? now - 24 * H : key === 'weekly' ? now - 168 * H : londonMonthStart(nowIso) - 1
  return deposits
    .filter((d) => d.status === 'confirmed')
    .filter((d) => {
      const t = Date.parse(d.at)
      return t > from && t <= now // (now − duration, now]
    })
    .reduce((s, d) => s.plus(d.amount), D(0))
}

export function remaining(deposits: DepositRecord[], limits: Record<LimitKey, string>, nowIso: string) {
  const per = (['daily', 'weekly', 'monthly'] as LimitKey[]).map((k) => ({ k, left: D(limits[k]).minus(used(deposits, k, nowIso)) }))
  const tightest = per.reduce((a, b) => (b.left.lt(a.left) ? b : a))
  return { left: tightest.left.lt(0) ? D(0) : tightest.left, by: tightest.k, per }
}
