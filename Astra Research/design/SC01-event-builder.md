# SC01 — Evento prepartido y builder compacto

> Estado posterior: D38 elimina las referencias visuales obligatorias. [START-HERE](../handoff/START-HERE.md) y [BRAND-01](../branding/brand-guide.md) fijan el encargo vigente. Este documento conserva investigación/exploración anterior y no obliga a replicar pantallas ni reabrir opciones ya cerradas.

20-10-2026 · Composición inicial; no referencia final de handoff. Superficies V04/V05, F03/F04/F06. RULES-GB-01 revisión 0.4. Marca de trabajo Ternside/A, aún provisional.

## Pregunta de diseño

¿Se reconocen partido, mercados y ticket de una apuesta independiente sin que la explicación opcional desplace el núcleo del sportsbook? El inspector empieza cerrado. La explicación completa y el recibo posterior se componen en otras escenas.

## Estado canónico compartido entre viewports

Fixture football-01, programado, reloj de partido 20-10-2026 18:00 UTC. Inicio 19:00 UTC / 20:00 BST. Cuenta verificada con £100.00 ficticios. Ninguna operación enviada, saldo intacto.

| Dato | Contenido |
| --- | --- |
| Competición | Demo European Cup |
| Evento | Northbridge FC vs Southport Athletic |
| Resultado, 90 min + añadido | Northbridge FC 2.10; Draw 3.40; Southport Athletic 3.60 |
| Total, 90 min + añadido | Over 2.5 goals 1.80; Under 2.5 goals 2.00 |
| Jugador | Daniel Costa — 2+ shots on target 1.90 |
| Builder seleccionado | Northbridge FC + Over 2.5 goals + Daniel Costa 2+ shots on target |
| Precio conjunto qv1 | 3.40, nunca producto de los individuales |
| Stake en borrador | £10.00 |
| Potential return — includes stake | £34.00 |
| Potential profit, secundario | £24.00 |
| Participación | Player must take part. No appearance: selection void; remaining conditions continue at revised odds. |

Un grupo de builder; contador Betslip (1), tipo Bet Builder y 3 selections. Singles es el modo de envío separado; Accumulator no acepta ese grupo en la base. No se representa un builder como tres apuestas enviadas.

## Composición de escritorio de trabajo

Objetivo de layout 1440×900, después comprobar 1280×800. Cabecera compacta con Ternside, Search, Demo money/£100.00 y cuenta. Navegación a Sports, Live, My Bets y Account; deportes Football/Tennis/Basketball. Catálogo/evento central y un único talón a la derecha. Sin cuarto panel, hero promocional o foto que sustituya mercados.

Cabecera de evento: competición, participantes, fecha/hora y favorito. Categorías All/Goals/Players/Builder con Builder activo y mercados elegibles. Mostrar resultado y totales con opciones comparables; una fila para jugador. Selección azul; sin verde de ganado. Solo los mercados disponibles, no recuentos ficticios de miles de opciones.

Talón: Singles activo, Accumulator secundario; tarjeta Bet Builder con un evento y tres condiciones, quitar/editar con texto o icono reconocible. Precio conjunto, periodo, participación, importe, retorno y CTA «Review bet · £10.00». La revisión monetaria/envío es la siguiente superficie, no una apuesta enviada en esta escena. «How this bet works» abre el inspector dentro del mismo espacio.

## Adaptación móvil de trabajo

Objetivos 390×844 y ancho 320. Vista de exploración con entrada Betslip (1) y navegación principal. Abrir talón usa tarea a altura completa con Close/back y sin navegación global inferior. No intentar mostrar en el mismo viewport estrecho tres mercados, todo el ticket y un inspector abierto. Para comparar contenido se conservarán dos encuadres: evento y talón abierto. Mismos precios/selecciones/stake en ambos; no recortar condiciones para que parezca más limpio.

## Revisión que falta

Verificar lectura de nombres largos, distinción entre cuota individual y conjunta, visibilidad de periodo/participación, retorno bruto/neto y CTA de revisión. Registrar dimensiones reales del bitmap aparte de los objetivos de layout. No declarar responsive, teclado, accesibilidad o persistencia probados con imágenes.
