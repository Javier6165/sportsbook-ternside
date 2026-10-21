# Síntesis para pasar de investigación a diseño

> Estado posterior: D38 elimina las referencias visuales obligatorias. [START-HERE](../handoff/START-HERE.md) y [BRAND-01](../branding/brand-guide.md) fijan el encargo vigente. Este documento conserva investigación/exploración anterior y no obliga a replicar pantallas ni reabrir opciones ya cerradas.

20-10-2026 · Corte documental v0.5. Decisiones de trabajo y prioridades de composición. No constituye aprobación de identidad ni validación con usuarios.

## Propuesta que se mantiene

Un sportsbook reconocible con un ticket que conserva sus condiciones y las explica antes de aceptar, durante el partido y después de liquidar. El diferenciador es la continuidad de esa representación y la exploración opcional de supuestos: qué se elimina si un jugador no participa, qué precio queda y qué retorno corresponde si las otras condiciones ganan.

No basar el relato del portfolio en «primer sportsbook con IA» ni en «nadie ha hecho tracking por selección». Existen precedentes registrados en el benchmark. La hipótesis de valor es que la continuidad del ticket haga más fácil entender decisiones y cambios; falta probarla.

**No ha aparecido una alternativa de concepto que justifique detener el proyecto por D15.** Las excepciones de esta tanda refuerzan la dirección existente. Naming y art direction son decisiones de ejecución, no un cambio de concepto.

## Qué evidencia sostiene una decisión concreta

| Evidencia | Qué cambia en el concepto | Qué no podemos concluir |
| --- | --- | --- |
| Chat/IA y seguimiento ya documentados, S18/S35/S37 | IA pasa a asistencia opcional; el núcleo funciona sin chat | Que esas ofertas resuelvan o no la comprensión para todos los usuarios |
| Reglas diferentes por mercado/jugador y tipo de apuesta, S37–S39/S48 | Una regla versionada compartida por evento, ticket y recibo | Que un reglamento híbrido sea «el definitivo» para toda Europa |
| Exclusión con pagos posteriores, S43/S64 | Cierre inmediato y devolución administrativa de retornos posteriores | Que la exclusión de la demo se conecte a servicios reales |
| Abandono conserva resultados determinados, S65 | Resolución por condición; Over puede ganar y Under perder mientras 1X2 es void | Que el marcador provisional sea suficiente para pagar |
| Reliquidaciones y advertencia de indicador desactualizado, S66/S67 | Versiones compartidas, ajuste explícito e historial | Que hayamos observado ese defecto o demostrado mejoras con el diseño |
| Datos EGBA de prepartido/directo, S59 | Mostrar continuidad de ambas etapas | Que 63/37 sean porcentajes de usuarios o de apuestas |

## El recorrido que debe demostrar el portfolio

Buscar o abrir un partido → reconocer mercados y elegir condiciones → revisar un builder de £10 a 3.40 y posible retorno £34 → explorar jugador no participante con explicación condicional de £27 → revisar un cambio de cuota sin apostar automáticamente → aceptar una vez → seguir estados provisionales → abrir recibo y entender resultado/retorno/neto.

Se conservan simples, combinadas y Cash Out como patrones convencionales. Las variantes de exclusión, abandono y corrección muestran profundidad de producto en el dossier y en escenarios de demo; no deben competir con ese recorrido principal en la primera pantalla.

Este es un guion de diseño, no una tarea ya completada por un usuario. Se utiliza fútbol ficticio y cuenta verificada con £100 ficticios. Gran Bretaña/en-GB/GBP siguen siendo supuestos operativos del asistente.

## Alcance suficientemente concreto para empezar a componer

16 flows y 48 escenarios definidos. Dataset con cinco eventos ficticios y 23 precios de selecciones/subconjuntos. Se han conciliado 50 ramas con expectativas de saldo documentales. Las reglas de abandono, exclusión abierta y corrección ya tienen ejemplos; permanecen fuera de alcance saldos negativos y correcciones de fondos ya devueltos por exclusión. No habilitar encadenamientos arbitrarios desde el marco de demo.

