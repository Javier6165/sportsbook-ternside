# Reglamento coherente de la demo

RULES-GB-01 · revisión documental v0.4 · 20-10-2026. Políticas propias del concepto para una demo; no son el reglamento íntegro de un operador real. Los hechos externos se resumen en el registro de fuentes; aquí se fijan decisiones verificables.

## R01. Dinero y límites del alcance

GBP ficticias. Sin bonos ni free bets. Stake mínimo £1, máximo £50 por apuesta, en incrementos de £0.01; son límites elegidos para este concepto. Precio decimal fijo aceptado. Retorno bruto = stake × cuota. Redondear una sola vez a peniques al final del retorno de cada apuesta con HALF_UP: medio penique se redondea hacia arriba para importes positivos. Ejemplo: £1.25 × 2.10 = £2.625 → £2.63. En combinadas se multiplican los precios aceptados sin redondeos intermedios; se muestra el producto exacto necesario, hasta seis decimales para tres precios de dos decimales. No calcular el pago desde una cuota conjunta visual truncada. Beneficio neto = retorno bruto − stake. Pérdida neta de una apuesta perdida = −stake; una apuesta anulada devuelve el stake, neto cero.

Ejemplo: £10 a 3.40 → £34 de retorno y £24 de beneficio. Mostrar «return» y «profit» diferenciados. Las simples se envían individualmente; nunca sumar stakes de varias filas y presentarlos como stake de una combinada.

## R02. Tipos

Simple: una selección. Combinada: de dos a tres selecciones de eventos diferentes, con producto de cuotas aceptadas. Builder: dos o tres condiciones compatibles del mismo partido, con una cotización conjunta de la tabla del escenario. Una condición sola se trata como simple.

Los valores máximos son alcance propio. No se mezclan builders con combinadas ni se permiten dependencias entre selecciones del mismo evento dentro de una combinada estándar. Ese caso dirige al constructor con revisión explícita. No se convierte una simple en combinada o builder de forma silenciosa.

El [contrato del talón](betslip-state-contract.md) fija una lista compartida de grupos y stakes separados por grupo/combinada. Cambiar de modo no copia apuestas. Una aceptación consume los grupos enviados; un rechazo los conserva y una respuesta desconocida congela el intento hasta reconciliarlo. Builder se envía por separado, rotulado con su tipo; no entra en combinadas en esta base.

## R03. Fútbol del recorrido principal

Todos los mercados ofrecidos son de tiempo reglamentario: 90 minutos más añadido. No cuentan prórroga ni penaltis. El evento ficticio siempre tiene formato estándar. Mercados: resultado 1X2; más/menos de 2.5 goles; jugador con 2+ tiros a puerta.

