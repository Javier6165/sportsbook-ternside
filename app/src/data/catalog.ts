import { EXTRA_COMPETITIONS, buildExtraEvents } from './catalog-extra'

// Fictional catalogue. All teams, players, competitions and prices are invented.
// football-01 (and the tennis-01 / basketball-01 / football-02 / football-03 prices)
// come from Astra's fixtures.json; the rest widens the catalogue so the product
// reads like a real sportsbook instead of a five-match mock-up.

export type SportId = 'football' | 'tennis' | 'basketball'

export type CrestShape = 'shield' | 'round' | 'hex' | 'diamond' | 'badge'
export type CrestPattern = 'solid' | 'stripes' | 'half' | 'sash' | 'hoops' | 'chevron' | 'quarters' | 'band'

export interface Crest {
  shape: CrestShape
  pattern: CrestPattern
  c1: string
  c2: string
  mark?: string
}

export interface Participant {
  id: string
  name: string
  short: string
  crest?: Crest
  country?: string
  color?: string
}

export interface Selection {
  id: string
  label: string
  odds: string
}

export interface Market {
  id: string
  name: string
  period: string
  selections: Selection[]
}

export interface LiveState {
  minute?: number
  period: string
  score: [number, number]
  detail?: string
  serving?: 0 | 1
  sets?: [number, number]
  games?: [number, number]
  points?: [string, string]
  clock?: string
  /** authored price path for the main market, cycled while live */
  path: string[][]
}

export interface SportEvent {
  id: string
  sport: SportId
  competitionId: string
  home: Participant
  away: Participant
  startsAt: string
  status: 'scheduled' | 'live'
  live?: LiveState
  markets: Market[]
  builder?: boolean
  form?: [string, string]
  venue?: string
  stage?: string
  popular?: boolean
  /** Plain-language read of why the prices sit where they do (AI-style summary, authored for the demo). */
  brief?: string[]
}

export interface Competition {
  id: string
  sport: SportId
  name: string
  short: string
  region: string
}

export const SPORTS: { id: SportId; name: string }[] = [
  { id: 'football', name: 'Football' },
  { id: 'tennis', name: 'Tennis' },
  { id: 'basketball', name: 'Basketball' },
]

const CORE_COMPETITIONS: Competition[] = [
  { id: 'continental-cup', sport: 'football', name: 'Continental Cup', short: 'Cont. Cup', region: 'Europe' },
  { id: 'premier-division', sport: 'football', name: 'Premier Division', short: 'Prem. Div.', region: 'England' },
  { id: 'primera-iberica', sport: 'football', name: 'Primera Ibérica', short: 'Primera', region: 'Iberia' },
  { id: 'riviera-masters', sport: 'tennis', name: 'Riviera Masters', short: 'Riviera', region: 'Men’s tour' },
  { id: 'cbl', sport: 'basketball', name: 'Continental League', short: 'CBL', region: 'Basketball · Europe' },
]

export const COMPETITIONS: Competition[] = [...CORE_COMPETITIONS, ...EXTRA_COMPETITIONS.map(({ teams: _t, ...c }) => c)]

const t = (id: string, name: string, short: string, crest: Crest): Participant => ({ id, name, short, crest })

