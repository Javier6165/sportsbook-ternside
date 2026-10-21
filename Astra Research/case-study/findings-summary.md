# Resumen vivo de hallazgos relevantes

20-10-2026 · Versión 0.4. Síntesis para dirección de producto y futuro case study. No equivale a validación con usuarios.

| Hallazgo | Evidencia | Implicación adoptada | Pendiente |
| --- | --- | --- | --- |
| El chat y el tracking ya tienen precedentes | Documentación de AceAI y Sky Bet; S18/S35/S37 | La diferenciación se centra en continuidad de condiciones y explicación de escenarios | Comprobar si el inspector aporta comprensión frente a ayuda convencional |
| Participar y salir de titular son condiciones distintas | Reglas por mercado; S38/S48 | Fijar regla concreta de participación y reutilizarla en todo el ticket | Revisar explicación con tareas de no participación |
| Un builder necesita una cotización conjunta | Documentación de construcción y relaciones; S02/S37 | Precios conjuntos y de subconjuntos archivados; no multiplicación automática | Probar cómo explicar el precio reducido tras void |
| Datos, disponibilidad y liquidación son estados distintos | Reglas de directo/estadísticas; S38/S51/S52 | Separar feed, mercado, condición provisional y resultado oficial | Detectar si el usuario interpreta un contador como seguridad de cobro |
| El dinero exige varias magnitudes visibles | Requisitos de cuenta/transacciones y escenarios propios; S20/S50 | Diferenciar stake, retorno, neto, disponible y reserva | Medir comprensión de Cash Out inferior al stake |
| Pausa y exclusión requieren consecuencias diferentes | Time-out, autoexclusión y pagos posteriores; S40/S43/S64 | Cierre inmediato, devolución inicial y posterior sin reabrir juego; C29/C35/C36 | Comprobar la superficie administrativa y su copy |
| El abandono no anula necesariamente todas las condiciones | Regla de totales; S65 | Resultado por condición y precio del subconjunto archivado; C30–C32 | Evitar que el marcador provisional se interprete como liquidación |
| Un indicador puede desincronizarse de una reliquidación | Advertencia oficial específica de Squad Bet; S67 | Una versión vigente compartida por lista, recibo y detalle; C33/C34 | No se observó el defecto ni se midió mejora |
| Cero coincidencias por nombre no bastan para cerrar naming | Consultas Contains y Fuzzy de TMview; S81 | Vennside pierde prioridad por VENSIDE; Ternside es candidato con reservas | Revisar registro de origen, pronunciación, assets y disponibilidad comercial |
| El contexto respalda investigar prepartido y directo | Datos 2025 de miembros EGBA; S59 | Mantener continuidad entre ambas fases en la demo | No inferir preferencias de todos los usuarios a partir de GGR |

Los IDs se encuentran en [S01–S36](../research/sources.md), [S37–S55](../research/sources-wave-02.md), [S56–S63](../research/sources-wave-03.md), [S64–S67](../research/sources-wave-04.md) [S68–S84](../research/sources-wave-05.md), [S85–S88](../research/sources-wave-06.md) y [S89–S91](../research/sources-wave-07.md). El detalle de los hallazgos por flow está en [la segunda tanda](../research/07-flow-findings.md).

## Datos de contexto que merecen aparecer