El jugador debe participar al menos una vez para que su selección tenga efecto. Estar en el banquillo no anula la selección. Si no participa al terminar el partido, es void. Si participa y registra menos de dos tiros válidos, pierde. Esta política del concepto se apoya en un precedente concreto de Sky Bet, no se generaliza a todos los mercados de jugador. [S48](https://support.skybet.com/app/answers/detail/player-not-starting).

La estadística de tiro a puerta usa la definición fijada en la ficha del mercado y datos ficticios: no todo tiro es un tiro a puerta; una acción anulada no cuenta. No se presenta a Opta como proveedor contratado del proyecto. Referencia para definir el significado: [S49](https://support.skybet.com/app/answers/detail/opta-football-statistics-definitions).

## R04. Compatibilidad y cotización de builder

Un resultado, un total y una condición de jugador como máximo. Cambiar Home por Away en el mismo grupo sustituye inmediatamente la condición del borrador, muestra el cambio y permite Undo; no abre confirmación modal ni añade dos resultados mutuamente excluyentes. Undo restaura la selección anterior y consulta su cotización vigente, sin resucitar una revisión monetaria caducada. Over y Under de la misma línea tampoco pueden coexistir. Repetir una selección no crea una condición adicional.

Las parejas y tríos permitidos tienen precio propio. No usar producto de precios individuales ni «precio completo dividido por cuota del jugador» al recalcular. La tabla de cotizaciones guarda cada subconjunto con versión y motivo de disponibilidad.

Como referencia de producto, Sky Bet documenta conflictos de construcción y continuidad del resto de selecciones tras un void. [S37](https://support.skybet.com/app/answers/detail/buildabet). La demo adopta un contrato propio y acotado para hacerlo reproducible.

## R05. Void y prioridades de resolución

En simple, void devuelve stake. En combinada, la selección void se elimina del producto, equivalente a factor 1.00. Si quedan ganadoras y ninguna perdedora, se paga con las restantes; si todas son void, devuelve stake; si hay una perdedora confirmada, el retorno es cero.

En builder, primero se determinan las anulaciones y se identifica el subconjunto restante. Luego se usa su precio archivado. Si queda una condición, su precio de simple archivado; si no queda ninguna, devuelve stake. Si una condición restante pierde, retorno cero. No se decide «ganada» solo porque se eliminó una condición.

Ejemplo propio: Home + Over 2.5 + Player 2+ SOT, precio 3.40. Si el jugador no participa y el resto gana, el precio de Home + Over archivado es 2.70: £10 devuelve £27, no £34 ni £17.89. Se conserva el precio original y se explica el precio de liquidación.

## R06. Aplazamiento y abandono

El escenario de aplazamiento bloquea nuevas apuestas y mantiene las existentes pendientes mientras no se haya determinado la política aplicable. El panel de demo puede confirmar cancelación definitiva: en ese escenario todas las selecciones no disputadas son void. No se introduce un plazo ficticio y se atribuye al sector.

El escenario de abandono se define expresamente como no reanudable. Se conservan resultados ya determinados según su regla y se anulan condiciones todavía indeterminadas. No deducir qué quedó determinado de una etiqueta visual: necesita resultado oficial del escenario. Un 1X2 de 90 minutos sin completar es void. Con tres o más goles oficialmente confirmados, Over 2.5 gana y Under 2.5 pierde; con menos de tres ambos son void. Player 2+ SOT gana si participó y alcanzó dos tiros válidos confirmados; en los demás casos es void en este supuesto de abandono. La política de jugador en abandono es propia. No usar el último contador provisional como resultado oficial.

En builder se aplican esas resoluciones y R05: Home+Over+Player a 3.40 con abandono 2–1 y un SOT queda en Over a 1.80 → £18 por £10; con dos SOT confirmados queda Over+Player a 2.50 → £25. Home+Under devuelve cero al confirmarse tres goles. Tabla y ejemplos: [decisión de abandono](../research/09-lifecycle-edge-cases.md). Precedente de totales: [S65](https://help.bet365.com/s/en-gb/sportsrules/soccer/goal-line).

Este comportamiento de demo se inspira en [S52](https://support.skybet.com/app/answers/detail/football-in-play-rules/). Las ventanas de reanudación son distintas entre ofertas; otros supuestos no se resuelven extrapolando este caso.

## R07. Directo y confirmación

Los datos pueden corregirse. Marcador, estadísticas, disponibilidad y resultado oficial son campos separados. Un umbral alcanzado puede regresar a pendiente por una corrección; se conserva el motivo. Ninguna animación abona saldo.

Al final se muestra «Awaiting settlement» hasta que el escenario emita el resultado oficial. El catálogo puede actualizar precios; la apuesta aceptada mantiene su snapshot. La simulación no representa una obligación de liquidar en un tiempo universal.

Una corrección oficial posterior crea una versión nueva de liquidación y un ajuste de saldo por la diferencia entre retorno bruto nuevo y anterior; no vuelve a debitar stake ni borra el crédito anterior. Se guardan motivo, fecha e ID de la versión sustituida. Repetir versión no repite dinero; versiones anteriores no cambian el estado vigente. Lista, recibo y detalle usan la misma versión. Ejemplo: £10 a 2.10, ganada y después perdida → crédito inicial £21, ajuste −£21, saldo final £90 desde £100. Precedente: [S66](https://support.betfair.com/app/answers/detail/general-sports-betting-rules).

Alcance: las fixtures de corrección mantienen saldo suficiente. No se simulan deuda/saldo negativo, ajustes de fondos ya devueltos por exclusión o corrección de un Cash Out erróneo. No ofrecer encadenamientos no definidos desde los controles de demo; véanse [límites de los casos](../research/09-lifecycle-edge-cases.md).

## R08. Envío y respuesta desconocida

Cada intento tiene un ID de operación. Revisar cuota, saldo, cuenta y mercado antes de aceptar. Si cambia cualquier cuota, pedir revisión del nuevo precio; no aceptar cambios automáticamente en la versión base, incluidos los favorables. Si la respuesta se pierde, comprobar la misma operación y evitar que una repetición duplique stake o recibo.

Durante la comprobación se muestra saldo confirmado anterior y la operación pendiente por separado. Las acciones monetarias nuevas se bloquean hasta reconciliarla. Al recuperar aceptación se aplica un único débito; ante rechazo, ninguno. Navegar no convierte el intento en rechazo ni provoca reenvío.

## R09. Cash Out

Solo total. Oferta y confirmación con ID/versión. Si la oferta cambia antes de confirmarse, revisar el importe nuevo. Si desaparece, la apuesta sigue abierta. Si se pierde respuesta, reconciliar la operación antes de otro intento.

Al confirmarse, acreditar exactamente el importe bruto de cierre una sola vez; no sumar otra devolución de stake. Ejemplo: £100 inicial, stake £10 → £90; Cash Out £8 → £98. La pérdida neta de la apuesta es £2, no una ganancia de £8. No permitir cierre y liquidación doble. La investigación de referencia distingue oferta, procesamiento, éxito y fallo. [S46](https://support.skybet.com/app/answers/detail/cash-out).

## R10. Cuenta y caja

Saldo disponible separado de stakes abiertos y retiradas pendientes. Depósito confirmado suma; fallido no suma. Solicitud de retirada ordinaria resta disponible y crea reserva; al completarse no se resta otra vez. Si se rechaza, la reserva vuelve una vez. Las devoluciones por exclusión tienen el tratamiento específico de R11: un rechazo no habilita saldo para juego. No hay acción de cancelar retirada.

El depósito usa un método ficticio de débito; no hay campos para datos financieros reales. Retirar no exige apostar antes el dinero. Restricciones de cuenta bloquean las acciones pertinentes con motivo; la asistencia no puede eliminarlas. La actividad identifica cada apuesta y movimiento.

## R11. Juego seguro

Límites de depósito bruto elegidos para la demo: últimas 24 horas y últimos 7 días (168 horas) por tiempo transcurrido, más mes natural en `Europe/London` desde el día 1 a las 00:00 local. Son políticas propias, no la afirmación de que RTS 12 obligue a ventanas móviles. Sustituyen el borrador que confundía 24 h con día natural.

Para las ventanas móviles se cuentan depósitos confirmados con fecha en `(ahora − duración, ahora]`; el depósito situado exactamente en el borde antiguo deja de contar. Medianoche no repone margen de 24 h/7 días. El cambio estacional de hora no acorta/alarga esas duraciones; sí afecta las fronteras locales del mes natural. Guardar depósitos fechados y derivar consumo, no reiniciar un contador cada medianoche. Copy: «Last 24 hours», «Last 7 days», «This calendar month». Los importes iniciales £20/£50/£100 son límites previamente elegidos por el personaje ficticio, no una recomendación de presupuesto.

Aplicar el margen más restrictivo. Una retirada o devolución de apuesta no recupera margen de depósito. Un depósito fallido no consume margen. Ejemplo: límite diario £20 y £15 depositados → máximo restante £5. Un stake nuevo de £10 usa saldo y no consume £10 de ese límite.

Reducción inmediata; aumento con espera mínima de 24 h y nueva confirmación, sin aplicarse por un simple avance del reloj. La pausa bloquea nuevas apuestas y depósitos, conservando acceso a actividad y retirada. La autoexclusión cierra el acceso de juego e inicia la devolución de fondos, con una superficie de confirmación y ayuda separada; no deja la cuenta de apuestas operable. Es una distinción necesaria según [S43](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/3-5-3-remote-sr-code). El periodo de exclusión no termina automáticamente en acceso activo. Las apuestas ya aceptadas no se borran; su resolución y cualquier devolución posterior requieren conservar el registro. C19 cubre exclusión sin abiertas y C29 con una apuesta abierta. La exclusión se aplica sin esperar el resultado. El disponible se reserva para devolución y los tickets pendientes se resuelven con sus reglas aceptadas. Si generan un retorno posterior, se acredita y reserva para una devolución adicional en una operación identificable, sin habilitar dinero para jugar. V13 muestra el estado administrativo y ayuda, sin cuotas, directo o Cash Out. Precedente: [S64](https://support.betfair.com/app/answers/detail/a_id/10559/).

Si una operación anterior tiene respuesta desconocida, se bloquea el juego al excluirse y se reconcilia el mismo ID antes de calcular la devolución restante. Una devolución rechazada sigue pendiente con ayuda; nunca reactiva juego o depósito.

## R12. Cobertura secundaria

Tenis: solo ganador, requiere completar el partido; retirada, descalificación o walkover anulan el mercado. Es una política simplificada propia, expresamente diferente de variantes reales que dependen de competición y sets. Basket: ganador incluyendo prórrogas; finalización normal obligatoria y cancelación definitiva void. Sin periodos parciales o empate.

Las diferencias documentadas justifican no reutilizar una regla genérica de fútbol para todos los deportes: [S53](https://support.betfair.com/app/answers/detail/tennis-rules/), [S54](https://support.betfair.com/app/answers/detail/basketball-rules/). Si se amplían mercados, hay que ampliar reglas y escenarios antes de añadir cuotas a la interfaz.

## R13. Inspector y panel de presentación

El inspector responde a supuestos con reglas, sin modificar partido, precio o apuesta. Algunos resultados serán condicionales: «Si además se cumplen las otras condiciones…». Un empate por sí solo no determina un total de goles ni tiros del jugador. Si el supuesto es empate tras completar 90 minutos y el ticket exige Home, esa condición pierde y basta para concluir retorno hipotético £0. No es necesario inventar las estadísticas restantes; no etiquetar todo el ticket como indeterminado.

El panel de presentación sí puede cargar un escenario completo. Se identifica como «Demo controls», fuera de navegación de apuestas. Reiniciar exige confirmar que se perderán cambios ficticios y restaura todos los datos relacionados, incluido saldo y restricciones. No se presenta ese reinicio como forma de reactivar una cuenta real excluida.

## R14. Oferta y aceptación por fase

[Contrato de oferta live](live-offer-contract.md): builder solo prepartido; nueva simple 1X2 en dos snapshots de directo con precios propios; combinadas solo con eventos prepartido en esta versión. No reutilizar cuotas prepartido tras el inicio ni enviar borrador a una fase nueva sin validación. Los tickets aceptados siguen su regla y precio originales. Los mercados de totales/jugador prepartido pueden verse como contexto cerrado; nunca ofrecen una cuota activa de mercado ya determinado.