export const TEAMS = {
  northbridge: t('northbridge', 'Northbridge FC', 'NBR', { shape: 'shield', pattern: 'stripes', c1: '#13204A', c2: '#E8EDF7', mark: 'N' }),
  southport: t('southport', 'Southport Athletic', 'SPA', { shape: 'round', pattern: 'half', c1: '#C8102E', c2: '#F6C343', mark: 'S' }),
  valmont: t('valmont', 'Valmont SC', 'VAL', { shape: 'hex', pattern: 'sash', c1: '#0F5E4A', c2: '#F2F2EE', mark: 'V' }),
  rotterholm: t('rotterholm', 'FK Rotterholm', 'ROT', { shape: 'badge', pattern: 'hoops', c1: '#E05A1A', c2: '#1A1A1A', mark: 'R' }),
  alcazar: t('alcazar', 'Porto Alcázar', 'ALC', { shape: 'shield', pattern: 'quarters', c1: '#1D4ED8', c2: '#FFFFFF', mark: 'A' }),
  kervin: t('kervin', 'Dynamo Kervin', 'DKV', { shape: 'diamond', pattern: 'band', c1: '#5B21B6', c2: '#E9D5FF', mark: 'D' }),
  sauveterre: t('sauveterre', 'Olympique Sauveterre', 'OSV', { shape: 'round', pattern: 'chevron', c1: '#0B3D91', c2: '#E8B923', mark: 'O' }),
  brenna: t('brenna', 'AC Brenna', 'ACB', { shape: 'shield', pattern: 'stripes', c1: '#111827', c2: '#B91C1C', mark: 'B' }),
  eastford: t('eastford', 'Eastford Rovers', 'EFR', { shape: 'badge', pattern: 'half', c1: '#0369A1', c2: '#F8FAFC', mark: 'E' }),
  westhaven: t('westhaven', 'Westhaven United', 'WHU', { shape: 'shield', pattern: 'sash', c1: '#7F1D1D', c2: '#93C5FD', mark: 'W' }),
  kingsmere: t('kingsmere', 'Kingsmere City', 'KMC', { shape: 'round', pattern: 'solid', c1: '#38BDF8', c2: '#0C4A6E', mark: 'K' }),
  northbridgeU: t('northbridge-utd', 'Northbridge United', 'NBU', { shape: 'hex', pattern: 'hoops', c1: '#B91C1C', c2: '#FDE68A', mark: 'U' }),
  ashcombe: t('ashcombe', 'Ashcombe Town', 'ASH', { shape: 'shield', pattern: 'chevron', c1: '#166534', c2: '#FACC15', mark: 'A' }),
  redmoor: t('redmoor', 'Redmoor', 'RDM', { shape: 'diamond', pattern: 'solid', c1: '#DC2626', c2: '#FFFFFF', mark: 'R' }),
  calder: t('calder', 'Calder Vale', 'CDV', { shape: 'round', pattern: 'stripes', c1: '#1E3A8A', c2: '#F59E0B', mark: 'C' }),
  hollins: t('hollins', 'Hollins Park', 'HLP', { shape: 'badge', pattern: 'quarters', c1: '#0F172A', c2: '#E2E8F0', mark: 'H' }),
  albera: t('albera', 'Ciudad Albera CF', 'CAL', { shape: 'shield', pattern: 'half', c1: '#F59E0B', c2: '#1F2937', mark: 'C' }),
  sierra: t('sierra', 'Atlético Sierra', 'ATS', { shape: 'round', pattern: 'stripes', c1: '#B91C1C', c2: '#FFFFFF', mark: 'S' }),
  montealto: t('montealto', 'Deportivo Montealto', 'DMO', { shape: 'hex', pattern: 'band', c1: '#047857', c2: '#FFFFFF', mark: 'M' }),
  cendra: t('cendra', 'Real Cendra', 'RCE', { shape: 'shield', pattern: 'solid', c1: '#6D28D9', c2: '#FDE68A', mark: 'R' }),
  harbour: t('harbour', 'Harbour Lions', 'HAR', { shape: 'round', pattern: 'band', c1: '#0E7490', c2: '#FDE047', mark: 'H' }),
  hilltown: t('hilltown', 'Hilltown Falcons', 'HIL', { shape: 'hex', pattern: 'chevron', c1: '#9A3412', c2: '#FED7AA', mark: 'F' }),
  delta: t('delta', 'Delta Mariners', 'DEL', { shape: 'badge', pattern: 'hoops', c1: '#1E40AF', c2: '#BFDBFE', mark: 'D' }),
  ironvale: t('ironvale', 'Ironvale Steel', 'IRV', { shape: 'diamond', pattern: 'half', c1: '#374151', c2: '#F97316', mark: 'I' }),
  marisol: t('marisol', 'Marisol Basket', 'MAR', { shape: 'round', pattern: 'sash', c1: '#BE185D', c2: '#FBCFE8', mark: 'M' }),
  kestrel: t('kestrel', 'Kestrel Bay', 'KBY', { shape: 'shield', pattern: 'band', c1: '#065F46', c2: '#A7F3D0', mark: 'K' }),
}

