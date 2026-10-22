# Plan de ampliación y mejora · Ternside

22-10-2026 · Claude. **Estado: fases 1–3 construidas y publicadas; la fase 4 depende de Astra.** Detalle de lo hecho en HANDOFF-TO-ASTRA.md, sección 0c. Decisiones de Javier: Popular como pestaña, las 5 promociones y Welcome offer visible.

## Diagnóstico: sí, nos pasamos con la simplicidad

La curación funciona dentro de «For you», pero aplicamos la misma regla a todo el producto y el resultado parece vacío. Un sportsbook real transmite amplitud en cuanto se abre: muchas competiciones, partidos en directo, ofertas y mercados. El principio del 20 % sirve para **ordenar** el contenido, no para **quitarlo**. Lo corregimos así:

- «For you» se queda como está: personal, corto y tranquilo.
- Se añade un hub general, que no depende del usuario, con lo que mueve el mercado.
- Las secciones existentes ganan profundidad, plegada pero presente: tablas, más mercados, historial y cuenta.
- Las promociones existen, con su página propia, y son fáciles de entender.

## Fase 1 · Hub general «Popular» (prioridad alta)

**Estructura.** «Sports» se abre en un selector `For you | Popular`, como las pestañas de inicio de Spotify o Apple Music. Se recuerda la última elección. «Popular» es igual para todo el mundo:

1. Banner rotatorio con 3 grandes partidos del día de distintos deportes.
2. «Top competitions»: fila de 6–8 competiciones con su emblema, con partidos hoy y en directo.
3. «Today’s big matches»: los partidos destacados por deporte, en pestañas Football / Tennis / Basketball, con 1X2 o ganador.
4. «In play now»: marcador compacto de todos los directos, más denso que las tarjetas actuales.
5. Promociones: 2–3 tarjetas (ver fase 2).
6. «Popular markets tonight»: los mercados con más actividad del partido grande (BTTS, Over 2.5, goleador). Es popularidad de mercado, sin contadores de personas.
7. «Starting soon»: próximas 2 horas.
8. «A–Z sports and competitions» al final.

**Catálogo.** Hay que ampliarlo para que no se repitan siempre los mismos 10 partidos: unos 3–4 partidos más por competición principal, outrights («Winner of the Premier Division») y una clasificación por liga.

**Por qué no sustituye a For you:** el valor del producto sigue siendo personal. Popular da contexto de mercado y realismo, que es lo que echas de menos.

## Fase 2 · Promociones (prioridad alta)

Cambio de principio: **las promociones existen**. Lo que no hacemos es usarlas para empujar combinadas largas o volumen. Reglas de diseño:

- **Se entienden en una frase.** Cada tarjeta muestra el titular, 3 condiciones visibles (cuota mínima, recompensa máxima, caducidad) y un «Full terms» plegado.
- **Opt-in explícito**, con estado claro: Not joined → Joined → Progress → Reward ready → Used / Expired.
- **Free bets sin requisito de apuesta (0x)** y solo de deportes. Según fuentes secundarias, desde el 19-01-2026 la UKGC limita los requisitos de apuesta a 10x y prohíbe las promociones que mezclan productos (deportes con casino). **Astra debe verificarlo en el texto del LCCP.**
- **Free bet en el betslip:** interruptor «Use £5 free bet» que deja claro que el stake no se devuelve: retorno = stake × cuota − stake. Se testea con decimal.js como el resto del dinero.
- **Juego seguro manda:** con una pausa o una autoexclusión no se ven ni se pueden activar promociones. Hay preferencia de marketing en Account. Nunca se personalizan por el comportamiento de apuesta.

**Catálogo propuesto (ficticio, realista y no agresivo):**

| Promo | Mecánica | Por qué es aceptable |
| --- | --- | --- |
| **Matchday Predictor** | Predice 4 resultados exactos gratis; si aciertas todos, te llevas £100 en free bets | Gratis, sin stake: el estándar menos dañino del sector |
| **2 Goals Ahead** | En el 1X2 de fútbol, si tu equipo se pone 2 goles por delante, la apuesta se paga como ganada | Mejora la apuesta que ya ibas a hacer; no induce a apostar más |
| **Bet Builder Insurance** | Si en tu Bet Builder de 3 condiciones falla una sola, recuperas el stake como free bet, hasta £5 | Refuerza la apuesta correlacionada del producto, no las combinadas largas |
| **Weekend free bet** | Apuesta £10 prepartido (cuota ≥ 1.50) entre viernes y domingo y recibes una free bet de £5 el lunes | Una sola apuesta cualificante; tope bajo |
| **Welcome offer** | Solo para clientes nuevos: apuesta £10 y recibes £10 en free bets. Se ve en la página de promociones, nunca en la cuenta de Sam | Realismo; mismas reglas de claridad |

**Dónde aparecen:**
- Rail: entrada «Promotions» con un contador de las activas.
- Página `#/promotions` con las pestañas Available, Joined y History.
- Hub Popular y For you: una fila de 2–3 tarjetas debajo del banner, nunca en el banner principal.
- En la página del partido, una etiqueta discreta en el mercado elegible («2 Goals Ahead applies»).
- My Bets: progreso y recompensas.
- Escenas de demo: «Free bet ready» y «2 Goals Ahead paid out».

## Fase 3 · Profundidad donde ahora hay poco (prioridad media)

| Área | Qué falta |
| --- | --- |
| Página de partido | Grupos de mercados plegados (Goals, Players, Corners, Cards, Halves) con 4–6 mercados cada uno; búsqueda de mercados dentro del partido |
| Stats | H2H, clasificación de la liga con los dos equipos marcados, alineaciones probables. Siguen en dos capas |
| Competición | Cabecera con emblema, pestañas Matches / Standings / Outrights |
| Directo | Vista «Scoreboard» compacta en `#/live` además de las tarjetas; tenis y baloncesto con su propio match centre |
| My Bets | Filtros (fecha, tipo, resultado), resumen del mes y estados de promoción |
| Account | Datos personales (ficticios), métodos de pago demo, extractos, marketing, verificación y Reality check |
| Búsqueda | Resultados agrupados (equipos, partidos, competiciones, jugadores) y populares al abrir |

## Fase 4 · Pulido visual pendiente (prioridad media, depende de Astra)

- **Camisetas 3D con textura real** (petición en HANDOFF 4.1). Hasta que lleguen, sin efecto hover. Después se revisa el movimiento.
- **Emblemas de competición:** ahora hay 5 dibujados en línea y color (`ui/CompetitionMark.tsx`). Astra puede proponer el sistema definitivo para las 16.
- **Degradados:** ya hay una regla única (tinta → azul marino para superficies de marca; colores de equipo oscurecidos para que no choquen). Hay que revisarlos con Astra en las pantallas nuevas.

## Orden propuesto y decisiones que necesito de ti

1. Fase 2 (promociones) y fase 1 (Popular) juntas, porque Popular necesita las tarjetas de promo.
2. Fase 3 en este orden: página de partido, competición, My Bets, Account, Directo, Búsqueda.
3. Fase 4 cuando Astra entregue las texturas.

**Decisiones:**
- ¿Selector `For you | Popular` dentro de Sports (mi recomendación) o «Popular» como sección aparte en el rail?
- ¿Te vale el catálogo de 5 promociones? ¿Quitamos o añadimos alguna?
- ¿Enseñamos la Welcome offer, aunque Sam no pueda usarla, para el realismo del case study?
