# F11 — Liquidación y explicación del resultado

Estado: spec documental v0.2; depende de R03–R07/R12 y del libro de movimientos.

## Referencias y decisión

D: Sky Bet separa fin del evento, confirmación y pago [S51](https://support.skybet.com/app/answers/detail/bet-settlement-policy). Betfair evidencia reglas específicas de fútbol y otros deportes [S39](https://support.betfair.com/app/answers/detail/a_id/10555/). Los plazos de esos operadores no se convierten en garantías de la demo.

Decisión: el resultado oficial incluye motivo por selección y efecto en precio/importe. El recibo conserva cuota original y, si hay void, precio usado para liquidar. El cierre por Cash Out tiene su propio tipo de resultado.

## Recorrido y respuestas

Final o evento resuelto → pendiente → resultado confirmado → crédito, si procede → detalle explicable. La explicación se compone de datos y reglas versionadas, no de una justificación generativa inventada después.

| Resultado | Contenido |
| --- | --- |
| Ganada | Retorno bruto, stake y neto; condiciones resueltas |
| Perdida | Condición determinante y retorno cero; sin sugerencia de recuperar pérdidas |
| Anulada | Motivo y devolución de stake, neto cero |
| Builder reducido | Condición void, subconjunto y nuevo precio de liquidación archivado |
| Pendiente | Qué confirmación falta y acceso a ayuda; sin cuenta atrás no garantizada |
| Corrección posterior | Nueva versión y movimiento de ajuste explícito; no reescribir saldo sin rastro |

Escritorio/móvil: encabezado monetario breve y condiciones detalladas accesibles. El texto no celebra una devolución como ganancia. Copiar recibo copia datos ficticios; ayuda presenta la incidencia sin enviar mensajes reales.

## Criterios de aceptación

- F11-A01: builder £10 a 3.40 con jugador void y Home+Over ganadores devuelve £27 según R05.
- F11-A02: todas las condiciones void devuelve £10 y neto cero.
- F11-A03: condición perdida restante con otras void da retorno cero, sin pago parcial inventado.
- F11-A04: ninguna ruta aplica dos créditos por abrir varias veces el mismo recibo.
- F11-A05: un escenario parcial del inspector no se usa como resultado oficial.
- F11-A06: abandono 2–1 con un SOT confirmado reduce Home+Over+Player a Over 1.80; £10 devuelve £18; marcador 1–0 con un SOT devuelve £10.
- F11-A07: Under 2.5 pierde al abandono con tres goles confirmados; las otras condiciones void no recuperan el stake.
- F11-A08: corrección ganada→perdida de simple £10 a 2.10 genera −£21, una vez, y actualiza lista, recibo y detalle sin borrar el crédito original.
- F11-A09: repetir una liquidación o recibir su versión antigua no modifica dinero ni resultado vigente.

Resoluciones de abandono y corrección: [tanda 4](../research/09-lifecycle-edge-cases.md), [S65–S67](../research/sources-wave-04.md). Los casos de corrección posterior mantienen fondos suficientes; otras combinaciones no se ofrecen como resueltas.

Para Claude durante implementación/validación: revisar explicación de precio reducido en nombres largos y contraste entre recibo original y actualización. Las reglas de no reanudación del escenario se muestran al explicar un abandono.
