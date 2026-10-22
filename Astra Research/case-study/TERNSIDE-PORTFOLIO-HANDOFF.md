# Ternside — contenido e instrucciones para el portfolio

22-10-2026 · Documento para pegar completo en el chat que desarrolla `javierortizalmagro.com`. Incluye encargo, estructura, copy en inglés, cifras utilizables y criterios de revisión. No contiene imágenes ni exige producirlas para empezar.

---

## 1. Encargo para Astra, en el chat del portfolio

Incorpora **Ternside como primer proyecto de Selected work** y crea su case study en una ruta equivalente a `/work/ternside`. Prepara una pieza editorial de product design senior: una pregunta concreta, evidencia que afecta a decisiones, alternativas, concesiones, comportamiento del producto y evaluación honesta.

Trabaja en el repositorio del portfolio siguiendo sus instrucciones y el sistema existente. Este documento no encarga cambios en la app de Ternside. No hagas commits, pushes ni deploys del repositorio del sportsbook: está conectado a Netlify y sus despliegues son limitados. La publicación del portfolio sigue las instrucciones vigentes de su propio chat.

El texto público va en **inglés**, como la web actual. Las instrucciones de este documento van en español. La sección 7 contiene el borrador público; el resto es briefing y no se publica como contenido de la página.

No necesitas acceder al dossier para empezar: aquí están el hilo narrativo y las fuentes esenciales. Si tienes acceso a los archivos locales, úsalos para comprobar detalles. La demo sigue evolucionando; comprueba el estado publicado antes de presentarlo como disponible.

### Qué debe entender un recruiter al escanearlo

- Qué problema de sportsbook elegí investigar y por qué merece atención.
- Qué decisiones tomé y qué alternativas descarté.
- Cómo se conserva la coherencia entre condiciones, precio, seguimiento y dinero.
- Qué cambió al revisar la propuesta, incluida la simplificación excesiva.
- Qué demuestra la demo y qué falta medir con usuarios reales.
- Qué parte dirigí y cómo utilicé herramientas de IA.

La libertad de un concepto permite diseñar y probar estados difíciles, explorar alternativas y corregir la propuesta. No convierte en reales un cliente, un lanzamiento comercial, entrevistas, resultados o métricas que no existieron. Si falta una capacidad importante para el relato, registrarla como propuesta para la demo; no escribir que existe hasta comprobarla.

## 2. Contexto del portfolio observado

Se han leído la home, Casino Customizer y LogicX publicados el 22-10-2026:

- La home se posiciona alrededor de hacer comprensibles productos complejos, con experiencia B2B y prototipado asistido por IA.
- Selected work contiene Casino Customizer, LogicX y Backoffice Design System. Likely está en Lab.
- Casino Customizer ya plantea un problema concreto e incluye tiempos del workflow recordados por Javier, diferenciando fases. No afirmar que los casos actuales carecen de cualquier cifra ni convertir esos tiempos en una mejora porcentual comparable.
- LogicX muestra profundidad de sistema, configuración y simulación; sus mejoras se describen como observadas, sin uplift medido.

Ternside debe **complementar** esa experiencia comercial con criterio específico de sportsbook y una investigación trazable. No borrar ni degradar el resto del portfolio. Evitar repetir literalmente los titulares de LogicX sobre «making complex things easier».

