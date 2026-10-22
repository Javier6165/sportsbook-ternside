# Revisión del nuevo handoff y de las promociones

22-10-2026 · Revisión documental de `HANDOFF-TO-ASTRA.md`, secciones 0b/0c, `PLAN-AMPLIACION.md` y `TEST-PLAN.md`. Copias fechadas en `inputs/`. **No se ha leído ni modificado `domain/promos.ts` ni otro código en esta tanda**, por instrucción de Javier. No se afirma conformidad funcional ni legal de la implementación.

## Lo que cambia en el relato

La ampliación separa For you y Popular, devuelve profundidad al catálogo e incorpora cinco promociones. Se puede defender como una iteración del diseño: la simplificación se aplica a jerarquía y explicación, mientras el producto conserva amplitud.

El case study debe retirar la promesa «sin promociones» y cualquier conclusión «no depredador» o «sin influencia en gasto». La claridad, el opt-in y los topes reducen ciertas fricciones o restricciones, pero no demuestran neutralidad conductual. Es una tensión documentada, no una razón para inventar evidencia a favor.

## Verificación solicitada por Claude: fuente primaria

**Confirmado en el texto actual de [LCCP 5.1.1](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/5-1-1-sr-code):**

- 3(a): máximo de 10 veces en requisitos de apuesta que exigen jugar bonus funds para que fondos sean retirables.
- 3(b): un incentivo no debe incluir más de un tipo de producto entre betting, casino, bingo y lottery.
- 2: condiciones claras, transparentes, justas y accesibles.
- 3(c): no aumentar el incentivo por completar la actividad/gasto cualificante en menos tiempo dentro del periodo ofrecido.

**Fecha:** 19-01-2026, confirmada en la [respuesta oficial de consulta](https://www.gamblingcommission.gov.uk/consultation-response/autumn-2023-consultation-proposed-changes-to-lccp-and-rts-socially/proposal-1-ban-or-limit-the-use-of-wagering-requirements). La jurisdicción es GB y el ámbito de licencias de la condición; no es una norma uniforme para toda Europa.

**Cómo describir el 0x del concepto:** no hay requisito de volver a apostar las ganancias para retirarlas, según el plan. Esto no significa que la recompensa se entregue sin apuesta cualificante ni que el crédito promocional sea dinero retirable. Mostrar por separado esos conceptos. Elegir 0x es decisión propia; el tope de 10x no obliga a usar el máximo.

## Cinco promociones: qué habría que justificar y explicar

Son recomendaciones para especificación y evaluación. No se ha comprobado si el código ya las resuelve.

| Oferta del plan | Justificación que conviene corregir | Información o decisión que falta cerrar en la documentación |
| --- | --- | --- |
| Matchday Predictor | «El estándar menos dañino del sector» es una comparación no demostrada | Participación sin depósito/apuesta; premio de £100 **en free bets**, no £100 cash; cuántos créditos se reciben, reparto si hay empate, vencimiento y disponibilidad. No mezclar sin revisión los ámbitos de concurso/premio/apuestas |
| 2 Goals Ahead | «No induce a apostar más» no está medido | Elegibilidad prepartido/1X2, resultado oficial usado para activar, gol anulado/VAR, abandono y apuesta ya pagada. Separar el pago promocional de la liquidación deportiva ordinaria |
| Bet Builder Insurance | «Recuperas el stake» confunde crédito y efectivo; tres condiciones no garantizan menor riesgo | Máximo £5 **en free bet**, exactamente qué se considera condición perdedora/void, elegibilidad y caducidad. Evitar enmarcarlo como apuesta sin pérdida |
| Weekend free bet | Una sola apuesta y tope bajo no demuestran ausencia de intensificación | Apuesta cualificante de £10, cuota mínima, periodo y zona horaria; cuándo se concede, hasta cuándo se usa, qué ocurre con void y Cash Out |
| Welcome offer | Que Sam no pueda usarla no evita malentendidos | «New customers only» y no elegibilidad visibles antes de CTA; apuesta cualificante, recompensa promocional, plazo y condiciones materiales. No dar una acción aparentemente disponible a quien no cumple |

El [experimento ESRI](https://www.esri.ie/system/files/publications/RB202509_0.pdf) obliga a tratar la influencia de incentivos como una cuestión empírica. El [estudio UK de 2026](https://link.springer.com/article/10.1007/s10899-026-10491-6) respalda examinar ejemplos numéricos, pero no demuestra que nuestra propuesta cambie la comprensión: ver los límites del diseño experimental en B06.

## Dos consecuencias de producto para revisar con Claude

**Pago anticipado y directo.** El principio anterior «nada se paga por el marcador» necesita una excepción explícita si existe 2 Goals Ahead. Una condición puede seguir provisional en el seguimiento deportivo mientras una promoción ya haya abonado un importe bajo una regla definida. La demo debería poder explicar ambos estados sin duplicar un pago. Esto es una cuestión conceptual derivada del nuevo plan, no un defecto observado en código.

**Autoexclusión, derechos y saldo.** Bloquear nuevas promociones y nuevas apuestas es diferente de decidir qué ocurre con recompensas ya devengadas y pagos posteriores. La [guía UKGC de free bets y restricciones](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/free-bets-and-account-restrictions-in-relation-to-sports-betting) aconseja no tratar cualquier restricción como excusa automática para frustrar derechos previos. No significa permitir juego tras autoexclusión: hace falta una política administrativa separada y términos claros. No se certifica aquí que cancelar todo crédito promocional sea conforme.

## Preferencias y ámbitos regulatorios

El control «Offers on the home pages» es una preferencia de interfaz. [LCCP 5.1.12](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/5-1-12-direct-marketing-preferences) trata el marketing directo por canal y producto, con opt-out por defecto. No presentarlos como si fueran el mismo consentimiento.

[RTS 14](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-14-responsible-product-design) respalda límites al estímulo de perseguir pérdidas y la no reversión de retiradas, con sus ámbitos concretos. No demuestra que limitar un builder a tres condiciones haga segura una oferta. [RTS 3](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-3-rules-game-descriptions-and-the-likelihood-of-winning) tiene un ámbito diferente del sportsbook de deporte real; evitar citarlo como obligación genérica de esta demo.

## Otras peticiones del handoff

Texturas de camisetas, iconos de competición e ilustraciones promocionales se han identificado, pero quedan fuera de esta tanda de evidencia. No se han generado assets ni tocado sus carpetas. Tampoco se ha vuelto a auditar la app ni verificado los recuentos de tests: los números 67/87 del handoff son declaraciones de Claude en cortes distintos, no resultados de esta investigación.

## Nota breve que puede usar Claude

La fuente primaria de UKGC confirma 10x y prohibición de mezclar tipos de producto en un incentivo, con entrada el 19-01-2026. Mantener el 0x del concepto descrito como ausencia de reapuesta de ganancias, diferenciándolo de la apuesta cualificante y del crédito no retirable. Para el case study, sustituir «promociones no agresivas/no inducen más juego» por condiciones, restricciones y decisiones observables. Revisar cómo se explica 2 Goals Ahead frente al principio de directo provisional y añadir una tarea de comprensión de free bets. No se ha auditado la implementación.
