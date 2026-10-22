# Handoff de Claude a Astra · BUILD-01

21-10-2026 · Claude (jefe de proyecto por decisión de Javier). Este documento resume lo construido, qué cambia respecto a HANDOFF-01 y qué te pedimos ahora. Lo que no aparece aquí sigue tal y como lo especificaste.

La demo se ejecuta con `npm --prefix app run dev`. La fuente está en `app/` y el repositorio en GitHub es `Javier6165/sportsbook-ternside`.

## 0. Estado a 22-10-2026 · primera versión publicada

- **Netlify:** https://ternside-sportsbook.netlify.app (proyecto `ternside-sportsbook`), **pública**. Está conectada a GitHub: **cada push a `main` de `Javier6165/sportsbook-ternside` publica una versión nueva automáticamente** (build definido en `netlify.toml`: base `app`, `npm ci && npm run build`, publica `dist`). Antes de hacer push, comprueba que `npm --prefix app run build` y `npm --prefix app test` pasan; si rompes el build, la web se queda en la versión anterior.
- **Última ronda (pulido visual):**
  - Camisetas 3D en tiempo real (three.js, `app/src/ui/Kit3D.tsx`) generadas con los colores y el patrón de cada equipo, en los banners y en la cabecera del partido. No necesitan imágenes.
  - Titulares que se revelan letra a letra (`ui/Reveal.tsx`).
  - Banners rotatorios con cortinilla.
  - Campo del directo que se levanta y dibuja sus líneas, con estela del balón y ondas en los momentos clave.
  - Tarjetas con inclinación y foco de luz (`ui/Tilt.tsx`), onda en las cuotas, partículas en favoritos y transiciones entre páginas.
- **Tu siguiente tarea principal son las imágenes de la sección 4.1.** Lo que generes sustituye a las fotos provisionales de Unsplash.

## 1. Qué existe ya

| Área | Estado | Dónde mirarlo |
| --- | --- | --- |
| Home «For you» | Hecho: saludo, partido destacado a ancho completo con foto, Popular Bet Builders, Live now, Coming up for you y «Everything else» plegado por deporte y competición | `#/sports` |
| Deporte / competición | Hecho, con chips de competición y bloques plegables | `#/sports/football?competition=premier-division` |
| Página de partido | Hecho: mercados populares con su regla (i), «More markets» plegado, Bet Builder, Stats en dos capas | `#/event/football-01` |
| Bet Builder | Hecho: tres grupos, sustitución con Undo (C22), precio de la tabla qv1 (nunca multiplicado), una condición pasa a simple | pestaña Bet Builder |
| Explore outcomes | Hecho: seis supuestos (no juega, empate, 2–1 con 1 tiro, 3–1 con 2 tiros, prórroga, abandono), solo lectura | Bet Builder y detalle de apuesta |
| Directo | Hecho: misma identidad con sello «LIVE», match centre con campo o pista animados, momentos, «Win probability» calculada desde las cuotas, «The story so far» | `#/event/football-cc-live`, `#/live` |
| Betslip | Hecho: lista compartida Singles/Accumulator, motivos por los que no hay combinada, cambio de cuota en directo con Accept, revisar → colocando → recibo «Accepted» | botón en la cabecera (escritorio) o barra inferior (móvil) |
| My Bets y detalle | Hecho: abiertas/liquidadas, lecturas en directo provisionales, corrección de estadística, liquidación con void, recibo, Cash Out con confirmación | `#/my-bets`, `#/bets/:id` |
| Caja | Hecho: depósito con margen de límite, retirada con reserva, actividad (ledger) | `#/wallet` |
| Juego seguro | Hecho: límites 24 h / 7 días / mes de Londres con anillos, bajada inmediata y subida con espera de 24 h, pausa, autoexclusión → V13 | `#/safer-gambling`, `#/account-closed` |
| Búsqueda | Hecho: ⌘K con desambiguación (C21) y búsquedas recientes | botón Search |
| Demo controls | Hecho: Fresh start, Bet placed, Live tracking (68′ → 72′ → corrección), Cash Out, Settled con void. Más Reset | botón «Scenes» |
| Full / Mobile | Hecho: mismo árbol y misma sesión, iPhone 390×844, escenas al lado en pantallas anchas | dock de demo |
| Tests | 26 tests de dominio en Vitest (`npm --prefix app test`); escaneo axe (WCAG 2 A/AA) sin incidencias en 8 rutas; recorrido por teclado comprobado | `app/tests/`, `app/scripts/a11y.mjs` |

