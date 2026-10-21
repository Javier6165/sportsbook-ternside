# Datos y escenarios de investigación de la demo

v0.1. Son artefactos de datos para especificar el comportamiento futuro; no se ha implementado la aplicación.

## Archivos

- [fixtures.json](fixtures.json): cuenta ficticia, cinco eventos, historial inicial, 23 cotizaciones de selecciones/subconjuntos y snapshots de directo.
- [scenario-cases.json](scenario-cases.json): 48 casos independientes con acciones descritas, resultados esperados y casos monetarios comprobables.
- [acceptance-matrix.md](acceptance-matrix.md): índice legible de los casos y sus dependencias.

Todos los nombres, partidos y precios son ficticios. Los precios son entradas redactadas para escenarios; no un modelo estadístico ni una recomendación de apuesta.

## Contrato de uso

Cada caso parte de su propio estado inicial; no encadenar C01–C48 sobre una misma cuenta y esperar los mismos saldos. `opening_available` representa el disponible inicial de ese caso, no una nueva operación de depósito. Los movimientos iniciales del catálogo suman £100: apertura £100, apuesta histórica £5 y devolución £5.

Los importes se guardan como strings decimales en GBP. Las cotizaciones de builder se buscan por conjunto de selecciones y versión. La tabla cubre cualquier subconjunto no vacío que el constructor acotado puede ofrecer: un resultado opcional, un total opcional y el jugador opcional. No contiene HOME+AWAY o OVER+UNDER.

Para la versión qv2 del ejemplo se copia la tabla de qv1 y se aplica la modificación declarada. La aceptación archiva el conjunto de precios resultante; una posterior anulación no consulta el catálogo actual.

Los casos tienen estado `specified_not_app_tested`. Una comprobación aritmética del JSON no prueba que un botón, un envío o una transición funcionen en una app. El registro de ejecución real se añadirá durante prototipado/implementación.

## Relojes

Reloj de evento: minutos y estado deportivo. Reloj de cuenta: ventanas de límites y esperas. Reloj de sesión: tiempo de uso. Avanzar uno no debe avanzar los otros automáticamente. Se fijan fechas y zona para que los mismos casos sean reproducibles fuera del día real en que se explore el portfolio.

## Operaciones que no se simulan como reales

No hay pasarela de pago, registro de exclusión público, feed contratado, cuenta de operador ni autenticación real. El marco de presentación puede cargar escenarios, pero una acción dentro del producto no puede aprobar su propia verificación o imponer un marcador.

## Variantes de la tanda 4

C29–C36 cubren exclusión con apuestas abiertas, abandono por condición y corrección oficial de liquidación. Son casos independientes: no se encadenan correcciones de pagos devueltos por exclusión ni saldo negativo. El límite de combinación es parte del contrato, no una resolución implícita. [Justificación y tablas](../research/09-lifecycle-edge-cases.md).

## Correcciones de la revisión crítica

C37–C44 cubren pérdida hipotética determinada, HALF_UP, ventana móvil de depósitos y DST, enlaces a límites, oferta live, cierre al inicio y precisión de combinadas. C22 ahora comprueba sustitución inmediata con Undo. Los datos incluyen seis precios live en dos snapshots y depósitos fechados para las pruebas temporales. [Contrato live](../product/live-offer-contract.md), [revisión](../research/11-critical-review.md). Los acumulados de depósitos son valores derivados; los casos con registros fechados no los reinician a medianoche.

## Talón compartido y modos

C45–C48 concretan alternancia de modos, consumo tras aceptación, edición estable de builder y conversión explícita sin heredar stakes. Tres semillas independientes en `betslip_case_seeds` sirven de setup; no añaden grupos a la sesión inicial vacía. [Contrato](../product/betslip-state-contract.md). La conciliación monetaria no prueba la transición de interfaz; esas tareas se ejecutarán cuando exista prototipo.

## Alcance final del handoff

F01–F14/F16 activos; F15 fuera de v1. C18/C21 se ejecutan por navegación/búsqueda convencionales, sin chat. Los 48 casos siguen vigentes y monetariamente iguales. [SIM-01](../implementation/scenario-engine.md) define ocho escenas curadas y carga de setups para pruebas; [QA-01](../implementation/acceptance.md) define lo que ejecutará Claude. No hay capturas obligatorias.
