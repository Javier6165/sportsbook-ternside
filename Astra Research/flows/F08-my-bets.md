# F08 — Mis apuestas y recibos

Estado: spec documental v0.1. Depende de F07, F09–F11 y del registro monetario.

## Referencias y decisión

D: Sky Bet sitúa builders aceptados en Mis apuestas/historial [S37](https://support.skybet.com/app/answers/detail/buildabet). RTS 1 contempla acceso a saldo e historial [S50](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-1-customer-account-information).

Decisión: pestañas Open / Settled, con filtros de tipo y fecha. Una fila es una apuesta, no una selección del borrador. La demo incluye actividad inicial ficticia; un periodo sin datos se explica como vacío del historial simulado, sin inventar años de transacciones.

## Recorrido y respuestas

Mis apuestas → filtrar → abrir ticket → ver condiciones, importe, cuota aceptada, estado e ID → seguimiento, recibo o Cash Out según situación. Volver conserva filtro y scroll. El nuevo recibo aparece tras aceptación; una solicitud desconocida se muestra como operación pendiente diferenciada.

| Estado | Respuesta |
| --- | --- |
| Abierta prepartido | Hora y selecciones; no marcar condiciones favorables antes de jugar |
| Directo | Resumen contextual; abrir detalle conserva el ticket |
| Pendiente de liquidación | Marcador final y estado explícito, sin tratarlo como error automático |
| Liquidada | Importe retornado y resultado neto, incluidos void o Cash Out |
| Sin resultados del filtro | Mantener controles y ofrecer quitar filtro |

Escritorio: lista y detalle pueden convivir. Móvil: lista → detalle con volver claro. Los IDs largos se pueden copiar, con feedback y sin compartirlos externamente. El contacto de ayuda usa el ID del ticket sin lanzar una conversación real.

## Criterios de aceptación

- F08-A01: lista, detalle y movimientos se refieren al mismo ID y stake.
- F08-A02: cambiar filtros o viewport no modifica el ticket.
- F08-A03: una apuesta cerrada por Cash Out no aparece como abierta ni recibe una segunda liquidación.
- F08-A04: retorno y neto no confunden pérdida reducida con ganancia.

Para Claude durante implementación/validación: agrupación por fecha/estado y cómo mostrar recibos largos sin ocultar una condición perdida. Verificar historial desde enlaces directos, no solo tras completar el recorrido principal.
