# Próxima fase: investigación y definición por flow

Estado actualizado: este inventario inicial se ha desarrollado en una [primera spec de F01–F16](../flows/README.md), con [reglas compartidas](../product/demo-rules.md). El [plan actual](../project/research-plan.md) ordena el trabajo restante. Las pantallas finales y la validación visual siguen pendientes.

## Orden de investigación propuesto

El núcleo se investiga primero porque determina el vocabulario, las entidades y los estados compartidos. Cuenta, dinero y juego seguro se integran desde la arquitectura; se detallan con la jurisdicción elegida.

| ID | Flow | Prioridad | Preguntas que hay que resolver | Referencias iniciales |
| --- | --- | --- | --- | --- |
| F01 | Home, deportes, competiciones y favoritos | Núcleo | ¿Cómo se descubre un evento sin perder densidad? ¿Qué persiste al volver? | bet365 y bwin observados |
| F02 | Búsqueda y desambiguación | Núcleo | Equipos homónimos, jugadores, eventos de hoy, mercado ausente, resultados vacíos, petición ambigua | bet365; AceAI como precedente |
| F03 | Evento y navegación de mercados | Núcleo | Periodos, categorías, estadísticas, mercado cerrado o suspendido y reglas accesibles | bwin observado; guías de operadores |
| F04 | Selección simple y talón | Núcleo | Añadir, quitar, editar importe, moneda, retorno, saldo insuficiente | RTS 2; recibos y ayudas de operadores |
| F05 | Combinada entre eventos | Núcleo | Simples frente a combinada, eventos pendientes, selección anulada y número de apuestas | Reglas actuales del país elegido |
| F06 | Bet Builder | Núcleo | Compatibilidad, correlación, cotización, cambios de jugador, tratamiento de anulaciones y prueba previa de escenarios | bet365, Betano, Sky Bet |
| F07 | Envío y confirmación | Núcleo | Cambio de cuota, suspensión entre revisión y envío, demora, rechazo, doble clic y resultado desconocido | Ayudas de colocación; contrastar por operador |
| F08 | Mis apuestas y recibo | Núcleo | Abiertas, liquidadas, filtro, detalle, ID, importe y reglas aceptadas | Modelo del ticket; reglas de liquidación |
| F09 | Seguimiento en directo | Diferenciador | Qué se puede afirmar por condición, latencia, feed parado y correcciones | RTS 15; observar referentes autenticados si se dispone de acceso autorizado |
| F10 | Cash Out | Núcleo acotado | Elegibilidad, nueva cotización, suspensión, confirmación y dinero acreditado | UKGC y BetMGM; revisar reglas específicas |
| F11 | Liquidación y excepciones | Diferenciador | Ganada, perdida, void, devolución, partido aplazado/abandonado y revisión de estadísticas | Reglas de deporte y mercado; no mezclar operadores |
| F12 | Cuenta, login y verificación | Soporte esencial | Invitado, usuario demo, sesión vencida, pendiente, rechazada y recuperación | Autoridad del país elegido |
| F13 | Saldo, depósito, retirada y movimientos | Soporte esencial | Saldo disponible, dinero comprometido, pago fallido, retirada pendiente y límites | RTS 2/12 o referencias locales |
| F14 | Juego seguro y ayuda | Esencial transversal | Límite, reducción, aumento pendiente, pausa, autoexclusión y consulta de actividad | UKGC/DGOJ; DraftKings como referencia de presentación |
| F15 | Asistencia por intención | Opcional | Respuesta estructurada, fuera de cobertura, datos caducados, negativa y acceso convencional | AceAI y Bet Mentor; diseño propio por validar |
| F16 | Presentación y reinicio de demo | Demo | Persistencia, selector de viewport, avance de partido, navegación libre, reinicio y restauración | Requisitos del portfolio |

## Entidades que deberán quedar consistentes

Deporte, competición, evento, participante, mercado, periodo, selección, cotización, talón, apuesta aceptada, condición de builder, oferta de Cash Out, liquidación y movimiento de saldo.

El talón editable y la apuesta aceptada necesitan distinguirse. Una cotización nueva no modifica retroactivamente la cuota aceptada. Una variación visual del partido no es por sí sola una liquidación ni un movimiento contable.

## Evidencia requerida por flow

Comparar dos o tres referencias pertinentes, en vez de repetir todas las marcas por sistema. Registrar país, dispositivo, sesión, fecha, tarea y captura; explicar si la evidencia procede de ayuda o de una interacción observada. Las limitaciones de acceso deben permanecer visibles.

Cada flow utilizará la [plantilla](../templates/flow-research-template.md). Su salida debe contener camino principal, variantes, errores, reglas, comportamiento móvil/escritorio, copy clave, implicaciones para datos y criterios de aceptación. Una hipótesis pendiente tendrá un plan de comprobación o una razón explícita para aplazarla.

## Prueba visual después de definir el núcleo

Producir referencias de seis pantallas conectadas: home, evento, builder, revisión, seguimiento y liquidación. Primero comprobar composición y densidad; después afinar el lenguaje visual. Cada imagen necesita anotar qué decisión prueba, qué parte es ilustrativa y qué estados no muestra.

Las imágenes generadas pueden ayudar a explorar aspecto. La revisión funcional se hará contra reglas y estados escritos: una imagen atractiva no demuestra que el flujo esté resuelto.

## Criterio para pasar a tecnología y handoff

La fase de definición estará lista cuando cada interacción visible tenga una respuesta prevista, los escenarios de dinero sean consistentes, los flows esenciales estén conectados y las referencias móvil/escritorio resistan el contenido realista. Entonces se evaluarán tecnología, bibliotecas y formato de entrega para la implementación en la nube.
