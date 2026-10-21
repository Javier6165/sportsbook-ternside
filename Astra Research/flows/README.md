# Especificaciones por flow

v1.0 — especificación para implementar, pendiente de pruebas de app y personas. 15 flows activos (F01–F14/F16); F15 archivado. D38 delega composición a Claude y elimina capturas previas. 101 criterios documentados, 97 activos. No es auditoría completa de productos reales ni validación con usuarios.

Las reglas compartidas están en [demo-rules.md](../product/demo-rules.md). Las entidades y estados están en [domain-model.md](../product/domain-model.md). Cada flow añade comportamiento de interfaz, no vuelve a definir reglas contables.

| Flow | Documento |
| --- | --- |
| F01 | [Descubrimiento](F01-discovery.md) |
| F02 | [Búsqueda](F02-search.md) |
| F03 | [Evento y mercados](F03-event-markets.md) |
| F04 | [Simples y talón](F04-singles-betslip.md) |
| F05 | [Combinada](F05-accumulator.md) |
| F06 | [Bet Builder e inspector](F06-bet-builder.md) |
| F07 | [Envío y confirmación](F07-placement.md) |
| F08 | [Mis apuestas](F08-my-bets.md) |
| F09 | [Seguimiento en directo](F09-live-tracking.md) |
| F10 | [Cash Out](F10-cash-out.md) |
| F11 | [Liquidación](F11-settlement.md) |
| F12 | [Cuenta y acceso](F12-account.md) |
| F13 | [Caja y movimientos](F13-wallet.md) |
| F14 | [Juego seguro](F14-safer-gambling.md) |
| F15 | [Asistencia archivada, fuera de v1](F15-assistant.md) |
| F16 | [Presentación de demo](F16-demo-presentation.md) |

En estas specs, «referencia» identifica un precedente documentado o una observación; «decisión» es comportamiento elegido para este proyecto. Los puntos pendientes se trasladan al registro de estado y no se esconden dentro de un botón sin respuesta.
