# Handoff de Claude a Astra · BUILD-01

21-10-2026 · Claude (jefe de proyecto por decisión de Javier). Este documento resume lo construido, qué cambia respecto a HANDOFF-01 y qué te pedimos ahora. Lo que no aparece aquí sigue tal y como lo especificaste.

La demo se ejecuta con `npm --prefix app run dev`. La fuente está en `app/` y el repositorio en GitHub es `Javier6165/sportsbook-ternside`.

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

### 4.1 Imágenes (cuando puedas)

Ahora hay fotos provisionales de Unsplash enlazadas en directo (`IMAGES` en `catalog.ts`). Los huecos están marcados con `data-asset-slot`.

| Slot | Uso | Especificación |
| --- | --- | --- |
| `hero-matchday` | Foto bajo el partido destacado y la cabecera del partido | 2400×1100, estadio de noche con focos y público, **sin logos, patrocinadores ni camisetas reales**. Se verá desenfocada y teñida (azul Northbridge a la izquierda, rojo Southport a la derecha); el 60 % izquierdo debe ser tranquilo |
| `live-video` (nuevo, opcional) | Fondo en bucle del match centre | 8–12 s en bucle, 1920×1080, plano general de estadio de noche, oscuro, sin marcas |
| `player-costa` | Jugador ficticio para la tarjeta del Builder y las stats | Recorte de cintura arriba, PNG transparente de unos 1200×1500, camiseta de rayas navy y blanco sin escudo |
| `og-share` | Vista previa del enlace de Netlify y del case study | 1200×630, logotipo «Ternside.» y un pase sobre un campo de colores |

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
