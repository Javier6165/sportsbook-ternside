# Matriz de escenarios y aceptación

v0.4 · 48 casos especificados; aún no ejecutados contra una aplicación. Las cantidades se comprueban por separado como datos de investigación.

| Caso | Tarea | Flows | Resultado clave |
| --- | --- | --- | --- |
| C01 | Single wins | F04, F07, F08, F11, F13 | One receipt; return 21.00; net +11.00 |
| C02 | Single loses | F04, F11, F13 | No credit; no recovery-bet prompt |
| C03 | Player never participates | F04, F11 | Return stake once; show non-participation rule |
| C04 | Accumulator reduced after void | F05, F11 | Accepted odds 3.78 retained; settlement odds 2.10 explained |
| C05 | Builder repriced after player void | F06, F11 | Archived HOME+OVER price 2.70; original quote retained |
| C06 | All builder conditions void | F06, F11 | Return stake once; no win celebration |
| C07 | Price changes at review | F06, F07 | Potential return changes 34.00 to 32.00; no debit before acceptance; accepted snapshot qv2 |
| C08 | Market suspends before acceptance | F03, F07 | Keep draft; no receipt or debit |
| C09 | Unknown response recovered as accepted | F07, F13 | While unknown show confirmed balance and pending operation; block new monetary actions; One receipt and one debit after recovery |
| C10 | Unknown response recovered as rejected | F07, F13 | No automatic resubmission; preserve draft |
| C11 | Stat correction is not settlement | F09, F11 | Player counter reverts 2 to 1; label correction; no additional ledger entry |
| C12 | Cash Out returns less than stake | F10, F13 | Cashed out; net -2.00; no extra stake refund |
| C13 | Cash Out offer changes | F10 | No credit before new confirmation; close at 7.50 |
| C14 | Cash Out races with settlement | F10, F11, F13 | Only one terminal monetary resolution; If settlement wins: available 124.00; reject closure as already settled; If Cash Out wins: available 98.00; no later sports payout |
| C15 | Gross deposit limit | F13, F14 | Reject 10.00 without consumption; Accept 5.00; gross deposited 20.00; withdrawal does not replenish margin |
| C16 | Withdrawal reservation | F13 | Pending available 80.00 and reserved 20.00; Complete keeps available 80.00; reject restores 100.00; no cancel action |
| C17 | Limit increase requires later confirmation | F14, F16 | Before confirmation remains 20.00; after confirmation 40.00; Advancing the match clock alone has no effect |
| C18 | Pause blocks all entry points | F12, F14 | No new stakes or deposits; read-only history and withdrawal remain accessible |
| C19 | Self-exclusion closes gambling access | F12, F13, F14 | No active authenticated sportsbook; return status/help surface; Return 100.00 reserved once then completed; no automatic reactivation |
| C20 | Session expires before send | F07, F12 | Preserve draft; revalidate; no debit until explicit submission |
| C21 | Ambiguous search | F02 | Show context to disambiguate; no bet automatically added |
| C22 | Exclusive builder selection replaces reversibly | F06 | No confirmation modal; never store or quote HOME+AWAY; One result condition remains; feedback names replacement; Undo restores HOME selection and fetches current quote; prior monetary review stays invalid |
| C23 | Tennis retirement | F03, F11 | Rule identified as policy of this demo; return stake |
| C24 | Basketball includes overtime | F03, F11 | Do not settle at regulation tie; gross return 19.00 |
| C25 | Viewport change preserves state | F01, F04, F16 | Same account, route, draft, scroll context where applicable and balance |
| C26 | Reset restores a complete fixture | F16 | Cancel preserves changes; Confirm restores fixtures.json including initial ledger and historical void bet |
| C27 | Inspector handles incomplete hypothetical | F06 | Player void; remaining conditions undetermined; Conditional return 27.00 only if HOME and OVER win; Do not mark the bet won or change actual quote/state |
| C28 | Statistics feed unavailable | F03, F09 | Keep last known count and timestamp; do not infer zero or settlement; Market pricing availability is a separate state |
| C29 | Self-exclusion with an open bet | F11, F12, F13, F14 | Close gambling access immediately; preserve receipt and accepted rules; V13 shows administrative status, no live sports or Cash Out; No double refund of stake and no reactivation |
| C30 | Abandonment keeps determined Over and player results | F06, F09, F11 | HOME void; OVER wins; resolve player by confirmed data; Keep original 3.40 and explain archived subset quote |
| C31 | Abandonment leaves every builder condition undetermined | F06, F11 | All conditions void; leading HOME is not a full-time win; Refund stake once; no win celebration |
| C32 | Determined Under loss overrides remaining voids | F06, F11 | HOME void; UNDER lost; return 0.00; Do not refund whole builder because event was abandoned |
| C33 | Official resettlement changes won to lost | F08, F11, F13 | Current list, receipt and detail all LOST with Settlement updated notice; Preserve old credit and add one adjustment linked to sv1; Repeat and stale versions change neither money nor current result; This case does not cover negative balance or returned funds |
| C34 | Official resettlement changes lost to won | F08, F11, F13 | One credit; current status WON with update explanation; Original lost version retained in labelled history |
| C35 | Exclusion does not wait for an unknown bet response | F07, F12, F13, F14 | Gambling blocked immediately in both branches; Do not resubmit or defer exclusion; No funds enabled for play; separate administrative pending status |
| C36 | Failed exclusion funds return remains restricted | F12, F13, F14 | Gaming account remains closed; held funds 100.00 require return follow-up; No release to playable available balance, deposit, or new bet; Do not imply funds have disappeared or actually reached a bank |
| C37 | Incomplete hypothetical can still determine loss | F06 | HOME would lose, so hypothetical gross return is 0.00; Do not invent remaining results or label whole ticket undetermined; Hypothetical never changes actual bet, price or balance |
| C38 | Half-penny return uses final HALF_UP | F04, F11, F13 | Exact gross 2.625 rounds to 2.63, not 2.62; Net 1.38; same figures in receipt and wallet |
| C39 | Midnight does not reset last-24-hour allowance | F13, F14, F16 | Crossing midnight leaves only 5.00 allowance, not 20.00; At final clock initial 15.00 has aged out exactly; recent 5.00 remains, allowance 15.00; Do not reset the seven-day limit or monthly record at midnight |
| C40 | DST does not shorten the last-24-hour window | F14, F16 | At first checkpoint 23.5 elapsed hours: consumed 20.00, remaining 0.00; At second checkpoint exactly 24 elapsed hours: consumed 0.00, remaining 20.00; No new deposit or available-balance movement |
| C41 | Limits have direct visible entry points | F01, F13, F14 | Each link opens V12 directly without intermediate account menu; Link is visible and discoverable rather than hover-only; Returning preserves draft and revalidates current quote |
| C42 | Live single uses its own quote snapshot | F03, F04, F07, F09, F11 | Accepted odds 1.30, version live-qv1, live snapshot archived; One debit and gross return 13.00; no pre-match 2.10 price; This is full-time result, not winner from minute 68 onward |
| C43 | Kick-off invalidates a prematch builder review | F03, F06, F07, F16 | Preserve draft but block old builder placement with phase explanation; No automatic conversion to single, new quote or another bet type; Existing accepted builders elsewhere remain valid and track normally |
| C44 | Accumulator avoids intermediate price rounding | F05, F11 | Compute 1.25 * 2.10 * 1.80 * 1.65 = 7.79625; final HALF_UP 7.80; Do not use rounded combined 6.24 for calculation; Gross/net and component prices reconcile |
| C45 | Switch betslip mode without copying groups or stakes | F04, F05, F16 | Exactly draft-01 and draft-02 throughout; group stakes remain 10.00 and 5.00 |
| C46 | Acceptance consumes only the submitted shared groups | F04, F05, F07 | Exactly one accepted receipt and one debit per branch |
| C47 | Editing a builder preserves group identity and separate bets | F04, F06 | Still two groups; draft-builder has three conditions and stake 10.00 at joint quote 3.40 |
| C48 | Explicit conversion replaces groups without inheriting stakes | F04, F05, F06 | Cancel preserves draft-home 10.00 and draft-over 5.00 |

Para ejecutar cada caso se usan setup, acciones, ramas e importes de [scenario-cases.json](scenario-cases.json). El listado anterior no sustituye esos datos.

Registrar después fecha, versión del prototipo/app, viewport, resultado real, evidencia y defecto. Mantener pendiente hasta comprobar el recorrido completo.
