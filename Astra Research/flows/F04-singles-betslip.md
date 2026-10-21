# F04 — Simples y talón

Estado: spec documental v0.2. Reglas R01/R02/R08; salida hacia F07.

## Referencias y decisión

D: Sky Bet diferencia apuestas simples y múltiples [S47](https://support.skybet.com/app/answers/detail/bet-types). RTS 2 pide claridad del importe comprometido [S20](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-2-displaying-transactions).

Decisión: una fila de simple muestra evento, selección, mercado/periodo, cuota, stake y retorno. Añadir selecciona, no apuesta. Varias simples tienen importes separados y se envían una a una; no existe «Place all» en v0.2. Repetir la misma cuota ordinaria la quita de su grupo simple, con feedback. Los grupos Bet Builder se muestran por separado con etiqueta explícita y un stake propio en Singles; no se convierten en simples por compartir pestaña. [Contrato de grupos y consumo](../product/betslip-state-contract.md).

## Recorrido y respuestas

Seleccionar cuota → abrir talón → introducir stake → revisar precio/retorno → enviar esa simple. Se conserva una cantidad escrita al cambiar de viewport o cerrar el panel. Quitar la última selección deja un vacío explicativo; no navega fuera del partido.

| Estado | Respuesta |
| --- | --- |
| Sin importe | CTA desactivada con etiqueta que explica el dato necesario |
| Formato inválido | Error junto al campo; no truncar silenciosamente más decimales |
| Fuera de £1–£50 | Mostrar límite de demo elegido y conservar entrada para corregir |
| Saldo insuficiente | Informar importe/saldo; enlace a caja sin sugerir un depósito superior |
| Cuota cambiada | Marcar diferencia y actualizar retorno revisable; F07 confirma versión |
| Mercado suspendido | Conservar stake; bloquear envío de esa fila, no de otras independientes |

Escritorio: panel persistente con scroll interno cuando haga falta. Móvil: entrada fija al talón con contador, panel de revisión y teclado numérico; el CTA no puede quedar debajo del teclado. Formato visible consistente con GBP.

## Criterios de aceptación

- F04-A01: £10 a 2.10 muestra retorno £21 y beneficio £11; añadir/quitar no altera saldo.
- F04-A02: enviar una simple no envía las otras filas ni las elimina.
- F04-A03: editar stake invalida una revisión monetaria anterior.
- F04-A04: volver desde caja conserva selección e importe, pero revalida disponibilidad y cuota.
- F04-A05: stake £1.25 a 2.10 da retorno £2.63 y neto £1.38 mediante HALF_UP final; no £2.62.
- F04-A06: cambiar Singles/Accumulator conserva una lista de grupos, stakes individuales y stake conjunto distintos; no suma ni duplica apuestas.

Para Claude al componer y revisar: cuánto detalle de regla expandir por defecto y cómo evitar repetir datos innecesarios al acumular varias filas.