## 2. Cambios respecto a HANDOFF-01

| Área | HANDOFF-01 | Ahora | Motivo |
| --- | --- | --- | --- |
| Identidad | Matchday editorial, Barlow Condensed, navy como superficie de marca | **Colour of the game**: interfaz neutra y el color sale de las equipaciones. La apuesta es un **pase** (ticket con troquel) que se conserva de principio a fin. El directo **no tiene tema propio**: usa los mismos campos de color y tipografía, y se identifica con un único sello rojo «LIVE» con pulso (se descartó un modo noche con LED por parecer otra marca). Display en Inter Tight; logotipo «Ternside.» con punto cobalto | La primera versión era correcta pero genérica. Javier pidió más personalidad sin parecerse a Likely, su concepto de prediction market |
| Layout escritorio | Rail + mercados + columna de talón | Rail colapsable (cerrado por defecto), contenido centrado, betslip como pase flotante | Más aire y menos densidad |
| Catálogo | 5 eventos; no ampliar | Unos 20 eventos visibles más una cola larga generada (11 competiciones ficticias, solo mercados principales) detrás de «Everything else» | El principio del 20 % necesita que exista un 80 % oculto |
| football-01 | 1X2, O/U 2.5, jugador | Añade Double chance, BTTS, Anytime scorer y Correct score, cada uno con su regla. El Builder sigue limitado a tu tabla de 23 cotizaciones | Realismo; las reglas nuevas están en `app/src/data/quotes.ts` |
| Nombres | «Demo European Cup», «Alex Morgan» | Continental Cup, Premier Division…; titular Sam Ellery | «Demo» rompe el realismo; Alex Morgan es una futbolista real |
| F15 / IA | Fuera | Sigue fuera el chat. Se añade **«Why these odds?»**: resumen breve en lenguaje llano de por qué las cuotas son las que son, rotulado «AI summary of fictional data · not a tip». Es texto redactado, sin LLM | Petición de Javier; explica el precio sin recomendar |
| Estadísticas | — | Dos capas: frases llanas con un gráfico cada una, y «Advanced stats» plegado con el término técnico y una definición de una línea | Las stats de los sportsbooks suelen ser ilegibles para quien no conoce el deporte (tenis sobre todo) |
| Live en la home | Base solo prepartido | Cuatro eventos en directo de fondo con rutas de precio redactadas; football-01 pasa a directo solo con Demo controls | Una home sin directo no parece real |
| Animación | Transiciones CSS, sin librería | Motion | Impacto visual; se respeta reduced-motion |
| Tests | 48 casos + E2E + informe formal | Tests de dominio sobre las funciones reales y revisión visual en navegador (1440 / 1280 / 390) | Prioridad visual; el dinero sigue cuadrando |

### Principios de producto que fijó Javier (para el case study)

1. **Mostrar el 20 % relevante y plegar el resto.** Se personaliza por intereses declarados (Tune your feed) y por popularidad, **nunca por cómo apuesta el usuario**. Lo que se pliega son opciones; reglas, dinero, periodos y juego seguro nunca se ocultan.
2. **Nada depredador.** Sin cuotas «mejoradas», sin combis de varios partidos sin relación, sin contadores de popularidad («16,3 mil») ni empujones a crear apuestas. Solo builders de un mismo partido que cuentan una historia coherente (gana el equipo y su delantero dispara), con tres condiciones como máximo.
3. **Explicar en vez de abrumar:** «Why these odds?», «How this bet works», Explore outcomes y stats en dos capas.
4. **Directo espectacular pero honesto:** todo lo que se ve en directo es observación; nada se paga por el marcador.

## 3. Cobertura de tus casos

**En la interfaz y en escenas (Demo controls → Scenes):**
- Colocación: C01–C03, C05 (2.70 / £27), C07 (escena «Price change at review»: 3.40 → 3.20, sin débito hasta confirmar), C09/C10 (escena «Checking your bet»: mismo ID de operación, saldo confirmado visible, acciones de dinero bloqueadas, rama aceptada o rechazada).
- Directo: C11 (corrección 2 → 1), C28 (estadísticas con retraso: último dato, nunca cero), C42, C43 (al empezar, el borrador prepartido se conserva marcado como cerrado y no se puede colocar).
- Liquidación: C30 (abandono: £18 solo con Over), C33 (reliquidación versionada con historial y un único ajuste), C23 (retirada en tenis → void).
- Dinero y juego seguro: C12/C13 (Cash Out), C15–C17, C19, C29 (autoexclusión con apuesta abierta), C41.
- Otros: C21, C22, C26, C27, C37, C45, C46, C48 (conversión explícita a Bet Builder y aviso de selección repetida).

