# Tesis y público propuesto

22-10-2026 · Propuesta para el case study; no cambia el alcance que Javier y Claude están implementando.

## Tesis recomendada

> ¿Cómo puede un sportsbook conservar la amplitud que espera un aficionado y ayudarle a entender qué está aceptando, qué está ocurriendo y qué ha cobrado?

Ternside explora una respuesta: entradas distintas para descubrir y encontrar, información en capas, y un ticket coherente desde la selección hasta la liquidación. La explicación incluye las promociones; no se limita a describir cuotas.

El público prioritario propuesto es **un adulto que ya apuesta en deporte de manera ocasional y llega por un partido, equipo o competición**, sin necesitar conocer todos los mercados. Es una decisión de diseño que hay que contrastar, no una persona extraída de entrevistas propias. Usuarios habituales también pueden necesitar ayuda ante un mercado, incentivo o regla que no conocen.

No propongo cambiar el concepto. La evidencia refuerza el hilo de comprensión, con una formulación más precisa que «sportsbook para principiantes» o «menos opciones siempre funciona mejor».

## Qué sabemos del tamaño del segmento

No se ha encontrado un reparto europeo comparable entre casuales, veteranos y profesionales. Las fuentes miden frecuencia, actividad de cuentas, motivaciones o riesgo; esos ejes no permiten calcular aquel reparto. Los números utilizables están en [el registro](03-metrics.csv), especialmente M01–M05.

La observación transaccional B01 da un argumento para considerar usos intermitentes, con una limitación decisiva: actividad en una cuenta no equivale a toda la actividad de una persona. B02 aporta grupos poblacionales recientes, pero incluye loterías y otros juegos. No sirve para decir que la mayoría de usuarios de sportsbook sean casuales. [NatCen](https://natcen.ac.uk/sites/default/files/2023-03/Patterns%20of%20Play_Technical%20Report%202_Account%20Data%20Stage%20Report.pdf), [GSGB, grupos de frecuencia](https://www.gamblingcommission.gov.uk/report/gambling-survey-for-great-britain-year-2-topic-report-investigating-the/investigating-the-profiles-of-those-who-gamble-more-frequently-gambling).

## Segmentar sin inventar personas

| Eje | Qué preguntar o medir | Qué evita |
| --- | --- | --- |
| Frecuencia | Días en que apostó en los últimos 30 días y ocasiones del último año | Llamar novato a alguien que vuelve solo en grandes torneos |
| Experiencia | Antigüedad, deportes y tipos de apuesta utilizados | Llamar experto a quien apuesta todas las semanas |
| Comprensión | Explicar retorno/neto, free bet, void y estado provisional con tareas | Inferir competencia por autoconfianza o antigüedad |
| Intención de sesión | Encontrar algo decidido, explorar un evento o seguir un ticket | Diseñar una sola home para tareas diferentes |
| Contexto | Dispositivo, atención disponible, presión temporal | Atribuir todos los errores a falta de conocimiento |
| Protección | Necesidad de límites, pausa y ayuda; sin pedir datos financieros reales | Asumir que poco gasto o baja frecuencia garantizan ausencia de riesgo |

La tipología de UKGC B03 clasifica ocasiones, no personas fijas. Es útil para pensar en contextos; no se usará como una segmentación comercial propia. [Understanding why people gamble](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/understanding-why-people-gamble-and-typologies).

## Tres perfiles de trabajo, todavía hipotéticos

| Perfil | Necesidad propuesta | Respuesta a explorar | Contraindicio que buscar |
| --- | --- | --- | --- |
| Aficionado que vuelve por un evento | Encontrar el partido y recordar cómo funciona su apuesta | Descubrimiento breve, mercados principales y ejemplos opcionales | Necesita navegar ampliamente y encuentra For you demasiado limitado |
| Usuario habitual con una tarea concreta | Llegar al mercado elegido sin interrupciones | Búsqueda, acceso por competición, Popular y explicaciones a demanda | El plegado añade más trabajo que la densidad convencional |
| Usuario con un ticket abierto | Entender condiciones, correcciones e importes | Misma representación del ticket, estados y recibo | El ticket visual distrae o se interpreta como certeza de cobro |

No se asignan nombres ficticios, porcentajes, citas ni presupuestos a estos perfiles. El reclutamiento puede cubrirlos con preguntas de comportamiento; el diagnóstico de riesgo no forma parte de una entrevista de portfolio.

## ¿Existe un hueco de mercado?

**No está demostrado.** La existencia de guías para principiantes, productos que prometen simplicidad y tracking por selección contradice «nadie se ocupa de los casuales». Midnite describe oficialmente una propuesta limpia y móvil; es posicionamiento del operador, no prueba de buen uso. [Midnite App](https://www.midnite.com/blog/midnite-app). El benchmark anterior ya documenta Sky Bet, Winamax y otros precedentes: [benchmark](../../research/02-benchmark.md).

La oportunidad defendible es una **combinación de decisiones**: amplitud accesible, orientación por tarea y explicación coherente de consecuencias. Falta comparar su ejecución con alternativas equivalentes. No sabemos si esa combinación provoca elección de marca o cambio de operador.

## Qué sostiene la necesidad de comprensión

B04 aporta testimonios sobre información disponible pero difícil de utilizar; B05 y B06 examinan problemas concretos de incentivos. B07 y B08 muestran que la comprensión depende de la tarea: no hay base para llamar incapaces a todos los apostadores. [UKGC/BIT](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/exploring-consumer-views-on-informed-choice-in-gambling), [ESRI](https://www.esri.ie/system/files/publications/RB202509_0.pdf), [Torrance et al.](https://link.springer.com/article/10.1007/s10899-026-10491-6), [Newall](https://dspace.stir.ac.uk/bitstream/1893/25099/1/resubmission%20file%20ARaT.pdf), [Andersson y Nilsson](https://research.hhs.se/esploro/outputs/journalArticle/Do-bettors-correctly-perceive-odds-Three/991001480487306056).

Por eso priorizaría tareas verificables: qué ocurre con una condición void; qué dinero devuelve una free bet; qué estado es provisional; qué precio se aceptó. «Se ve más limpio» no sustituye a ninguna de esas comprobaciones.

## Cómo encaja la ampliación de Claude

For you y Popular pueden dar rutas para intenciones distintas. Es una hipótesis de arquitectura, no la aplicación demostrada de Pareto. Más mercados plegados y clasificaciones aportan profundidad, a cambio de exigir buena búsqueda y señales claras de contenido disponible.

Las promociones añaden otra prueba a la tesis: la claridad debe sobrevivir cuando existe una recompensa atractiva. Los límites de condiciones, opt-in y ocultación de ofertas son decisiones concretas; no bastan para afirmar que las promociones no influyen en el gasto. Ver [revisión del handoff](05-promotion-and-handoff-review.md).

## Qué podría refutar la propuesta

1. Los usuarios entienden igual con reglas convencionales bien escritas; Explore outcomes añade fricción sin beneficio.
2. La separación de hubs dificulta encontrar partidos o produce expectativas distintas del catálogo.
3. Las explicaciones aumentan confianza sin aumentar respuestas correctas.
4. La estética y animación impiden leer importes o estados con rapidez.
5. Las promociones siguen interpretándose como dinero gratis o recuperación de pérdidas pese a los términos visibles.

Un buen case study puede mostrar una de estas refutaciones y cómo cambió el diseño. No necesita afirmar que todas las intuiciones iniciales eran correctas.