const FLAG: Record<string, string> = { ESP: '#C8102E', ARG: '#4F9BDB', SWE: '#0B5FA5', GBR: '#1E2F6E', IRL: '#169B62', JPN: '#BC002D', FRA: '#0055A4', GER: '#2B2B2B' }
const player = (id: string, name: string, country: string): Participant => ({ id, name, short: name, country, color: FLAG[country] })

const P = {
  vega: player('vega', 'M. Vega', 'ESP'),
  soler: player('soler', 'N. Soler', 'ARG'),
  lindqvist: player('lindqvist', 'A. Lindqvist', 'SWE'),
  okafor: player('okafor', 'T. Okafor', 'GBR'),
  halloran: player('halloran', 'R. Halloran', 'IRL'),
  ishida: player('ishida', 'K. Ishida', 'JPN'),
  moreau: player('moreau', 'L. Moreau', 'FRA'),
  brandt: player('brandt', 'J. Brandt', 'GER'),
}

// —— market helpers ————————————————————————————————————————————————
const REG = '90 min + stoppage'

function result(h: string, d: string, a: string, home: Participant, away: Participant): Market {
  return {
    id: 'RESULT_90',
    name: 'Match result',
    period: REG,
    selections: [
      { id: 'HOME', label: home.name, odds: h },
      { id: 'DRAW', label: 'Draw', odds: d },
      { id: 'AWAY', label: away.name, odds: a },
    ],
  }
}
function totals(o: string, u: string): Market {
  return {
    id: 'TOTAL_2_5_90',
    name: 'Total goals 2.5',
    period: REG,
    selections: [
      { id: 'OVER_2_5', label: 'Over 2.5', odds: o },
      { id: 'UNDER_2_5', label: 'Under 2.5', odds: u },
    ],
  }
}
function btts(y: string, n: string): Market {
  return {
    id: 'BTTS_90',
    name: 'Both teams to score',
    period: REG,
    selections: [
      { id: 'BTTS_YES', label: 'Yes', odds: y },
      { id: 'BTTS_NO', label: 'No', odds: n },
    ],
  }
}
function doubleChance(hd: string, ha: string, da: string): Market {
  return {
    id: 'DOUBLE_CHANCE_90',
    name: 'Double chance',
    period: REG,
    selections: [
      { id: 'DC_HD', label: 'Home or draw', odds: hd },
      { id: 'DC_HA', label: 'Home or away', odds: ha },
      { id: 'DC_DA', label: 'Draw or away', odds: da },
    ],
  }
}
function winner(a: string, b: string, p1: Participant, p2: Participant, period: string, name = 'Match winner'): Market {
  return {
    id: 'WINNER',
    name,
    period,
    selections: [
      { id: 'HOME', label: p1.name, odds: a },
      { id: 'AWAY', label: p2.name, odds: b },
    ],
  }
}

function football(
  id: string,
  competitionId: string,
  home: Participant,
  away: Participant,
  startsAt: string,
  r: [string, string, string],
  extra: { tot?: [string, string]; bt?: [string, string]; dc?: [string, string, string] } = {},
  more: Partial<SportEvent> = {},
): SportEvent {
  const markets = [result(...r, home, away)]
  if (extra.dc) markets.push(doubleChance(...extra.dc))
  if (extra.tot) markets.push(totals(...extra.tot))
  if (extra.bt) markets.push(btts(...extra.bt))
  return { id, sport: 'football', competitionId, home, away, startsAt, status: 'scheduled', markets, ...more }
}

const T = TEAMS