- Apuestas remotas en Gran Bretaña: **£2.400 millones de GGY** en abril de 2025–marzo de 2026; fútbol, **£1.200 millones** dentro de ese segmento. Es actividad económica del mercado, no impacto del concepto. [S56](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/industry-statistics-annual-report-financial-year-april-2025-to-march-2026-official-statistics).
- En el sportsbook online de los miembros de EGBA, **63% del GGR procedía de prepartido y 37% de directo en 2025**. Son ingresos de una muestra de operadores, no reparto de apuestas o usuarios europeos. [S59](https://www.egba.eu/uploads/2026/07/260709-EGBA-Annual-Activity-Report-2026.pdf#page=34).

El [registro de cifras](metrics-register.md) conserva definiciones, periodo y límites para reutilizarlas sin deformarlas.

## Historia que podría sostener el caso

La primera intuición incluía IA como posible diferenciador. El research encontró precedentes y desplazó el foco hacia cómo se representa una apuesta a lo largo del recorrido. La investigación posterior hizo visible que esa representación necesitaba reglas, estados y dinero coherentes, no solo una nueva tarjeta gráfica.

El case study puede mostrar esa evolución con las evidencias disponibles. Todavía no puede afirmar que la solución reduce errores, mejora comprensión o aumenta satisfacción: esas medidas están propuestas, no obtenidas.

## Resultado actual del trabajo

16 flows con una primera spec, 48 escenarios de aceptación y un dataset ficticio con 23 cotizaciones prepartido de selecciones/subconjuntos y seis precios live en dos snapshots. Se han conciliado 50 ramas con expectativas de saldo documentales. Son recuentos de alcance y preparación. Las comprobaciones aritméticas y documentales no sustituyen pruebas de pantalla, tareas o una aplicación implementada.

## Cómo se mantendrá este resumen

Actualizar al cerrar cada bloque. Añadir hallazgos que cambien decisiones, contradicciones y descartes relevantes. Registrar separadamente decisiones de branding y lo observado al aplicar la identidad a cuotas, tickets y estados. Si emerge un concepto más interesante, detener la investigación e informar a Javier antes de seguir.

## Decisiones de branding de esta tanda

Quince nombres filtrados, tres candidatos con comprobaciones más profundas y tres territorios visuales propuestos. Ternside queda como nombre de trabajo recomendado con reservas; dirección Matchday editorial como primera composición. Se guardan las evidencias y nueve parejas de contraste calculadas. No hay nombre declarado libre, identidad aprobada o wordmark final. Ya existen borradores SC01 de escritorio y boleto móvil; siguen pendientes las referencias finales. [Research de marca](../branding/01-positioning-and-naming.md), [direcciones visuales](../branding/02-visual-directions.md) y [síntesis de paso a diseño](../research/10-research-synthesis.md).

## Qué cambió al cuestionar la investigación

La [revisión CR01–CR19](../research/11-critical-review.md) detectó huecos reales en nueva oferta live, redondeo y ventanas temporales, además de fricción propuesta al cambiar una selección reversible. Se corrigieron reglas, flows y datos; C37–C44 permiten comprobarlo después. Se añadió entrada directa a límites y se evitó una cuarta columna obligatoria para el inspector.

Nada de esto demuestra que el inspector mejore comprensión. La comparación pendiente debe ofrecer las mismas reglas y cifras en ayuda convencional y en inspector, además de tareas normales donde este podría sobrar. El recuento de fuentes nunca se usa como prueba de demanda o mejora.

## Contraste que añade la séptima tanda

El mismo Bet Builder no garantiza el mismo tratamiento de una selección void: Sky Bet, Betano DK y bet365 GB describen políticas diferentes. Eso justifica explicar qué regla se acepta, sin demostrar todavía que el inspector sea la mejor forma. [Comparación y fuentes](../research/12-mobile-and-europe-contrast.md).

La revisión propia también encontró ambigüedad al conservar borradores por modo. Se sustituye por grupos compartidos e importes separados; una aceptación consume sus grupos una vez. C45–C48 hacen revisable la decisión. Las imágenes promocionales/recortes se guardan con sus límites; no se presentan como validación móvil.

## Primera iteración visual real

Se generó SC01 con marca provisional y datos definidos. Desktop v1 añadió jugadores/umbrales ajenos al dataset; se rechazó como referencia y v2 eliminó esa oferta inventada. El boleto móvil conserva el mismo estado monetario. La revisión propia deja abiertos tipografía, tamaños de composición y estados restantes. Es una corrección de fidelidad al producto, no evidencia de mejora de comprensión con usuarios. [Archivos, antes/después y revisión](../design/visual-review.md); [prompts de la herramienta integrada](../design/image-prompts.md).

## Cierre para implementación

Por instrucción de Javier, se elimina la colección de capturas finales y se delega composición en Claude. Marca Ternside/BRAND-01 fijada con fuentes/licencias; chat fuera de v1 y selector Full/Mobile incluido. TECH-01 y la entrada HANDOFF-01 completan el encargo. Los borradores SC01 conservan su valor de historial, sin obligar a replicarlos. La demo y sus resultados todavía no existen en este dossier.