**Además, en tests (26 casos, Vitest):** C04, C06, C09, C10, C14, C30, C32, C38–C40, C43, C44.

**Pendiente o parcial:** C20 (sesión caducada), C24 como escena, C31, C34–C36 como escenas (la lógica de reducer las soporta) y C47 (editar un builder ya en el betslip).

## 3b. Banners rotatorios

Petición de Javier: banner grande a ancho completo y rotatorio en la home y en las cabeceras de deporte y de Live. Para no romper el principio de no ser depredadores, **los banners no son promociones**: alternan partidos destacados (con su cuota principal) y banners de funciones (Explore outcomes, límites, Tune your feed), cada uno con una pequeña animación del producto funcionando. Para el case study es un buen contraste con los carruseles de boosts de la competencia.

Imágenes provisionales: Unsplash por deporte (`IMAGES` / `imageFor()` en `catalog.ts`). En la fase de pulido se estudiarán animaciones de entrada más elaboradas para banners y directo.

## 4. Lo que te pedimos

### 4.1 Imágenes · prioridad alta

Ahora hay fotos provisionales de Unsplash enlazadas en directo (`IMAGES` e `imageFor()` en `app/src/data/catalog.ts`). Javier dice que esto se te da muy bien: genera las imágenes y **déjalas en `app/public/images/`** con los nombres de la tabla. Avísame en tu nota de vuelta y yo las conecto (o cámbialo tú en `catalog.ts`, sustituyendo la URL de Unsplash por `./images/<nombre>`).

**Reglas para todas:**
- Nada real: ni escudos, ni patrocinadores, ni camisetas, ni caras reconocibles, ni estadios identificables.
- Ambiente de noche y luz de focos, con buena profundidad.
- Formato WebP o JPG, calidad alta, como máximo unos 500 KB cada una.
- La interfaz las desenfoca ligeramente (`blur 3px`) y les pone encima los colores de los dos equipos, de lado a lado. Por eso deben funcionar oscuras y poco detalladas en el tercio izquierdo, donde van los titulares enormes, y con la acción o los focos en el tercio derecho, donde flotan las camisetas 3D.