No hace falta seguir ampliando deportes, mercados, promociones o features para comenzar las referencias visuales. Una ampliación ahora añadiría reglas sin resolver la duda principal de comprensión y densidad. Las preguntas que quedan son mayoritariamente de representación, interacción y alcance de marca.

## Branding: recomendación que ya se puede evaluar

Nombre de trabajo recomendado: **Ternside**, condicionado a la revisión de similitud con Terntide y a las comprobaciones pendientes. Vennside pierde prioridad al encontrar VENSIDE mediante Fuzzy. Sidepace tiene .com registrado. Ninguno se declara «libre» o registrable.

Dirección A, **Matchday editorial**: navegación navy, superficies claras, acción azul, Inter para datos y producto y Barlow Condensed para display. Nueve parejas textuales propuestas superan 4.5:1 en cálculo, lo que no equivale a una auditoría de accesibilidad ni a una identidad aprobada. [Naming](../branding/01-positioning-and-naming.md), [direcciones y valores](../branding/02-visual-directions.md), [evidencia](../branding/evidence/README.md).

## Lo que debe resolver la siguiente fase

1. Componer evento/ticket/inspector en laptop y móvil con contenido y cantidades idénticos. Probar una versión base sin explicación expandida y otra con ella; comparar jerarquía y espacio.
2. Mostrar un estado por vez: seleccionado, revisión de precio, respuesta desconocida, provisional y liquidado. Evitar que el color o los checks anticipen ganancias.
3. Resolver el recibo con jugador void: conservar precio aceptado 3.40 y mostrar precio de liquidación 2.70 con motivo y retorno £27, sin parecer dos precios rivales.
4. Definir identidad y recursos exactos después de observar las aplicaciones. La investigación de branding no sustituye logo/wordmark ni assets listos para Claude.
5. Evaluar tareas de comprensión si hay participantes; si no, registrar revisión experta y sus límites. No rellenar resultados con estimaciones.
6. Solo después: stack, contrato técnico, manifiesto, ZIP y extracción de comprobación.

El [estado del handoff](../handoff/readiness.md) sigue abierto. El paquete actual sirve para investigar y componer; todavía no se debe entregar a Claude como diseño cerrado que pueda reproducir sin interpretar decisiones visuales.

## Correcciones tras la revisión propia

[CR01–CR19](11-critical-review.md) concreta los límites de evidencia y corrige oferta live, sustitución reversible, pérdida hipotética determinada, redondeo y ventanas de depósito. La oferta de nuevos builders es prepartido; las nuevas simples 1X2 live usan seis precios de dos snapshots, separados del seguimiento de tickets aceptados. No se anuncia cobertura live ilimitada.

Los criterios para revisar y pulir las referencias se fijan en el [protocolo de calidad](../project/quality-review-protocol.md). No se generarán pantallas finales antes de comprobar la coherencia de sus casos; las revisiones de estáticos no sustituirán tareas o interacción.

## Contraste móvil/europeo y cierre del talón

La [séptima tanda](12-mobile-and-europe-contrast.md) confirma diferencias de void entre S02/S09/S37 y de controles/oferta en Francia, S90/S91. La variante propia necesita señalar su política; no hay un reglamento único de Europa. Las cuatro imágenes publicadas nuevas no son cuatro sesiones de producto ni cierran la brecha móvil.

Se cierra una ambigüedad del handoff: una lista compartida de grupos con stakes separados evita copias al alternar modo; aceptar consume lo enviado y deja lo demás. C45–C48 especifican ese comportamiento, incluida edición/conversión del builder. La navegación móvil define tarea, vuelta y contexto. Estas son decisiones por comprobar en composición, no resultados de usuarios.
