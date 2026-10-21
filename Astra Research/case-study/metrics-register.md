# Registro de cifras y medición

Consultado el 20-10-2026. Cada cifra conserva unidad, periodo, geografía, población/base, fuente y límite. GGY/GGR describen ingresos brutos del juego según sus fuentes; no el total de dinero apostado ni beneficio neto empresarial.

## Datos externos utilizables

| ID | Dato | Periodo y base | Fuente | Uso correcto / límite |
| --- | --- | --- | --- | --- |
| N01 | £2.400 millones de GGY de apuestas remotas | Abril 2025–marzo 2026, Gran Bretaña; operadores del ámbito del informe | [S56](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/industry-statistics-annual-report-financial-year-april-2025-to-march-2026-official-statistics), publicado 17-09-2026 | Contexto del segmento elegido; no todo gambling ni toda Europa |
| N02 | £1.200 millones de GGY de fútbol remoto | Mismo periodo/base; parte de N01 | [S56](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/industry-statistics-annual-report-financial-year-april-2025-to-march-2026-official-statistics) | Apoya el foco temático en fútbol; no demuestra que sea la principal tarea de cada usuario |
| N03 | Prepartido 63%; directo 37% del GGR de apuestas deportivas online | Año 2025; nueve miembros de EGBA, operaciones UE/UK; valores agregados del informe | [S59](https://www.egba.eu/uploads/2026/07/260709-EGBA-Annual-Activity-Report-2026.pdf#page=34), julio 2026 | Justifica estudiar ambas fases; no es porcentaje de apuestas, sesiones o personas |
| N04 | 16% de adultos participó en juego online distinto de solo sorteos de lotería, en las últimas cuatro semanas | GSGB 2025, adultos 18+ de Gran Bretaña; estimación ponderada | [S57](https://www.gamblingcommission.gov.uk/report/gambling-survey-for-great-britain-annual-report-2025-official-statistics/gsgb-annual-report-2025-gambling-participation-and-experience-of-gambling), 16-07-2026 | Contexto amplio de participación online; no porcentaje de usuarios de sportsbook ni de toda Europa |
| N05 | 20.775 adultos encuestados | GSGB 2025; campo enero 2025–enero 2026, cuatro olas; método push-to-web | [S58](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/gambling-survey-for-great-britain-annual-report-2025-official-statistics), 16-07-2026 | Describe la muestra de la fuente externa; no participantes de nuestro research |

No sumar cifras de distintas geografías o métricas. No calcular una cuota exacta de fútbol con valores ya redondeados a miles de millones. Los datos GSGB no se comparan directamente con encuestas antiguas de metodología distinta para inferir tendencias.

Estas cifras no prueban una necesidad del inspector ni su efecto. El contexto cuantitativo debe acompañar evidencia de tareas, no reemplazarla.

## Recuentos propios de preparación

R01: 16 flows especificados, con revisiones documentales sucesivas. R02: 48 escenarios definidos. R03: 23 cotizaciones prepartido de selecciones/subconjuntos y seis precios live en dos snapshots del dataset. R04: 50 ramas con expectativas de saldo conciliadas en la revisión documental v0.5 del 20-10-2026. Estos recuentos sirven para explicar alcance, no como KPI de producto o número de usuarios investigados.

Fuentes internas: [specs](../flows/README.md), [escenarios](../demo/scenario-cases.json) y [comprobaciones](../project/research-checks.json). Registrar versión al reutilizar el recuento: puede cambiar al ampliar o recortar alcance.

## Medidas futuras del concepto

| ID | Medida | Cómo obtenerla | Estado |
| --- | --- | --- | --- |
| M01 | Comprensión de condiciones y periodo | Tareas equivalentes; respuesta correcta y explicación del participante | No medido |
| M02 | Comprensión de dinero | Diferenciar stake, retorno y neto en simple, void y Cash Out | No medido |
| M03 | Distinción provisional/liquidado | Interpretar seguimiento y corrección sin inferir cobro | No medido |
| M04 | Selección correcta y recuperación | Encontrar mercado, corregir conflicto y responder a cambio de cuota | No medido |
| M05 | Recuperación de envío desconocido | Observar reenvíos, búsqueda de estado y ayuda necesaria | No medido |
| M06 | Valor añadido del inspector | Comparar tareas equivalentes con/sin inspector; alternar orden | No medido |
| M07 | Cobertura funcional de demo | Ejecutar escenarios completos en la app por viewport y registrar defectos | No ejecutado |
| M08 | Legibilidad y navegación | Revisión visual, teclado y tareas con contenido largo | Pendiente |

Antes de medir: fijar tarea, respuesta correcta, definición de error crítico, ayuda permitida y versión. Guardar conteos con denominador, por ejemplo «4 de 5 resolvieron la tarea sin ayuda», en lugar de convertir una muestra exploratoria en una mejora general del 80%.

## Registro mínimo de un resultado futuro

Fecha; versión; tarea; muestra; condición de comparación; resultado bruto; incidencias; limitaciones; evidencia. Mantener valores ausentes como «no medido». No completar a posteriori una supuesta línea base ni atribuir causalidad a una preferencia declarada.

## Métricas que no usaremos como éxito del diseño

Más stake, apuestas o frecuencia, pérdidas recuperadas o supuestas probabilidades de ganar. Tampoco se atribuye a la demo un impacto de negocio que no haya ocurrido.

R05: 15 nombres con filtro público inicial, tres con consultas de TMview/RDAP y tres direcciones visuales propuestas. Profundidad desigual: no equivale a 15 marcas verificadas. R06: nueve parejas de contraste calculadas de una paleta candidata; no nueve pantallas auditadas. [Evidencia de branding](../branding/evidence/README.md).

R07: tres exportaciones generadas para SC01: escritorio v1 descartado, escritorio v2 y boleto móvil v1 en borrador. La corrección eliminó oferta inventada por el generador. No son tres flows validados ni sesiones de participantes. [Registro de revisión](../design/visual-review.md).
