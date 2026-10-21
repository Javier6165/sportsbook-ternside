# F05 — Combinada entre eventos

Estado: spec documental v0.2. Reglas R01/R02/R05 y envío F07.

## Referencias y decisión

D: el tipo acumulador requiere resultados de eventos distintos, y las selecciones anuladas pueden reducirlo [S47](https://support.skybet.com/app/answers/detail/bet-types), [S51](https://support.skybet.com/app/answers/detail/bet-settlement-policy).

Decisión: pestaña o modo Accumulator explícito al reunir dos o tres eventos. Solo componentes todavía prepartido en la versión base. Stake único y retorno conjunto; nunca heredar automáticamente la suma de stakes escritos en Singles. Los modos comparten la misma lista de grupos y preservan sus importes separados, sin copiar selecciones. Se envía solo el modo visible y revisado. No hay builders dentro de la combinada ni exclusiones silenciosas de grupos incompatibles. [Contrato del talón](../product/betslip-state-contract.md).

## Recorrido y respuestas

Añadir eventos → elegir Accumulator → revisar componentes y periodos → fijar stake → confirmar. Quitar una selección conserva el borrador; si queda una, se informa y se ofrece continuar como simple mediante acción explícita.

| Estado | Respuesta |
| --- | --- |
| Dos selecciones del mismo evento | Explicar dependencia; no multiplicar. Ofrecer revisar en builder si son compatibles |
| Menos de dos / más de tres | Indicar requisito del alcance; no eliminar selecciones sin decisión |
| Una cuota cambia | Mostrar componente afectado, precio conjunto anterior/nuevo y retorno nuevo |
| Una selección suspendida | Bloquear envío conjunto y permitir quitarla; conservar stake |
| Una selección void después | Recibo conserva selección y explica precio de liquidación reducido |

Escritorio: componentes compactos con contexto completo desplegable. Móvil: lista vertical y resumen con stake/retorno; no obligar a volver arriba para entender el total. Cuotas de piernas y cuota conjunta deben distinguirse visualmente.

## Criterios de aceptación

- F05-A01: dos cuotas independientes 2.10 y 1.80 dan 3.78; £10 retorna £37.80 si ambas ganan.
- F05-A02: si la segunda es void y la primera gana, el retorno es £21, sin devolución adicional de stake.
- F05-A03: una pierna perdedora confirmada produce retorno cero aunque otra sea void.
- F05-A04: cambiar de modo no envía apuestas ni convierte importes sin revisión.
- F05-A05: una selección que pasa a live bloquea esa combinada prepartido; ofrece editar, sin usar su precio anterior.
- F05-A06: 2.10×1.80×1.65 conserva cuota conjunta exacta 6.237; £1.25 retorna £7.80 tras redondear solo el retorno final.
- F05-A07: aceptar la combinada consume todos sus grupos y stakes separados, vacía el stake conjunto y no deja copias en Singles.
- F05-A08: si un grupo se envía antes como simple, la combinada anterior pierde su revisión y reevalúa elegibilidad; nunca vuelve a enviar ese grupo.

Para Claude durante implementación/validación: comunicación de cambio de tipo al quedar una selección; comprobar que el usuario distingue dos simples de una doble con el mismo importe visible.