const CORE_EVENTS: SportEvent[] = [
  // ——— Continental Cup · Tuesday ———
  {
    id: 'football-01',
    sport: 'football',
    competitionId: 'continental-cup',
    home: T.northbridge,
    away: T.southport,
    startsAt: '2026-10-20T19:00:00Z',
    status: 'scheduled',
    builder: true,
    stage: 'Group C · Matchday 3',
    venue: 'Riverside Park',
    form: ['WWDWL', 'LWWDW'],
    brief: [
      'Northbridge are favourites mostly on home form: four wins and a draw in their last five at Riverside Park.',
      'Southport aren’t in bad shape either — three wins in five — which is why the away price is 3.60 and not much longer.',
      'Both teams’ recent games have been high-scoring, so Over 2.5 goals is the shorter side of that line at 1.80.',
      'Daniel Costa has had two or more shots on target in four of his last six starts, so his 2+ line sits just under 2.00.',
    ],
    markets: [
      result('2.10', '3.40', '3.60', T.northbridge, T.southport),
      totals('1.80', '2.00'),
      {
        id: 'PLAYER_SOT_90',
        name: 'Player shots on target',
        period: REG,
        selections: [{ id: 'PLAYER_2_SOT', label: 'Daniel Costa — 2+ shots on target', odds: '1.90' }],
      },
    ],
  },
  {
    id: 'football-cc-live',
    sport: 'football',
    competitionId: 'continental-cup',
    home: T.valmont,
    away: T.rotterholm,
    startsAt: '2026-10-20T16:45:00Z',
    status: 'live',
    stage: 'Group A · Matchday 3',
    live: {
      minute: 61,
      period: '2nd half',
      score: [1, 0],
      detail: 'Valmont lead through a 34’ header',
      path: [
        ['1.55', '3.90', '6.50'],
        ['1.53', '4.00', '6.75'],
        ['1.57', '3.80', '6.25'],
        ['1.50', '4.10', '7.00'],
        ['1.52', '4.00', '6.80'],
      ],
    },
    markets: [result('1.55', '3.90', '6.50', T.valmont, T.rotterholm)],
  },
  football('football-cc-02', 'continental-cup', T.alcazar, T.kervin, '2026-10-20T19:00:00Z', ['1.95', '3.50', '3.90'], { tot: ['1.85', '1.95'], bt: ['1.75', '2.05'], dc: ['1.25', '1.30', '1.85'] }, { stage: 'Group C · Matchday 3' }),
  football('football-cc-03', 'continental-cup', T.sauveterre, T.brenna, '2026-10-20T19:00:00Z', ['2.45', '3.30', '2.90'], { tot: ['2.05', '1.75'], bt: ['1.90', '1.90'], dc: ['1.40', '1.33', '1.55'] }, { stage: 'Group D · Matchday 3' }),

  // ——— Primera Ibérica · live ———
  {
    id: 'football-ib-live',
    sport: 'football',
    competitionId: 'primera-iberica',
    home: T.albera,
    away: T.sierra,
    startsAt: '2026-10-20T17:00:00Z',
    status: 'live',
    stage: 'Matchday 9',
    live: {
      minute: 52,
      period: '2nd half',
      score: [2, 2],
      detail: 'Four goals before the hour',
      path: [
        ['2.90', '3.10', '2.55'],
        ['2.95', '3.05', '2.50'],
        ['2.80', '3.20', '2.60'],
        ['3.00', '3.00', '2.45'],
      ],
    },
    markets: [result('2.90', '3.10', '2.55', T.albera, T.sierra)],
  },

  // ——— Premier Division · Tuesday night ———
  football('football-pd-t1', 'premier-division', T.calder, T.redmoor, '2026-10-20T18:45:00Z', ['1.72', '3.75', '4.80'], { tot: ['1.80', '2.00'], bt: ['1.90', '1.90'], dc: ['1.20', '1.28', '2.10'] }, { stage: 'Round 9' }),
  football('football-pd-t2', 'premier-division', T.hollins, T.ashcombe, '2026-10-20T18:45:00Z', ['2.60', '3.20', '2.70'], { tot: ['2.00', '1.80'], bt: ['1.85', '1.95'], dc: ['1.42', '1.33', '1.48'] }, { stage: 'Round 9' }),
  football('football-ib-t1', 'primera-iberica', T.cendra, T.montealto, '2026-10-20T19:00:00Z', ['2.05', '3.30', '3.70'], { tot: ['2.10', '1.72'], bt: ['1.95', '1.85'], dc: ['1.28', '1.35', '1.75'] }, { stage: 'Matchday 9' }),
  // ——— Premier Division · Wednesday / Saturday ———
  football('football-02', 'premier-division', T.eastford, T.westhaven, '2026-10-21T18:00:00Z', ['1.80', '3.60', '4.40'], { tot: ['1.90', '1.90'], bt: ['1.83', '1.98'], dc: ['1.22', '1.33', '2.00'] }, { stage: 'Round 9' }),
  football('football-03', 'premier-division', T.kingsmere, T.northbridgeU, '2026-10-21T20:00:00Z', ['1.65', '3.80', '4.50'], { tot: ['1.72', '2.10'], bt: ['1.80', '2.00'], dc: ['1.18', '1.25', '2.05'] }, { stage: 'Round 9' }),
  football('football-pd-04', 'premier-division', T.ashcombe, T.redmoor, '2026-10-24T14:00:00Z', ['2.30', '3.25', '3.10'], { tot: ['2.00', '1.80'], bt: ['1.85', '1.95'], dc: ['1.36', '1.35', '1.60'] }, { stage: 'Round 10' }),
  football('football-pd-05', 'premier-division', T.calder, T.hollins, '2026-10-24T14:00:00Z', ['2.75', '3.20', '2.55'], { tot: ['2.10', '1.72'], bt: ['1.95', '1.85'], dc: ['1.48', '1.33', '1.42'] }, { stage: 'Round 10' }),

  // ——— Primera Ibérica · Wednesday ———
  football('football-ib-02', 'primera-iberica', T.montealto, T.cendra, '2026-10-21T19:30:00Z', ['2.20', '3.20', '3.40'], { tot: ['2.15', '1.70'], bt: ['2.00', '1.80'], dc: ['1.32', '1.36', '1.66'] }, { stage: 'Matchday 9' }),

  // ——— Tennis ———
  {
    id: 'tennis-live',
    sport: 'tennis',
    competitionId: 'riviera-masters',
    home: P.lindqvist,
    away: P.okafor,
    startsAt: '2026-10-20T16:30:00Z',
    status: 'live',
    stage: 'Round of 16 · Hard',
    live: {
      period: 'Set 2',
      score: [1, 0],
      sets: [1, 0],
      games: [3, 2],
      points: ['30', '15'],
      serving: 0,
      path: [
        ['1.36', '3.10'],
        ['1.33', '3.25'],
        ['1.40', '2.95'],
        ['1.30', '3.40'],
      ],
    },
    markets: [winner('1.36', '3.10', P.lindqvist, P.okafor, 'Match must complete')],
  },
  {
    id: 'tennis-01',
    sport: 'tennis',
    competitionId: 'riviera-masters',
    home: P.vega,
    away: P.soler,
    startsAt: '2026-10-21T12:00:00Z',
    status: 'scheduled',
    stage: 'Round of 16 · Hard',
    markets: [winner('1.70', '2.20', P.vega, P.soler, 'Match must complete')],
  },
  {
    id: 'tennis-03',
    sport: 'tennis',
    competitionId: 'riviera-masters',
    home: P.halloran,
    away: P.ishida,
    startsAt: '2026-10-21T13:30:00Z',
    status: 'scheduled',
    stage: 'Round of 16 · Hard',
    markets: [winner('2.40', '1.57', P.halloran, P.ishida, 'Match must complete')],
  },
  {
    id: 'tennis-04',
    sport: 'tennis',
    competitionId: 'riviera-masters',
    home: P.moreau,
    away: P.brandt,
    startsAt: '2026-10-21T15:00:00Z',
    status: 'scheduled',
    stage: 'Round of 16 · Hard',
    markets: [winner('1.95', '1.85', P.moreau, P.brandt, 'Match must complete')],
  },

  // ——— Basketball ———
  {
    id: 'basketball-live',
    sport: 'basketball',
    competitionId: 'cbl',
    home: T.delta,
    away: T.ironvale,
    startsAt: '2026-10-20T17:00:00Z',
    status: 'live',
    stage: 'Regular season',
    live: {
      period: 'Q3',
      clock: '4:12',
      score: [64, 59],
      path: [
        ['1.42', '2.85'],
        ['1.38', '3.00'],
        ['1.47', '2.70'],
        ['1.35', '3.15'],
      ],
    },
    markets: [winner('1.42', '2.85', T.delta, T.ironvale, 'Includes overtime', 'Winner')],
  },
  {
    id: 'basketball-t1',
    sport: 'basketball',
    competitionId: 'cbl',
    home: T.kestrel,
    away: T.harbour,
    startsAt: '2026-10-20T19:15:00Z',
    status: 'scheduled',
    stage: 'Regular season',
    markets: [winner('2.05', '1.78', T.kestrel, T.harbour, 'Includes overtime', 'Winner')],
  },
  {
    id: 'tennis-t1',
    sport: 'tennis',
    competitionId: 'riviera-masters',
    home: P.brandt,
    away: P.halloran,
    startsAt: '2026-10-20T19:30:00Z',
    status: 'scheduled',
    stage: 'Round of 16 · Night session',
    markets: [winner('1.53', '2.50', P.brandt, P.halloran, 'Match must complete')],
  },
  {
    id: 'basketball-01',
    sport: 'basketball',
    competitionId: 'cbl',
    home: T.harbour,
    away: T.hilltown,
    startsAt: '2026-10-21T19:30:00Z',
    status: 'scheduled',
    stage: 'Regular season',
    markets: [winner('1.90', '1.95', T.harbour, T.hilltown, 'Includes overtime', 'Winner')],
  },
  {
    id: 'basketball-03',
    sport: 'basketball',
    competitionId: 'cbl',
    home: T.marisol,
    away: T.kestrel,
    startsAt: '2026-10-22T19:00:00Z',
    status: 'scheduled',
    stage: 'Regular season',
    markets: [winner('1.62', '2.30', T.marisol, T.kestrel, 'Includes overtime', 'Winner')],
  },
]

