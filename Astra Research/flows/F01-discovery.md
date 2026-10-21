# F01 — Home, deportes, competiciones y favoritos

Estado: spec documental v0.2; pendiente de revisión visual. Depende del alcance y del catálogo ficticio.

## Referencias y decisión

O: las capturas de bet365 y bwin muestran navegación deportiva y catálogo con cuotas, con distinta distribución de búsqueda y paneles [S03](https://www.bet365.es/#/HO/), [S07](https://www.bwin.es/es/sports). Ninguna observación prueba cuál convierte o se comprende mejor.

Decisión: home de producto con próximos eventos y directo; filtros de deporte/competición; favoritos accesibles. Sin portada promocional interpuesta. Los eventos se ordenan por hora dentro de cada grupo; favorito significa acceso guardado, no recomendación de apuesta.

La jerarquía propuesta usa Sports/Live/My Bets/Account y Search como acción; talón como tarea con retorno, no otro historial. [Contrato móvil](../product/navigation-and-mobile.md).

## Recorrido y respuestas

Abrir home → elegir deporte → competición o evento → volver al mismo filtro y posición. Elegir favorito actualiza el icono y la sección guardada; no requiere apostar. Una cuota abre/reutiliza el talón; pulsar el nombre del evento abre sus mercados.

| Estado | Respuesta |
| --- | --- |
| Carga | Estructura de lista estable; no mostrar cuotas antiguas como disponibles |
| Sin favoritos | Explicación breve y acceso al catálogo, sin crear favoritos por defecto |
| Sin eventos en filtro | Mantener filtro y ofrecer quitarlo; no cambiar de deporte silenciosamente |
| Evento iniciado | Actualizar estado y hora a minuto/marcador; preservar ID y posición de navegación |

Escritorio: navegación lateral o persistente, lista central y talón contextual. Móvil: catálogo como superficie principal, filtros accesibles y entrada al talón sin ocultar las últimas filas. No duplicar listas completas por viewport.

## Criterios de aceptación

- F01-A01: volver desde un evento conserva deporte, competición, posición y talón.
- F01-A02: favorito no cambia cuotas ni envía selecciones.
- F01-A03: cada deporte visible tiene eventos y mercados del alcance; un vacío explica por qué no hay resultados.
- F01-A04: las filas identifican evento, hora/estado y nombre de mercado junto a sus cuotas.
- F01-A05: Home ofrece «Deposit limits» visible y directo a V12; no obliga a pasar por Cuenta. El mismo destino es accesible desde depósito. Referencia S21, RTS 12C.

- F01-A06: talón/inspector usan navegación interna en móvil; cerrar restaura contexto y foco, sin hojas superpuestas o un segundo historial de apuestas.

Para Claude durante implementación/validación: densidad por fila, prioridad de favoritos y comportamiento de filtros con nombres largos. Verificación futura: tarea de encontrar un partido concreto sin sugerencias promocionales.
