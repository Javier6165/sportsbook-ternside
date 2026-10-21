# Benchmark de producto

Fecha: 2026-10-20. Comparación cualitativa de patrones para orientar el concepto. No es un ranking de operadores ni una auditoría de todos sus flows.

«Aprovechar» significa que el patrón merece estudiarse; no implica que su usabilidad o su efecto comercial estén probados. Las tensiones son consecuencias de diseño o preguntas pendientes, no fallos medidos con usuarios.

## Referencias europeas

| Referencia | Evidencia y patrón aprovechable | Tensión / qué investigar por flow | Aplicación propuesta |
| --- | --- | --- | --- |
| **bet365** | O: búsqueda visible, deportes, tablas y módulos de jugador en home española. D: builder con precio calculado y reglas específicas [S02](https://help.bet365.com/s/en-gb/sports/bet-builder), [S03](https://www.bet365.es/#/HO/) | O: promociones y catálogo comparten protagonismo. H: podría costar separar descubrimiento de selección deliberada; falta comprobarlo | Conservar densidad de cuotas y acceso rápido. Probar una jerarquía con menos competencia promocional |
| **Sky Bet** | D: BuildABet describe seguimiento de cada selección; Super Sub y Ghost Leg tienen condiciones propias [S35](https://m.skybet.com/lp/buildabet/globals), [S04](https://support.skybet.com/app/answers/detail/ghost-leg-faqs), [S05](https://support.skybet.com/app/answers/detail/super-sub/) | Es el precedente más cercano al ticket propuesto. Falta comparar cómo explica reglas antes y después, además de progreso | Explorar revisión de escenarios y excepciones; no presentar el tracking por selección como invención |
| **Paddy Power** | D: Super Sub identifica mercados elegibles y continúa determinados resultados mediante el sustituto [S06](https://helpcenter.paddypower.com/app/answers/detail/10079-super-sub/) | El cambio de jugador exige conservar la trazabilidad. No se ha inspeccionado su ejecución tras login | Estudiar cómo comunicar una regla que modifica el sujeto de una selección |
| **bwin** | O: estructura de escritorio con catálogo central, navegación lateral y panel derecho de medios y talón [S07](https://www.bwin.es/es/sports), [S08](https://www.bwin.es/es/sports/eventos/psg-bar%C3%A7a-2:7866899) | O: promociones, medios, talón y minijuegos coexisten; el detalle usa categorías de mercados en horizontal. H: puede fragmentar atención | Adoptar relación evento–mercados–ticket; investigar un panel derecho centrado en la tarea actual |
| **Betano** | D: builder en Dinamarca y Bet Mentor en Chequia [S09](https://support.betano.dk/hc/en-us/articles/31320723119005-What-is-Bet-Builder), [S10](https://support.betano.cz/hc/cs/articles/32469741819933-Jak-mohu-pou%C5%BE%C3%ADvat-funkci-Bet-Mentor) | Las funciones cambian por mercado. Proponer combinaciones por retorno deseado puede centrar la experiencia en una cifra de ganancia | Aprender del paso petición–propuesta–revisión. No adoptar el retorno deseado como objetivo de la experiencia |
| **Betfair** | D: actualización de 2026 integra acceso a Exchange y Sportsbook en móvil y mantiene diferencias en escritorio [S12](https://support.betfair.com/app/answers/detail/a_id/10792/) | Una envolvente compartida no elimina diferencias de producto. La documentación refleja transición y no acredita paridad completa | Mantener límites de categoría claros; no añadir back/lay, liquidez o comisión de exchange al concepto |
| **Unibet** | D indexada: Unibet TV reúne streaming, búsqueda, programación y referencias a builder [S11](https://www.unibet.tv/) | Disponibilidad de vídeo y condiciones por país/cuenta; ejecución actual sin verificar | Considerar contexto deportivo junto a mercados, sin depender de vídeo real en la demo |
| **William Hill** | D: guías diferencian acceso al builder por dispositivo y describen mercados de fútbol y carreras [S14](https://news.williamhill.com/betting-guides/bet-builder-tips-guide/) | La mecánica común requiere reglas específicas por deporte | Diseñar un núcleo compartido y definir variaciones; evitar fingir profundidad idéntica en todos los deportes |
| **Winamax** | D del desarrollador: MyMatch permite construir un escenario de partido [S15](https://apps.apple.com/fr/app/winamax-paris-sportifs-poker/id385720307) | La narrativa de escenarios ya existe. La ficha promocional no permite evaluar legibilidad del ticket ni estados | Usar la idea de intención deportiva; no presentar «crear tu escenario» como invención del proyecto |
| **SBK** | D: feed social con apuestas y perfiles [S16](https://help.getsbk.com/hc/en-gb/articles/29396235917725-Introducing-the-SBK-Bet-Feed) | Descubrimiento social añade privacidad, moderación y presión de popularidad; no equivale a mejor probabilidad | Mantener favoritos y personalización simple; dejar comunidad fuera del núcleo |

## Referencias estadounidenses y referencia puntual

| Referencia | Patrón documentado | Aprendizaje transferible | Límite |
| --- | --- | --- | --- |
| FanDuel | AceAI: búsqueda conversacional, datos y preparación de selecciones [S17](https://fanduel.com/about/news/fanduel-launches-aceai-first-generative-ai-sports-betting-chat-experience), [S18](https://www.fanduel.com/about/news/meet-aceai-fanduel-s-ai-powered-sports-betting-assistant) | Responder con elementos revisables y conservar la decisión final en el usuario | No trasladar disponibilidad ni reglas de estados de EE. UU.; su existencia reduce originalidad del chat |
| DraftKings | My Stat Sheet: actividad y controles [S19](https://support.draftkings.com/dk/en-us/my-stat-sheet-overview?id=kb_article_view&sysparm_article=KB0010569) | Mostrar dinero y actividad como información comprensible | Sus definiciones contables concretas deben revisarse antes de reutilizar etiquetas |
| BetMGM UK | Cash Out puede no estar disponible y puede retirarse [S29](https://help.betmgm.co.uk/hc/en-gb/articles/12975709519250-Why-is-the-Cash-Out-option-unavailable) | Diseñar un estado de indisponibilidad con explicación y conservar la apuesta abierta | No interpretar ausencia de Cash Out como apuesta cancelada ni confundirlo con retirar saldo |

## Qué conservar para que parezca un sportsbook

- Navegación por deporte, competición y evento; acceso propio a directo.
- Filas o tablas de cuotas comparables; nombres y periodos de mercado claros.
- Selección a partir de una cuota y revisión en talón.
- Simples, combinadas de eventos distintos y builder dentro de un evento diferenciados.
- Mis apuestas con abiertas y liquidadas; detalle y recibo.
- Saldo, caja y herramientas de juego seguro accesibles.

Esta es una síntesis de patrones para el concepto, no una afirmación de que todos los competidores tengan la misma arquitectura o cobertura.

## Qué evitar al combinar referencias

No mezclar una mecánica de Exchange con un sportsbook de cuota fija; reglas de anulación de un operador con el payout de otro; retornos de promociones con retornos de dinero real; ni navegación de escritorio reducida mecánicamente a una pantalla estrecha.

En la próxima etapa cada flow necesitará su propia comparación con evidencias actuales. Esta tabla no sustituye ese trabajo.

## Contraste posterior que cambia la lectura

La [séptima tanda](12-mobile-and-europe-contrast.md) compara void en Sky Bet, Betano DK y bet365 GB. No comparten una política universal. Betano DK documenta agrupación automática de mercados combinables: es una variante legítima de acceso, cuya claridad habría que comprobar. La entrada explícita elegida para la demo es una propuesta propia, sin superioridad probada.

Las galerías Sky Bet/Winamax y los recortes de ayuda se registran como imágenes publicadas, con dispositivo/versión no demostrados cuando corresponde. No añaden recorridos móviles o autenticados al benchmark.