export const EVENTS: SportEvent[] = [...CORE_EVENTS, ...buildExtraEvents()]

const POPULAR = ['football-01', 'football-cc-02', 'football-02', 'football-03', 'tennis-01', 'basketball-01', 'football-ib-live', 'football-cc-live', 'tennis-live']
EVENTS.forEach((e) => (e.popular = POPULAR.includes(e.id)))

/** Team/player accent colour used for colour-of-the-game fields. */
export const teamColor = (p: Participant) => p.crest?.c1 ?? p.color ?? '#2948FF'

export const FEATURED_EVENT_ID = 'football-01'

/** The demo's frozen "now" for the catalogue (event clock, SIM-01). */
export const EVENT_NOW = '2026-10-20T18:00:00Z'

export const BUILDER_SHOWCASE = {
  eventId: 'football-01',
  conditions: [
    { id: 'HOME', label: 'Northbridge FC to win', market: 'Match result', period: '90 min + stoppage' },
    { id: 'OVER_2_5', label: 'Over 2.5 goals', market: 'Total goals', period: '90 min + stoppage' },
    { id: 'PLAYER_2_SOT', label: 'Daniel Costa 2+ shots on target', market: 'Player shots on target', period: 'Must take part' },
  ],
  odds: '3.40',
}

export const eventById = (id: string) => EVENTS.find((e) => e.id === id)
export const competitionById = (id: string) => COMPETITIONS.find((c) => c.id === id)!