Referencias observadas: [home](https://javierortizalmagro.com/), [Casino Customizer](https://javierortizalmagro.com/work/casino-customizer), [LogicX](https://javierortizalmagro.com/work/logicx). La lectura se realizó en navegador; el extractor web no pudo abrir el dominio. No se hizo una auditoría completa del portfolio.

## 3. Posicionamiento y jerarquía

**Nombre:** Ternside.

**Tesis editorial:** A sportsbook built around the life of a bet.

**Pregunta de diseño:** How might a sportsbook keep a bet understandable before it is placed, while the match unfolds and when it settles?

**Público de trabajo:** adultos que ya apuestan en deporte, con prioridad en usos ocasionales y familiaridad variable con mercados. Es una elección del concepto, no una persona validada mediante entrevistas propias.

**Marco:** sportsbook de cuota fija, desktop y móvil, contenido y dinero ficticios, reglas orientadas a GB. No es un exchange ni un producto real licenciado. El foco europeo no se traduce en afirmar conformidad con una regulación europea única.

### Entrada en Selected work

| Campo | Texto |
| --- | --- |
| Project name | Ternside |
| Eyebrow | Independent sportsbook concept |
| Headline | A sportsbook built around the life of a bet. |
| Description | Exploring how discovery, rules and a continuous ticket can keep a complex bet understandable as its state changes. |
| Primary action | Read case study |
| Route | `/work/ternside`, adaptada al router existente |

Orden propuesto: Ternside → Casino Customizer → LogicX → Backoffice Design System. Actualizar contadores y enlaces anterior/siguiente si actualmente están fijados a tres proyectos. Ternside abre como `01 / 04`; comprobar que no se duplican registros ni se rompe la navegación desde los otros casos. No mover Likely de Lab.

### Dos niveles de lectura

1. **Escaneo:** tesis, naturaleza del proyecto, contribución, problema y resultado visible. La duración deseada es una intención editorial, no una estadística sobre recruiters.
2. **Lectura completa:** problema → evidencia → decisiones → iteración → resultado y evaluación. Objetivo aproximado de copy principal: 1.200–1.600 palabras, ajustable para evitar repetición. Profundidad adicional en referencias o notas desplegables.

El lector debe poder llegar al prototipo sin recorrer toda la research. La página debe seguir teniendo sentido cuando se añadan imágenes después.

## 4. Qué debe aportar como caso senior

| Señal | Evidencia concreta que contar |
| --- | --- |
| Definición del problema | Una apuesta parece estable al aceptarla, pero cambian datos, condiciones válidas, precio de liquidación e interpretación del dinero |
| Investigación que cambia dirección | Se descarta el chat como diferenciador suficiente al encontrar precedentes; se prioriza la comprensión del ticket |
| Priorización | Profundidad en un recorrido y sus excepciones, en lugar de intentar inventar todos los deportes y mercados |
| Concesiones | For you + Popular, mercados en capas, promociones presentes con restricciones y explicaciones |
| Diseño de sistemas | Condiciones, cotización aceptada y recibo coherentes; provisional, oficial y promocional separados |
| Iteración | La simplificación global hacía parecer vacío el producto; se recupera amplitud mediante jerarquía |
| Honestidad del contenido | Why these odds? cambia a Match context: no se atribuyen causas al precio sin un modelo que las respalde |
| Craft con función | Equipaciones para contexto deportivo, continuidad visual del pase y coherencia entre móvil/escritorio |
| Evaluación | Tareas con respuesta correcta, evidencia técnica fechada y resultados de usuario solo cuando existan |

La historia debe enseñar al menos tres decisiones con **problema → opción elegida → alternativa → coste → comprobación pendiente**. No basta con una galería de funcionalidades.

Como referencia editorial, Intercom describe interés por definición de problema, estrategia, comprensión de sistemas, colaboración y resultados. Es el criterio publicado de una empresa, no una rúbrica universal: [What we look for when we hire designers](https://www.intercom.com/blog/hiring-designers-at-intercom). La elección aquí es mostrar esas capacidades con el trabajo que realmente existe.

## 5. Cifras: qué publicar y cómo

No montar un bloque de «Impact» con cifras externas o número de tests. Separar visualmente estos tres tipos de número:

### A. Evidencia externa del problema

Usar dos hallazgos como máximo en el cuerpo principal, con sus fuentes cerca. Son resultados ajenos y deben titularse **External research**, nunca Our results.

**Oferta mal interpretada.** Torrance y colaboradores, 2026: experimento online con 585 apostadores de UK en total. En el control, la mediana estimada del requisito era £500 frente a £750 correctos. El grupo control no tiene 585 participantes; 585 es la muestra total. La comprensión solo se midió en control. No convertir la diferencia en un porcentaje de mejora ni afirmar que el ejemplo aumentó la comprensión entre grupos. [Artículo original](https://link.springer.com/article/10.1007/s10899-026-10491-6).

**Incentivos y decisión.** ESRI, 2025: experimento con 622 hombres menores de 40 interesados en Euro 2024. Los incentivos triplicaron la probabilidad de elegir apuestas desfavorables en la tarea. Las recompensas se convertían en participaciones para un vale; no eran apuestas ordinarias con dinero propio. No transferir el efecto a usuarios de Ternside. [Boletín de los autores](https://www.esri.ie/system/files/publications/RB202509_0.pdf).

El texto público de la sección 7 ya incluye las versiones resumidas. Evitar duplicarlas en hero, tarjetas y conclusiones.

### B. Números que explican el diseño

Son ejemplos sintéticos, no métricas de usabilidad:

| Caso | Importe correcto | Condición que debe acompañarlo |
| --- | --- | --- |
| £10 a cuota 3.40 | £34 de retorno total; £24 de beneficio neto | Las tres condiciones ganan |
| Jugador no participa; otras dos ganan | Cuota de subconjunto archivada 2.70; £27 de retorno, £17 de beneficio | Regla definida para este concepto; antes de la resolución es retorno condicional |
| Cambio de precio antes de aceptar | 3.40 → 3.20; £32 si gana el ticket aceptado a 3.20 | Aceptación explícita; no seguir explicando £34 después |
| Cash Out inferior al stake | £8 recibidos por £10 apostados; −£2 netos | Es una escena distinta, no el mismo ticket de la escena void |
| Free bet de £5 a 3.40, stake no devuelto | £12 de retorno si gana | Crédito promocional, no £5 retirables; confirmar términos finales |

No presentar al jugador con tiros en directo y luego liquidar ese mismo recorrido como si no hubiera participado. Las escenas de demo son alternativas; señalarlas como tales.

### C. Alcance y evaluación propios

- La especificación inicial contiene **48 escenarios de aceptación**. Se puede mencionar como alcance documental fechado, no como 48 escenarios probados ni 48 hallazgos de usuario.
- Los recuentos de tests y escenas están cambiando. El handoff mezcla cortes de 67 y 87 tests. No publicar ninguno como cifra vigente sin informe/versionado actual.
- Un chequeo automático axe sin incidencias en unas rutas no demuestra conformidad completa de accesibilidad.
- No se ha medido uplift de comprensión, conversión, ingresos, retención, reducción de daño o satisfacción en Ternside.

Si no hay informe técnico actual accesible al chat del portfolio, publicar la descripción cualitativa de lo que se ha construido y el plan de evaluación. No bloquear la composición ni llenar espacios con números provisionales.

## 6. Montaje editorial y dirección de arte

Aplicar el sistema del portfolio y su skill `javier-art-direction` si está disponible. El sistema de Ternside vive dentro de sus capturas; la página del case study conserva la identidad de Javier.

- Tipografía existente, paleta off-white/near-black y modos claro/oscuro actuales.
- Cinco roles tipográficos y cinco espaciados del sistema. No añadir una escala propia para Ternside.
- Composición editorial con un protagonista por pantalla. Texto en columnas legibles, imágenes posteriores como planos rectangulares con escala suficiente.
- El color de las equipaciones, el cobalto y los degradados pertenecen al producto. No extenderlos al fondo, navegación, botones o contenedores de todo el portfolio.
- No usar tarjetas, pills, sombras, gradientes ni dashboards de métricas como composición por defecto de la página.
- Variar la relación texto/evidencia: apertura breve, comparación numérica, decisiones, revisión y evaluación. Evitar repetir título + párrafo + tres tarjetas en todas las secciones.
- Navegación por capítulos consistente con los casos existentes. Un solo H1 y jerarquía real de títulos; no imitar jerarquía solo con tamaños.
- Usar links de fuente legibles junto al dato o notas accesibles. Nunca información esencial disponible solo al hacer hover.
- Evitar animar números o párrafos de lectura. El contenido debe estar disponible con movimiento reducido y sin ejecutar secuencias decorativas.

### Esta entrega no lleva imágenes

Construir la estructura y el texto con zonas de medios opcionales. Durante esta fase no generar pantallas, ni importar los fondos deportivos como si fueran capturas del producto. No mostrar imágenes rotas, marcos de dispositivos vacíos, bloques de «coming soon» o áreas enormes reservadas en la versión pública.

La página puede funcionar de forma editorial sin esos medios; los IDs del apartado 8 sirven para añadir evidencia real después. No cambiar la arquitectura del caso cuando lleguen las capturas.

### Enlace al prototipo

Destino conocido: [Ternside prototype](https://ternside-sportsbook.netlify.app/#/sports). Abrir como enlace, con nombre claro. No incrustarlo automáticamente en un iframe ni cargar la app completa dentro del portfolio.

Hay cambios locales más recientes que la versión pública. Si una función central del texto aún no está publicada, conservarla en el borrador y ajustar el copy visible hasta que el enlace la muestre. No forzar un deploy del sportsbook para cerrar el caso del portfolio.

---

## 7. Copy público propuesto — English

**Solo esta sección es contenido público**, además de los campos de Selected work de la sección 3. Los rótulos de campo sirven para montaje; no se publican literalmente como instrucciones. Se puede editar ritmo y longitud conservando hechos, límites y ejemplos.

### Hero

**Eyebrow:** Independent concept · Sportsbook · 2026

**H1:** Ternside

**Deck:** A sportsbook built around the life of a bet.

**Intro:**

Ternside explores how a sportsbook can keep a bet understandable before it is placed, while the match unfolds and when it settles. I directed the concept, its product priorities and design review, using AI-assisted research and implementation to turn the idea into an interactive prototype.

**Primary CTA:** Explore the prototype

**Secondary CTA:** Read the case

**Project facts:**

- Role: Independent product design and direction
- Focus: Discovery, bet comprehension and state continuity
- Format: Responsive interactive prototype
- Context: Fictional account, events and money; GB-oriented rules

**At a glance — three concise statements:**

**The problem:** The odds alone do not explain what happens when a condition changes, a statistic is corrected or a bet settles differently from the original expectation.

**My approach:** Keep familiar sportsbook conventions, organise the depth and make the ticket carry its conditions and money through the journey.

**The result:** A working concept with explorable scenarios, a documented rule set and a clear plan for evaluating comprehension with users.

### 01 — What happens to the bet when the match changes?

Consider a £10 Bet Builder combining three conditions: Northbridge to win, over 2.5 goals and Daniel Costa to record at least two shots on target. At odds of 3.40, the potential return is £34.

Now Costa does not play. Under the rule defined for this concept, that condition becomes void. The remaining two conditions still have to win. If they do, their archived combined price of 2.70 produces a £27 return.

The interface needs to explain which condition changed, which price applies and why the return is different. It also needs to distinguish a promising live statistic from an official result.

I used these moments to define the design problem: how to keep the meaning of a bet visible as its state changes.

**Scenario annotation:** Fictional example using Ternside’s defined rules. Void policies differ between operators and markets.

### 02 — Research made the problem more specific

I began with public sportsbook interfaces, operator documentation and market rules, then extended the research with studies on comprehension and incentives. The benchmark covered European operators including bet365, Sky Bet, Betano, Betfair and Winamax, with US references used for selected patterns.

This combined public observation and documentation; it was not a set of authenticated betting sessions or a representative user study. Later research helped question and refine decisions already present in the first prototype.

Three findings shaped the direction.

**Information has to be usable at the moment of decision.** UKGC research with the Behavioural Insights Team describes a gap between information being available and people being able to find, understand and act on it. This supported contextual explanations across the journey. [UKGC, 2026](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/exploring-consumer-views-on-informed-choice-in-gambling).

**Promotional terms can be misunderstood.** In a UK experiment involving 585 bettors, the control group’s median estimate of a wagering requirement was £500 when the correct answer was £750. This was an external study of a hypothetical offer, not a Ternside result. [Torrance et al., 2026](https://link.springer.com/article/10.1007/s10899-026-10491-6).

**An incentive can change the decision.** In an ESRI experiment with 622 men under 40 interested in Euro 2024, incentives tripled the likelihood of choosing poor-value bets in the task. Rewards were linked to a voucher raffle. I treated this as a reason to examine promotional clarity and exposure, without assuming the same effect in this concept. [ESRI, 2025](https://www.esri.ie/system/files/publications/RB202509_0.pdf).

I prioritised adults who already bet occasionally, while recognising that frequency and expertise are different. The research did not establish a reliable European split between casual and professional bettors.

### 03 — Choosing the focus

An AI betting chat was an early direction. Existing products already offered conversational discovery and selection tracking, so those features alone were a weak basis for differentiation.

I focused on the relationship between conditions, state and money: what the user accepts, what remains provisional and what is finally paid. The concept keeps recognisable markets and a betslip, while adding optional ways to inspect consequences.

This narrowed the central question enough to prototype in depth. Explore outcomes became a way to ask what happens under an alternative scenario, without changing the actual event or placing another bet.

### 04 — Keep the depth. Give it a hierarchy.

The first simplified direction exposed a weakness in our own review: applied across the whole product, curation made the sportsbook feel empty. I wanted a focused starting point and a credible breadth of sport.

The revised structure separates two intentions. For you prioritises declared interests; Popular provides a broader view of competitions, events and markets. Additional depth remains accessible through sport, competition, grouped markets and search.

The cost is another navigation choice and a risk that folded content becomes harder to find. That needs task-based evaluation. The “20% relevant” idea remained a prioritisation heuristic, rather than a claim derived from user analytics.

### 05 — Let the ticket carry the explanation

The same visual pass connects the betslip, acceptance receipt, My Bets and settlement detail. Its purpose is to keep conditions and financial information recognisable as the surrounding view changes.

For the reference £10 bet, the explanation keeps three figures distinct: the accepted odds of 3.40, the archived remaining price of 2.70 after the player condition is void, and the £27 return if the remaining conditions win. The original price remains part of the record.

Live tracking follows the same logic. A condition can be progressing without being settled, and a statistic can be corrected. Progress, official resolution and payment need separate states.

A price change before acceptance is another case: accepting 3.20 changes the potential return to £32. The later explanation must use that accepted price. These are alternative prototype scenarios, rather than one continuous match history.

### 06 — Review changed the language and the scope

One early explanation was called Why these odds? Its wording suggested that the interface could explain the causes of the bookmaker’s price. The prototype had fictional data and no pricing model to support that claim.

It became Match context: descriptive match information, with a separate explanation of what the displayed odds imply. A normalised view of odds is not a prediction of the true outcome.

Commercial realism also changed the scope. Promotions became part of the concept, with explicit eligibility, opt-in and reward states. A free bet is different from withdrawable cash; the ticket needs to explain what is returned and what is not.

For example, a £5 free bet at 3.40 returns £12 if it wins when the promotional stake is not returned. Clear terms and low caps do not establish that an offer has no behavioural effect. That remains a limitation to evaluate.

### 07 — A recognisable sport, a consistent product

The visual direction takes its colour from fictional team kits, while the surrounding interface remains restrained. The ticket is a recurring object across the journey. Desktop and mobile share the same session, so changing the presentation does not require starting again.

In review, I rejected a separate night-time identity for live betting because it made the experience feel like another brand. Live uses the same system, with a clear status marker and changes in match information.

Motion supports the prototype’s presentation, with reduced-motion behaviour included in the design requirements. Readability, focus and state clarity still need to hold when the animation is removed.

### 08 — What the prototype establishes, and what I would measure next

The result is an interactive model of a sportsbook journey and its exceptions. The initial specification defined 48 acceptance scenarios, covering cases such as price changes, player non-participation, statistical correction and settlement. That is scope documentation, not a usability score.

My role was to set product direction, question the output and connect decisions across the experience. AI supported desk research, synthesis and critique; Claude Code supported implementation. There was no client engagement or production engineering team behind this independent concept.

The prototype makes those decisions inspectable. It does not establish a measured improvement in comprehension, customer behaviour or commercial performance.

The next evaluation focuses on four questions:

- Can someone explain what remains valid when a condition is void, and calculate the conditional return?
- Can they distinguish live progress from an official settlement?
- Can they interpret the money in a Cash Out or a free bet?
- Can they find a less prominent market and reach deposit limits without unnecessary searching?

I would record correct answers, errors, assistance and confidence by task. A useful finding could be that a conventional explanation works just as well, or that the additional layer adds friction. Either result would give the next iteration a clearer direction.

**Closing statement:** The strongest part of this concept is the connection between the rules, the interface and the questions the prototype makes possible to test.

**Final CTA:** Explore Ternside

**Short prototype note:** Independent portfolio concept. All account data, events and funds are fictional.

---

## 8. Evidencias visuales para añadir después — no producir ahora

Reservar estas relaciones en el modelo de contenido. No son huecos visibles obligatorios ni requisitos para inventar imágenes.

| ID | Evidencia posterior | Qué debe demostrar | Texto de pie propuesto |
| --- | --- | --- | --- |
| T01 | Home desktop y móvil reales del mismo build | Sportsbook reconocible y jerarquía responsive | The same product priorities, composed for desktop and mobile. |
| T02 | Bet Builder y Explore outcomes | Caso de no participación con retorno condicional correcto | Costa does not play: the remaining conditions still need to win. |
| T03 | Betslip → accepted → My Bets → settlement | Continuidad de condiciones, precio y dinero | The ticket keeps its identity as its state changes. |
| T04 | Dos versiones reales de la arquitectura, si se conservan | Por qué se añadió Popular | Curation became one route into the catalogue. |
| T05 | Texto anterior y actual, si existe evidencia guardada | Why these odds? → Match context | The wording changed to match what the prototype could support. |
| T06 | Free bet y revisión con importes visibles | Crédito promocional y retorno, sin confundir cash | £5 promotional stake at 3.40: £12 returned if it wins. |
| T07 | Una corrección de estadística y estado provisional | Progreso no equivale a liquidación | Live information can change before the official result. |

Usar capturas o grabaciones de la app, sin recolorear ni inventar controles en un generador. Un montaje de varias escenas debe identificarlas. Si no existe la versión anterior, contar el cambio con texto y evidencia actual; no reconstruir una falsa captura «before».

La imagen `og-share.png` del sportsbook es una pieza de marca, no una captura del producto. Puede servir como recurso de marca si más adelante encaja, pero no como evidencia de interacción o como vista del case study terminado.

## 9. Fuentes y trazabilidad

### Fuentes públicas esenciales

1. [UKGC/BIT — Exploring consumer views on informed choice, 2026](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/exploring-consumer-views-on-informed-choice-in-gambling). Estudio externo cualitativo y revisión documental; no participantes nuestros.
2. [Torrance et al. — Financial gambling inducements, 2026](https://link.springer.com/article/10.1007/s10899-026-10491-6). Límites: oferta hipotética, Prolific, comprensión solo medida en control. Su efecto sobre atractivo declarado no es un uplift de comprensión.
3. [ESRI — Effects of inducements, 2025](https://www.esri.ie/system/files/publications/RB202509_0.pdf). Población seleccionada, incentivo experimental y alcance descritos en sección 5.
4. [Scheibehenne et al. — Choice overload, 2010](https://doi.org/10.1086/651235) y [Chernev et al., 2015](https://myscp.onlinelibrary.wiley.com/doi/abs/10.1016/j.jcps.2014.08.002). La amplitud no tiene un efecto universal independiente de tarea y complejidad; no justifican una regla numérica 80/20.
5. [UKGC — LCCP 5.1.1](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/5-1-1-sr-code). Respalda condiciones claras y límites de incentivos en su ámbito, no una certificación del concepto.
6. [Intercom — Hiring designers](https://www.intercom.com/blog/hiring-designers-at-intercom). Referencia interna para la estructura del relato; no necesita aparecer como bibliografía del sportsbook.

Las fuentes de industria de la página pueden presentarse en un bloque final breve con enlaces cercanos a los datos. No publicar todo el dossier ni añadir referencias como decoración.

### Archivos locales opcionales

Todos pertenecen al workspace del sportsbook. Leerlos no requiere editarlo:

- [Dossier de evidencia](</Users/javierortiz/Documents/Vibecoding/Sportsbook Portfolio/Astra Research/case-study/evidence-2026-10-22/README.md>).
- [Cifras, bases y límites](</Users/javierortiz/Documents/Vibecoding/Sportsbook Portfolio/Astra Research/case-study/evidence-2026-10-22/03-metrics.csv>).
- [Benchmark y límites de observación](</Users/javierortiz/Documents/Vibecoding/Sportsbook Portfolio/Astra Research/research/02-benchmark.md>).
- [Método inicial](</Users/javierortiz/Documents/Vibecoding/Sportsbook Portfolio/Astra Research/research/00-metodo.md>).
- [Escenarios de aceptación especificados](</Users/javierortiz/Documents/Vibecoding/Sportsbook Portfolio/Astra Research/demo/acceptance-matrix.md>).
- [Guion y separación entre escenas](</Users/javierortiz/Documents/Vibecoding/Sportsbook Portfolio/Astra Research/handoff/demo-script.md>).
- [Handoff vivo de Claude](</Users/javierortiz/Documents/Vibecoding/Sportsbook Portfolio/HANDOFF-TO-ASTRA.md>).
- [Revisión documental de promociones](</Users/javierortiz/Documents/Vibecoding/Sportsbook Portfolio/Astra Research/case-study/evidence-2026-10-22/05-promotion-and-handoff-review.md>).

Los títulos de docs antiguos pueden describir estados anteriores al build. Priorizar el handoff vivo para alcance, y el dossier fechado para origen y límites de evidencia. No sumar fuentes duplicadas y venderlas como estudios independientes.

## 10. Criterios para cerrar la primera versión del case study

### Contenido

- La apertura contiene problema, contribución y resultado concreto; «independent concept» se ve sin buscar un pie de página.
- El ejemplo £34 → £27 se entiende sin saber qué es un void; se explica que el resto debe ganar.
- Al menos tres decisiones muestran alternativa y coste. Una revisión propia cambió algo sustancial.
- Hay evidencia cuantitativa externa con muestra, ámbito y fuente; no aparece rotulada como resultado de Ternside.
- El resultado del proyecto se distingue de su impacto todavía no medido.
- El papel de Javier, de la IA y de Claude está explicado con precisión, sin equipo comercial ficticio.
- La investigación posterior no se presenta como causa cronológica de todo lo diseñado antes.
- No aparecen porcentajes inventados de mejora, personas con citas ficticias, SUS no medido, validación «con 8 usuarios» no realizada o resultados de negocio de una demo.
- No quedan marcadores internos, TODOs, instrucciones del briefing o cifras técnicas pendientes en el texto público.

### Integración en la web

- Ternside ocupa la primera posición de Selected work; se conservan los otros tres casos y Lab.
- Ruta, enlaces, numeración y navegación anterior/siguiente funcionan sin registros duplicados.
- CTA del prototipo apunta a la demo, y el texto visible no promete funciones solo presentes en local.
- No hay imágenes rotas o grandes espacios vacíos mientras faltan medios.
- Se respeta el sistema visual y la lectura en móvil y escritorio, claro/oscuro y movimiento reducido.
- Las notas y fuentes tienen acceso por teclado y no interrumpen el relato principal.
- Título SEO sugerido: `Ternside — Sportsbook Product Design Concept | Javier Ortiz`.
- Descripción sugerida: `An independent sportsbook concept exploring discovery, bet comprehension and state continuity through an interactive prototype.`
- No usar `og-share.png` del sportsbook como si mostrase la página editorial; si falta una imagen social específica, aplicar el fallback real existente del portfolio.

Entrega en el chat del portfolio: página implementada conforme a su workflow, resumen del contenido montado y lista breve de medios o verificaciones del build todavía pendientes. Los cambios de producto que sugiera este relato se coordinan con Javier y Claude; este encargo no modifica la app del sportsbook.
