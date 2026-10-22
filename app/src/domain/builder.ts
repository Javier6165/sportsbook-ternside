// Explore outcomes (R05/R06/R13): read-only "what if" evaluation of a Bet Builder.
// It never changes the match, the price or the bet — it only applies the rules.
import { quoteFor } from '../data/quotes'

export type LegStatus = 'won' | 'lost' | 'void' | 'open'

export interface Scenario {
  id: string
  title: string
  detail: string
  /** status for every builder selection id; unspecified → open */
  status: Partial<Record<string, LegStatus>>
  why: Partial<Record<string, string>>
}

export type Outcome =
  | { kind: 'lost'; by: string[] }
  | { kind: 'refund' }
  | { kind: 'won'; subset: string[]; odds: string; reduced: boolean }
  | { kind: 'conditional'; subset: string[]; odds: string; pending: string[]; reduced: boolean }

/** `quotes`: the draft's current table, or — for an accepted bet — the subset prices archived at acceptance. */
export function evaluate(sels: string[], sc: Scenario, quotes?: Record<string, string>): { legs: { id: string; status: LegStatus; why?: string }[]; outcome: Outcome } {
  const legs = sels.map((id) => ({ id, status: sc.status[id] ?? 'open', why: sc.why[id] }))
  const lost = legs.filter((l) => l.status === 'lost').map((l) => l.id)
  if (lost.length) return { legs, outcome: { kind: 'lost', by: lost } }
  const remaining = legs.filter((l) => l.status !== 'void').map((l) => l.id)
  if (!remaining.length) return { legs, outcome: { kind: 'refund' } }
  const odds = quoteFor(remaining, quotes)!
  const reduced = remaining.length < sels.length
  const pending = legs.filter((l) => l.status === 'open').map((l) => l.id)
  if (!pending.length) return { legs, outcome: { kind: 'won', subset: remaining, odds, reduced } }
  return { legs, outcome: { kind: 'conditional', subset: remaining, odds, pending, reduced } }
}

const L = (s: Partial<Record<string, LegStatus>>) => s

export const SCENARIOS: Scenario[] = [
  {
    id: 'no-costa',
    title: 'Costa doesn’t play',
    detail: 'He stays on the bench all game.',
    status: L({ PLAYER_2_SOT: 'void' }),
    why: { PLAYER_2_SOT: 'He didn’t take part, so this condition is removed — not lost.' },
  },
  {
    id: 'draw',
    title: 'It’s a draw after 90',
    detail: 'Level at full time. Goals and shots still unknown.',
    status: L({ HOME: 'lost', AWAY: 'lost', DRAW: 'won' }),
    why: { HOME: 'A draw means Northbridge didn’t win in 90 minutes.', AWAY: 'A draw means Southport didn’t win.', DRAW: 'Level after 90 minutes plus stoppage.' },
  },
  {
    id: 'quiet-costa',
    title: 'Northbridge win 2–1, Costa has 1 shot',
    detail: 'Three goals, but Costa only tests the keeper once.',
    status: L({ HOME: 'won', DRAW: 'lost', AWAY: 'lost', OVER_2_5: 'won', UNDER_2_5: 'lost', PLAYER_2_SOT: 'lost' }),
    why: { PLAYER_2_SOT: 'He played but managed one shot on target, not two.', OVER_2_5: 'Three goals in 90 minutes.', UNDER_2_5: 'Three goals is more than 2.5.' },
  },
  {
    id: 'all-in',
    title: 'Northbridge win 3–1, Costa has 2 shots',
    detail: 'Everything goes Northbridge’s way.',
    status: L({ HOME: 'won', DRAW: 'lost', AWAY: 'lost', OVER_2_5: 'won', UNDER_2_5: 'lost', PLAYER_2_SOT: 'won' }),
    why: { OVER_2_5: 'Four goals in 90 minutes.', PLAYER_2_SOT: 'Two shots on target, and he took part.' },
  },
  {
    id: 'extra-time',
    title: '1–1 after 90, Northbridge win in extra time',
    detail: 'A cup tie decided after 90 minutes.',
    status: L({ HOME: 'lost', DRAW: 'won', AWAY: 'lost', OVER_2_5: 'lost', UNDER_2_5: 'won' }),
    why: { HOME: 'Only the first 90 minutes plus stoppage count. Extra time doesn’t.', DRAW: 'It was 1–1 at 90 minutes.', OVER_2_5: 'Two goals in 90 minutes — extra-time goals don’t count.', UNDER_2_5: 'Two goals in 90 minutes.' },
  },
  {
    id: 'abandoned',
    title: 'Abandoned at 2–1 on 70 minutes',
    detail: 'Not resumed. Costa had one shot on target.',
    status: L({ HOME: 'void', DRAW: 'void', AWAY: 'void', OVER_2_5: 'won', UNDER_2_5: 'lost', PLAYER_2_SOT: 'void' }),
    why: {
      HOME: 'The 90 minutes were never completed, so the result is void.',
      DRAW: 'The 90 minutes were never completed.',
      AWAY: 'The 90 minutes were never completed.',
      OVER_2_5: 'Three goals had already been scored — that can’t be undone.',
      UNDER_2_5: 'Three goals had already been scored.',
      PLAYER_2_SOT: 'He hadn’t reached two shots when play stopped, so it’s void.',
    },
  },
]
