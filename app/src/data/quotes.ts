// Astra's authored Bet Builder quote table for football-01 (fixtures.json, qv1).
// Every non-empty subset of {result?, total?, player?} has its own price;
// HOME+AWAY / OVER+UNDER never exist. Prices are never multiplied.

export type BuilderGroupId = 'result' | 'total' | 'player'

export const BUILDER_GROUPS: { id: BuilderGroupId; label: string; marketId: string; options: string[] }[] = [
  { id: 'result', label: 'Match result', marketId: 'RESULT_90', options: ['HOME', 'DRAW', 'AWAY'] },
  { id: 'total', label: 'Total goals', marketId: 'TOTAL_2_5_90', options: ['OVER_2_5', 'UNDER_2_5'] },
  { id: 'player', label: 'Player', marketId: 'PLAYER_SOT_90', options: ['PLAYER_2_SOT'] },
]

export const groupOf = (sel: string): BuilderGroupId =>
  ['HOME', 'DRAW', 'AWAY'].includes(sel) ? 'result' : ['OVER_2_5', 'UNDER_2_5'].includes(sel) ? 'total' : 'player'

const ORDER = ['HOME', 'DRAW', 'AWAY', 'OVER_2_5', 'UNDER_2_5', 'PLAYER_2_SOT']
export const quoteKey = (sels: string[]) => [...sels].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).join('+')

export const QUOTES_QV1: Record<string, string> = {
  HOME: '2.10',
  DRAW: '3.40',
  AWAY: '3.60',
  OVER_2_5: '1.80',
  UNDER_2_5: '2.00',
  PLAYER_2_SOT: '1.90',
  'HOME+OVER_2_5': '2.70',
  'HOME+UNDER_2_5': '6.60',
  'DRAW+OVER_2_5': '7.80',
  'DRAW+UNDER_2_5': '5.80',
  'AWAY+OVER_2_5': '9.20',
  'AWAY+UNDER_2_5': '5.80',
  'HOME+PLAYER_2_SOT': '2.80',
  'DRAW+PLAYER_2_SOT': '9.40',
  'AWAY+PLAYER_2_SOT': '12.00',
  'OVER_2_5+PLAYER_2_SOT': '2.50',
  'UNDER_2_5+PLAYER_2_SOT': '6.40',
  'HOME+OVER_2_5+PLAYER_2_SOT': '3.40',
  'HOME+UNDER_2_5+PLAYER_2_SOT': '14.00',
  'DRAW+OVER_2_5+PLAYER_2_SOT': '16.80',
  'DRAW+UNDER_2_5+PLAYER_2_SOT': '20.50',
  'AWAY+OVER_2_5+PLAYER_2_SOT': '23.00',
  'AWAY+UNDER_2_5+PLAYER_2_SOT': '26.00',
}

export const quoteFor = (sels: string[]) => (sels.length ? QUOTES_QV1[quoteKey(sels)] : undefined)

/** Plain-English rules shown next to each market (RULES-GB-01 rev 0.4). */
export const MARKET_RULES: Record<string, string> = {
  RESULT_90: 'Settled on the score after 90 minutes plus stoppage time. Extra time and penalties don’t count.',
  DOUBLE_CHANCE_90: 'Covers two of the three possible results after 90 minutes plus stoppage time.',
  TOTAL_2_5_90: 'Goals by both teams in 90 minutes plus stoppage time. Over needs three or more; Under needs two or fewer.',
  BTTS_90: 'Yes needs both teams to score in 90 minutes plus stoppage time. Own goals count for the team they’re credited to.',
  PLAYER_SOT_90:
    'Daniel Costa has to take part — even as a late sub. If he doesn’t play at all, this is void: a single returns your stake; in a Bet Builder the other conditions carry on at their archived price. Only shots on target count.',
  ANYTIME_SCORER_90: 'Your player must score in 90 minutes plus stoppage time. If he doesn’t take part, it’s void. Own goals don’t count.',
  CORRECT_SCORE_90: 'The exact score after 90 minutes plus stoppage time.',
  WINNER_TENNIS: 'The match must be completed. A retirement, disqualification or walkover makes it void and your stake comes back.',
  WINNER_BASKETBALL: 'Includes overtime. If the game is cancelled for good, it’s void.',
}

export const ruleFor = (marketId: string, sport: string) =>
  MARKET_RULES[marketId] ?? (sport === 'tennis' ? MARKET_RULES.WINNER_TENNIS : sport === 'basketball' ? MARKET_RULES.WINNER_BASKETBALL : MARKET_RULES.RESULT_90)
