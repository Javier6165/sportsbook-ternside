import Decimal from 'decimal.js'

// RULES-GB-01 R01: exact decimal maths, HALF_UP once on the final return.
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP })

export const D = (v: string | number | Decimal) => new Decimal(v)

export function isValidStake(v: string) {
  if (!/^\d+(\.\d{1,2})?$/.test(v)) return false
  const d = D(v)
  return d.gte(1) && d.lte(50)
}

export function grossReturn(stake: string, odds: string | Decimal) {
  return D(stake).times(odds).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
}

/** Exact accumulator product — never rounded between legs. */
export function accaOdds(odds: string[]) {
  return odds.reduce((acc, o) => acc.times(o), D(1))
}

export function fmtMoney(v: string | number | Decimal) {
  const d = D(v)
  const s = d.abs().toFixed(2)
  const [i, f] = s.split('.')
  const withCommas = i.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${d.isNeg() ? '−' : ''}£${withCommas}.${f}`
}

/** Display odds: two decimals for prices; exact product trimmed to 6 dp. */
export function fmtOdds(v: string | Decimal) {
  const d = D(v)
  if (d.decimalPlaces() <= 2) return d.toFixed(2)
  return d.toDecimalPlaces(6).toString()
}
