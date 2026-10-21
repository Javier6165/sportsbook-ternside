# F02 — Búsqueda y desambiguación

Estado: spec documental v0.1; requiere prueba visual de resultados. Depende de F01, F03 y del catálogo.

## Referencias y decisión

D: bet365 describe resultados separados por evento, competición y mercado y búsquedas recientes [S45](https://help.bet365.com/s/en-gb/sports/site-search). O: la búsqueda es prominente en su home observada. AceAI es una referencia de petición libre, sin ser necesaria para búsquedas precisas.

Decisión: búsqueda convencional con resultados agrupados y coincidencia tolerante a mayúsculas y acentos. Equipos y jugadores llevan contexto de competición/evento. Las consultas recientes se guardan solo en la demo local y se pueden borrar. No hay micrófono en la versión base.

## Recorrido y estados

Abrir búsqueda → escribir → resultados → elegir evento o mercado → llegar al destino con filtro pertinente. Una petición ambigua devuelve opciones; no escoge el partido con mayor popularidad. Pulsar un resultado de mercado abre el mercado; añadir cuota requiere una acción identificable distinta.

| Estado | Respuesta |
| --- | --- |
| Consulta vacía | Recientes y ejemplos de búsqueda, sin sugerencias de aumentar stake |
| Consulta corta | Mensaje discreto de seguir escribiendo, sin tratarla como error |
| Varios homónimos | Nombre completo, competición, rival y fecha para desambiguar |
| Sin resultado | Conservar texto y permitir borrar/cambiar; acceso al catálogo |
| Resultado cerrado | Mostrar contexto y estado; no permitir añadir cuota caducada |

Escritorio: superficie con espacio para grupos y contexto. Móvil: vista de búsqueda dedicada, foco en campo y teclado que no tape la salida. Escape/cerrar restaura foco; volver conserva la consulta hasta borrarla o reiniciar.

## Criterios de aceptación

- F02-A01: la misma selección tiene el mismo ID y precio vigente desde búsqueda y evento.
- F02-A02: buscar «North» con dos equipos devuelve alternativas identificables.
- F02-A03: seleccionar un resultado no envía ni añade una apuesta oculta.
- F02-A04: borrar recientes no borra favoritos ni apuestas.

Para Claude durante implementación/validación: umbral de caracteres, ranking para consultas parciales y tratamiento de errores tipográficos fuera del catálogo. Estos ajustes se evaluarán con tareas del dataset, no con supuesta precisión de IA.
