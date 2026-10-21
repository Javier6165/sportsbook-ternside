# Excepciones que cambian el diseño del ticket

20-10-2026 · Tanda 4. Continúa la dirección contextual vigente. No aparece una alternativa de concepto superior que active D15. Se concreta la política de la demo; no se ha probado una interfaz.

## 1. Autoexclusión con una apuesta todavía abierta

**D:** Betfair contempla devolver fondos y aplicar un proceso de devolución a apuestas que estaban abiertas al excluirse y después ganan. [S64](https://support.betfair.com/app/answers/detail/a_id/10559/). El requisito de cierre/devolución de la referencia GB ya estaba registrado en S43. No debe interpretarse que una exclusión anula por sí misma todo ticket aceptado.

**Decisión propia:** la exclusión se aplica inmediatamente aunque existan apuestas pendientes. Se cierra la sesión de juego, se reserva el saldo disponible para devolución y se conserva el ticket en el registro. Su resultado se procesa por la regla aceptada. Un retorno posterior genera otro registro de devolución, sin permitir apostar o depositar y sin exigir volver al sportsbook.

V13 permite consultar información administrativa mínima: cierre, devolución inicial, apuestas pendientes de resolver, resolución e importe de una devolución posterior. No tiene cuotas, Cash Out, feed en directo, promociones o CTA para volver al juego. Esta separación es una decisión de producto, no una afirmación de que todos los operadores muestran esa pantalla.

**Ejemplo C29:** £100 iniciales; simple Home de £10 a 2.10. Quedan £90 disponibles al excluirse: se reservan para devolución. Si la apuesta gana, sus £21 se registran y reservan también: £111 devueltos en total, £0 disponibles, acceso de juego cerrado. Si pierde: devolución total £90. Si es void: £100. El stake no se devuelve además de los £21.

Si un envío monetario anterior tiene respuesta desconocida, se bloquean inmediatamente nuevas apuestas al excluirse, se conserva el mismo ID y se reconcilia antes de calcular la devolución final. No se rechaza la exclusión por una operación pendiente. La demora del banco no reactiva la cuenta. Una devolución rechazada conserva fondos pendientes y ayuda, nunca saldo habilitado para jugar.

## 2. Abandono: «iba ganando» no significa «ganada»

**D:** bet365 GB distingue resultados ya determinados en mercados de goles cuando se abandona el partido. [S65](https://help.bet365.com/s/en-gb/sportsrules/soccer/goal-line). La demo selecciona el supuesto de abandono definitivo sin reanudación; las ventanas de otros operadores no se copian.

**Política propia para los mercados ofrecidos**, solo después de confirmar oficialmente el abandono y los datos válidos:

| Mercado | Datos al abandono definitivo | Resultado de esa condición |
| --- | --- | --- |
| Resultado 1X2 de 90 minutos | Cualquier marcador sin completar el partido | Void; no existe resultado reglamentario completo |
| Over 2.5 | Tres o más goles confirmados | Ganada |
| Under 2.5 | Tres o más goles confirmados | Perdida |
| Over o Under 2.5 | Cero, uno o dos goles confirmados | Void; podría haber cambiado con el tiempo restante |
| Player 2+ SOT | Participó y tiene dos o más tiros válidos confirmados | Ganada |
| Player 2+ SOT | No participó o no alcanzó dos tiros confirmados | Void en este supuesto de demo |

La política de jugador en abandono es propia y explícita: no se deduce de S65 ni sustituye la regla de participación en partidos completos. Un contador provisional no basta para decidir ninguna fila. La confirmación incluye el recuento final válido, que puede corregir el último dato del feed.

**Ejemplos:** builder Home+Over+Player a 3.40, stake £10. Abandono 2–1 y Player con un SOT: Home y Player void; queda Over a 1.80 archivada → retorno £18. Con dos SOT confirmados queda Over+Player a 2.50 → £25. Abandono 1–0 con un SOT: todo void → £10. Builder Home+Under con 2–1: Under pierde → £0 aunque Home sea void. No convertir todas las condiciones en void por comodidad.

Antes de la decisión oficial: «Match abandoned — awaiting settlement», sin abono. El inspector solo ofrece resultados hipotéticos identificados como tales.

## 3. Una corrección posterior cambia una versión, no la historia

**D:** Betfair documenta reliquidaciones con ajustes del saldo [S66](https://support.betfair.com/app/answers/detail/general-sports-betting-rules). Sky Bet reconoce para Squad Bet que un indicador puede conservar WON tras reliquidarse VOID [S67](https://support.skybet.com/app/answers/detail/squad-bet/). Son antecedentes concretos; no hemos reproducido el problema ni medido cuántas personas lo sufren.

**Decisión propia:** distinguir corrección del feed sin dinero, C11, de corrección oficial posterior a una liquidación, C33/C34. Cada liquidación lleva versión, motivo, fecha, retorno bruto acumulado reconocido y referencia a la versión anterior. El ajuste es `nuevo retorno total − retorno total anterior`; no se vuelve a restar el stake. Una versión repetida no genera otro movimiento; una versión antigua nunca sobrescribe la vigente.

Ejemplo: simple Home £10 a 2.10, liquidada ganadora; saldo £111. Corrección oficial del resultado a perdedora: ajuste −£21, saldo £90. Historial conserva crédito £21 y ajuste −£21, ticket vigente Lost, aviso «Settlement updated» y detalle del cambio. Otra rama de la demo pasa de perdida a ganada: +£21. Lista, recibo y detalle deben usar la misma versión vigente; la versión original queda dentro del historial, identificada como anterior.

**Límite explícito de alcance:** las fixtures de corrección posterior mantienen fondos suficientes para el ajuste; no se ofrecen resultados de saldo negativo, cobro de deuda, ni corrección de pagos ya devueltos por exclusión. No son casos resueltos implícitamente. Si se amplía la demo para encadenarlos, primero hay que definirlos. El demo framework carga casos independientes y evita ofrecer combinaciones de escenarios no soportadas. Cash Out correcto no se reliquida por un resultado deportivo posterior; no se simula la corrección de un Cash Out erróneo.

## 4. Qué aporta al case study

El argumento se hace más concreto: representar con coherencia lo que se aceptó, lo que está ocurriendo y lo que se ha pagado. No se ha demostrado aún que esta representación mejore comprensión. La prueba visual debe comprobar si el cambio de versión se entiende sin añadir un historial técnico permanente al ticket.

Las tres decisiones afectan al [reglamento](../product/demo-rules.md), al [dominio](../product/domain-model.md), a F11/F13/F14 y a los [casos de aceptación](../demo/scenario-cases.json). La nueva evidencia respalda profundizar en el concepto vigente; no justifica reemplazarlo por una nueva propuesta sin hablar con Javier.
