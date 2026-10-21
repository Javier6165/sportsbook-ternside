# F09 — Seguimiento en directo

Estado: spec documental v0.2; prioridad alta de revisión visual. Depende de F08, R07 y estados de datos/evento.

## Referencias y decisión

D: la documentación de Sky Bet advierte de retrasos y diferencias en estadísticas [S52](https://support.skybet.com/app/answers/detail/football-in-play-rules/). El tracking por selección tiene precedentes; la hipótesis aquí es continuidad de significado y reglas, no novedad del contador.

Decisión: cabecera de partido y condiciones del ticket, cada una con observación relevante y estado provisional. El aviso de retrasos es visible. Cuando falta un dato se muestra desconocido, nunca cero inferido.

## Recorrido y respuestas

Abrir ticket abierto → seguimiento → inspeccionar condición → volver. El marcador puede cambiar sin cambiar el resultado oficial. En el partido de referencia al minuto 68, 2–1 y un tiro del jugador, Home es favorable ahora, Over 2.5 alcanzó umbral provisional y Player 2+ sigue pendiente.

| Estado | Respuesta |
| --- | --- |
| Datos actualizados | Marcador, periodo y hora del último dato |
| Suspensión | Mercado/Cash Out afectados muestran estado; el ticket permanece |
| Estadísticas retrasadas | Último valor fechado y aviso; otras fuentes del evento pueden seguir actualizadas |
| Corrección | Cambiar contador y explicación del cambio; conservar historial de incidencia |
| Final del partido | Awaiting settlement hasta resultado oficial |

No se suman condiciones para mostrar una probabilidad. Un 1 de 2 tiros no implica un 50% de posibilidad. El usuario no puede mover el reloj desde este flow: los controles de escenario pertenecen a F16.

Escritorio: relación entre partido y condiciones visible simultáneamente. Móvil: contexto compacto persistente y condiciones legibles; avisos sin tapar CTA. Respetar reducción de movimiento y evitar que cada actualización capture foco.

## Criterios de aceptación

- F09-A01: una corrección de dos tiros a uno revierte el indicador provisional sin debitar/abonar saldo.
- F09-A02: feed caído no produce condición perdida ni Cash Out garantizado.
- F09-A03: Finalizado y Liquidado son estados diferentes.
- F09-A04: teclado y lector de pantalla pueden identificar condición y estado sin depender del color.
- F09-A05: seguir un builder aceptado no implica que se ofrezcan nuevos builders; las acciones de creación se rigen por el contrato de oferta live.

Para Claude durante implementación/validación: frecuencia y agrupación de anuncios de cambios, jerarquía de incidencias y continuidad visual con el ticket previo a apostar.
