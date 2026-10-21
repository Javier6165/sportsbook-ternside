# F03 — Evento y navegación de mercados

Estado: spec documental v0.2. Depende de R03/R12 y del modelo de evento/mercado.

## Referencias y decisión

O: bwin presenta contexto de evento y categorías horizontales en escritorio [S08](https://www.bwin.es/es/sports/eventos/psg-bar%C3%A7a-2:7866899). D: los periodos de fútbol y las excepciones deben leerse por mercado [S39](https://support.betfair.com/app/answers/detail/a_id/10555/). La demo no copia todo su catálogo.

Decisión: cabecera con participantes, competición y tiempo; categorías All / Goals / Players / Bet Builder según cobertura; sin Main duplicando All en este catálogo pequeño. Cada mercado conserva nombre, periodo y acceso a su regla. Las estadísticas aportan contexto y fuente ficticia; no se convierten en porcentaje de probabilidad.

## Recorrido y respuestas

Abrir evento → explorar categoría → abrir explicación si se necesita → seleccionar cuota → revisar talón. La explicación no modifica selección. Las categorías vacías no se muestran como destinos muertos; el estado de mercado se muestra donde antes estaba su precio.

| Estado | Respuesta |
| --- | --- |
| Abierto | Precio y selección accesibles por teclado, con estado seleccionado perceptible |
| Suspendido | Conservar nombre y selección; sustituir acción de cuota por estado con motivo disponible |
| Cerrado | Mostrar cerrado/resultados cuando corresponda; no reutilizar el botón de apostar |
| Feed retrasado | Mantener último dato con su marca; tratar disponibilidad de cuota por separado |
| Evento finalizado | Derivar a resultados y apuestas existentes; sin CTA de nueva apuesta |

Escritorio: cabecera y mercados coordinados con panel de talón. Móvil: categorías y búsqueda de mercado sin exigir recorrer una fila horizontal invisible; solución concreta pendiente de composición. La regla se abre en una superficie que devuelve foco al mercado.

## Criterios de aceptación

- F03-A01: tiempo reglamentario y prórroga no se confunden en fútbol; basket indica que incluye overtime.
- F03-A02: suspensión no borra una selección ni cambia una apuesta aceptada.
- F03-A03: un jugador sin datos no se muestra con cero tiros.
- F03-A04: abrir/cerrar regla conserva categoría y scroll.
- F03-A05: el minuto 68 muestra solo nuevas simples 1X2 a live-qv1; totales/jugador prepartido y builder no admiten selección nueva.
- F03-A06: cambiar de snapshot invalida la oferta anterior; datos y precio vigente corresponden al mismo contexto de evento.

La oferta de creación en directo sigue el [contrato por fase](../product/live-offer-contract.md), separado del seguimiento de tickets ya aceptados.

Para Claude durante implementación/validación: elección entre categorías compactas y menú adicional; prueba con nombre largo y teclado. La cobertura de mercados no crecerá para rellenar una composición.