| Archivo | Dónde se ve | Especificación |
| --- | --- | --- |
| `hero-football-01.webp` | Banner del partido destacado (Northbridge FC v Southport Athletic) y su cabecera | 2400×1100. Estadio grande de noche, gradas llenas desenfocadas, focos encendidos arriba a la derecha, césped visible abajo. Sin jugadores en primer plano |
| `hero-football-live.webp` | Banners de partidos de fútbol en directo | 2400×1100. Misma estética pero «en juego»: tensión, bengalas de humo de color neutro, focos intensos, jugadores pequeños y desenfocados al fondo |
| `hero-football-generic.webp` | Resto de partidos de fútbol | 2400×1100. Campo vacío con las luces encendidas antes del partido, nebulosa ligera |
| `hero-tennis.webp` | Banners y cabeceras de tenis | 2400×1100. Pista dura azul de noche vista en picado o 3/4, focos y grada oscura. Sin jugadores reconocibles |
| `hero-basketball.webp` | Banners y cabeceras de baloncesto | 2400×1100. Pabellón lleno con luces de marcador y canasta desenfocadas, parquet brillante |
| `player-costa.png` | Tarjeta del Bet Builder y estadísticas de Daniel Costa (opcional) | Unos 1200×1500, PNG con fondo transparente. Jugador ficticio de cintura arriba con camiseta de rayas verticales navy (#13204A) y blanco, sin escudo ni números. Pose de celebración contenida |
| `og-share.png` | Vista previa del enlace (Netlify, LinkedIn, case study) | 1200×630. Logotipo «Ternside.» en Inter Tight Extra Bold con el punto en cobalto (#2948FF), sobre un campo con el degradado navy (#13204A) → rojo (#C8102E). A la derecha, un pase de apuesta (ticket con troquel) con «Bet Builder 3.40». Puedes usar una captura de la demo como base |
| `live-loop.mp4` (opcional) | Fondo del match centre en directo | 8–12 s en bucle perfecto, 1920×1080, H.264 de unos 3 MB como máximo. Gradas y focos de noche con movimiento lento de cámara, muy oscuro |

**Para el case study** (no van en la app, pero ayudan mucho): 3–4 mockups de la demo en dispositivos (iPhone y portátil) sobre fondo neutro, a partir de capturas de https://ternside-sportsbook.netlify.app o de la demo en local. Déjalos en `Astra Research/case-study/assets/`.

### 4.2 Research para el case study

Javier quiere justificar a quién va dirigido, qué problema resuelve y qué se ha conseguido. Mantén tu regla: cada cifra con fuente, periodo y límite.

1. **Segmentos de apostador.** Recreativo, habitual o profesional: tamaño, frecuencia, ticket medio y peso del móvil en GB/UE. Qué segmento sufre más la sobrecarga.
2. **El problema del sportsbook medio.**
   - Evidencia sobre densidad de opciones, tipografía pequeña y carga cognitiva.
   - Uso de boosts y acumuladas de cuota alta dirigidas a principiantes. Javier tiene una captura de bet365 con una combinada «aumentada» de cuota 78.17 en su home.
   - Estadísticas incomprensibles para quien no conoce el deporte.
3. **Regulación y diseño responsable.** RTS 14 y guías de la UKGC sobre personalización, ofertas e incentivos. Qué respalda los principios 1 y 2.
4. **Concentración de la actividad.** Qué porcentaje del volumen se concentra en pocos deportes, ligas y mercados. Es la base, o el límite, del principio del 20 %; si no hay fuente, que quede como hipótesis.
5. **Precedentes de explicación de cuotas o probabilidad**, como el «win probability» de bet365 o las narrativas de IA, para posicionar «Why these odds?» sin afirmar que sea una novedad.
6. **Una estructura del case study actualizada** con la evolución: concepto de ticket → identidad genérica → identidad v2 → principios de curación y no depredación.

### 4.3 Test con usuarios: real, no inventado

Javier propuso montar sesiones de test ficticias con mejoras en porcentaje. Como jefe de proyecto lo he desaconsejado: unos números inventados presentados como reales no aguantan una entrevista de igaming y contradicen tu propia regla del dossier. Lo que proponemos es el plan de [TEST-PLAN.md](TEST-PLAN.md), un test ligero y real con 5–8 personas sobre la demo. Te pedimos que prepares:
- el guion de reclutamiento y la pantalla de selección (adultos 18+ que apuesten de forma ocasional, más 1–2 que no apuesten);
- el consentimiento;
- la plantilla de registro.

Si algo no se llega a medir, en el case study va como hipótesis con métrica prevista.


## 5. Material para el case study

Todo lo que sigue es para que lo uses al redactar. Nada de esto está validado con usuarios; donde hay una afirmación de mejora, preséntala como hipótesis hasta que exista el test de [TEST-PLAN.md](TEST-PLAN.md).

### 5.1 Tesis en una frase

> **Ternside: menos, pero más claro.** Un sportsbook que te enseña lo que te importa y te explica lo que apuestas.

Dos mitades: tu research (el ticket legible y continuo, reglas explicadas) y la regla de Javier (curar el 20 % relevante y plegar el resto, sin patrones depredadores).

### 5.2 Problema (a respaldar con tu research de 4.2)

1. **Sobrecarga:** el sportsbook medio enseña miles de partidos y mercados, con tipografía pequeña y densidad máxima. Prioriza velocidad y amplitud sobre comprensión.
2. **Empuje depredador:** combinadas «aumentadas» de cuota altísima en la home (la captura de bet365 con cuota 78.17), boosts, contadores de popularidad y «crea tu apuesta» dirigidos a principiantes.
3. **Reglas opacas:** qué pasa si un jugador no juega, si hay prórroga o si se suspende el partido depende de letra pequeña distinta en cada operador (tu benchmark S02/S09/S37).
4. **Estadísticas para expertos:** pestañas de datos técnicos que un aficionado ocasional no sabe interpretar (el tenis es el ejemplo más claro).
5. **Directo pobre:** o no hay nada, o una mini pantalla con un gráfico feo y muchas cifras.

### 5.3 Principios de diseño (y dónde se ven en la demo)

| Principio | Cómo se materializa | Dónde enseñarlo |
| --- | --- | --- |
| Curar el 20 % | Home «For you» por intereses declarados; «Everything else» plegado por deporte → competición; «Tune your feed» | Home, botón Tune your feed |
| Nunca ocultar lo obligatorio | Reglas a un toque (i) en cada mercado, periodo visible, dinero siempre en pantalla, «Deposit limits» desde home y betslip | Página de partido, betslip |
| No depredador | Banners de partidos y funciones, nunca promociones; solo Bet Builders coherentes de un partido, máximo 3 condiciones; acumuladas de 3 como máximo | Banners, Popular Bet Builders |
| Explicar antes de apostar | «Why these odds?» en lenguaje llano; «Explore outcomes» con 6 supuestos | Hero, pestaña Bet Builder |
| El mismo ticket de principio a fin | El «pase» (cabecera de colores, troquel, stake/retorno) en betslip, recibo, My Bets y detalle | Flujo de apuesta completo |
| Directo espectacular y honesto | Match centre animado; lecturas «provisional»; «Nothing is paid from the live score» | Escena Live tracking |
| Stats en dos capas | Frases llanas con un gráfico cada una; «Advanced stats» plegado con definiciones | Pestaña Stats, directo |
| Dinero exacto | Una única cuenta (ledger), redondeo una vez, nunca doble cobro | Wallet → Activity |

### 5.4 Evolución del proyecto (la historia del case study)

1. **Research (Astra):** idea inicial de IA → precedentes encontrados (AceAI, Sky Bet) → el foco pasa a la representación de la apuesta. 48 casos, reglas RULES-GB-01, marca BRAND-01.
2. **Primer corte (Claude):** correcto pero genérico, muy parecido a cualquier sportsbook. Lección: rigor sin identidad no se recuerda.
3. **Exploración de identidad:** tres direcciones (`app/public/explore/directions.html`): A «Colour of the game», B «Floodlight», C «Kit & stamp». Se elige A.
4. **Principios de Javier:** curación del 20 %, no depredador, explicar las cuotas, stats en dos capas.
5. **Descarte del modo noche para el directo:** se probó un tema oscuro con LED y Javier lo rechazó como «doble branding». El directo pasa a usar la misma identidad y un solo sello «LIVE». Buen ejemplo de coherencia de sistema.
6. **Pulido:** camisetas 3D, entradas animadas y microinteracciones para que la demo transmita producto premium.
7. **Siguiente:** test real con 5–8 personas y segunda iteración.

### 5.5 Recorrido para enseñar la demo (3–4 minutos)

1. Home: «Good evening, Sam.», banners con camisetas 3D entrando, Popular Bet Builders, Live now, Everything else plegado.
2. Partido Northbridge v Southport: «Why these odds?», mercados con su regla, pestaña Bet Builder → «Explore outcomes» → «Costa doesn’t play» (£27, no £34).
3. Añadir el Bet Builder (la cuota «vuela» al betslip), poner £10, revisar, colocar → sello «Accepted».
4. Demo → Scenes → «Live tracking»: match centre, condiciones en directo, avanzar a 72′ y la corrección de la estadística.
5. Scenes → «Settled: Costa didn’t play»: aceptada a 3.40, liquidada a 2.70, £27.
6. Opcional para entrevistas: «Price change at review», «Checking your bet», «Settlement corrected», Cash Out (£8, −£2 neto), límites de depósito y autoexclusión.
7. Selector Full/Mobile: el mismo estado en el iPhone.

### 5.6 Cifras que sí se pueden afirmar (son de la demo, no de impacto)

- 15 flows activos, 48 casos especificados; 26 tests automáticos de dinero y reglas pasando; 11 escenas de demostración.
- Unos 60 partidos en 16 competiciones ficticias, de los que la home enseña unos 10 por defecto (el resto, plegado). Úsalo para ilustrar la curación, no como estadística de mercado.
- Escaneo automático de accesibilidad (axe, WCAG 2 A/AA) sin incidencias en 8 pantallas; navegación por teclado completa. No es una auditoría manual.
- Stack: React 19, TypeScript, Vite, Tailwind 4, Motion, three.js (camisetas 3D en tiempo real), decimal.js para el dinero.

### 5.7 Capturas recomendadas (para que hagas los mockups)

Escritorio 1440 px y móvil 390 px de: home con banner y camisetas; banner «Explore outcomes»; página de partido con «Why these odds?»; Bet Builder con Explore outcomes; betslip con el pase; recibo «Accepted»; match centre en directo; detalle de apuesta en directo; liquidación con void; stats en dos capas; límites de depósito. Para un «antes/después» honesto, compáralas con capturas públicas de la competencia sin manipularlas y con su fuente.
