# Dirección creativa y margen de diseño

20-10-2026 · Instrucción vigente: Javier elimina la producción de capturas por pantalla y permite a Claude decidir su composición dentro de las especificaciones. Los borradores SC01 son investigación histórica no vinculante; no forman parte del paquete de construcción.

## Debe permanecer

- Ternside y [BRAND-01](../branding/brand-guide.md), con fuentes locales y roles de estado.
- Sportsbook de cuota fija reconocible: evento, mercados/cuotas, talón, Mis apuestas y dinero. Desktop tan cuidado como móvil.
- Tipos de apuesta, reglas y copy monetario inequívocos; inspector opcional dentro del contexto del ticket, con datos reales de fixture.
- Destinos y comportamiento de [navegación](../product/navigation-and-mobile.md), [talón](../product/betslip-state-contract.md) y [oferta live](../product/live-offer-contract.md).
- Controles esenciales visibles/operables sin hover, foco restaurado, un solo panel de tarea móvil, y estados que no dependan solo de color.

## Lo decide Claude

Grid, columnas adaptativas, rail/cabecera, densidad por fila, espaciados, radios, sombras moderadas, iconos concretos del sistema, jerarquía tipográfica, breakpoints y transiciones. Puede elegir página/panel cuando el contrato preserva tarea y contexto. Los objetivos 320/390 px y laptop son tamaños de comprobación, no instrucciones de copiar píxeles.

No hay que generar una colección de imágenes antes de implementar. Diseñar y revisar directamente la demo. Los recursos de React Bits/21st.dev pueden inspirar componentes compatibles y accesibles, pero son opcionales: no bloquear la entrega si un catálogo requiere cuenta o no encaja. Registrar origen/licencia de cualquier componente copiado. Las necesidades de datos y estados mandan sobre el ejemplo visual del componente.

## Prioridad de experiencia

El primer recorrido debe mostrar rápidamente deporte, cuotas y una selección revisable. La innovación aparece al abrir «How this bet works / Explore outcomes» y al conservar el mismo ticket durante seguimiento y liquidación. No convertir la home en una explicación extensa del concepto ni introducir un chat como nueva portada.

Mostrar las excepciones bajo acción del explorador o escenario de presentación. El inspector no cambia el marcador real ni recomienda apuestas. La demo es de navegación libre; la guía es opcional.

## Revisión durante implementación

Revisar a 1280×800 y 1440×900, 390×844 y ancho 320. Encontrar un partido, revisar una apuesta, corregir un cambio de cuota, abrir ayuda/volver y leer recibo con void. Verificar teclado/foco, zoom/reflow, contraste, nombres largos y CTA con teclado móvil cuando se disponga de ese entorno. Corregir defectos de reglas, dinero y tarea antes del detalle estético. Registrar lo realmente ejecutado; no afirmar tests de dispositivo físico que no se hicieron.
