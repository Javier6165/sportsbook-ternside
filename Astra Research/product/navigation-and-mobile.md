# Navegación, móvil y continuidad de contexto

20-10-2026 · Propuesta propia 0.1; complementa el mapa V01–V16. No es evidencia de una app probada. Los ejemplos publicados y sus límites están en [el contraste europeo/móvil](../research/12-mobile-and-europe-contrast.md).

## Jerarquía de trabajo

Cuatro destinos principales: **Sports**, **Live**, **My Bets** y **Account**. Sports contiene home y filtros de deporte/competición/favoritos; no necesita otro tab Home duplicado. Search es una acción visible. Betslip es una tarea persistente accesible desde catálogo/evento, con contador según [su contrato](betslip-state-contract.md); no una segunda lista de apuestas aceptadas.

Escritorio puede distribuir navegación en cabecera/rail y mantener el talón junto a mercados. Móvil usa navegación principal inferior en las vistas de exploración. No se decide un breakpoint exacto hasta componer contenido real. Home y depósito tienen enlace directo visible «Deposit limits» a V12, sin exigir atravesar Account.

## Talón y detalle en móvil

Abrir el talón entra en una vista de tarea de altura completa con Close/back claros; la navegación global inferior se oculta dentro de esta tarea. El evento permanece como contexto de retorno. No hay dos sheets superpuestos.

La ayuda y Explore outcomes son subvistas internas del mismo espacio: back vuelve al resumen y conserva selección, importe y posición. El teclado debe permitir ver el campo activo y alcanzar revisión/CTA sin ocultarlo; esto requiere comprobación en navegador con teclado real, no solo una imagen.

My Bets abre el detalle de un ticket aceptado. Ese detalle no añade una cuarta columna a navegación + mercados + talón. Se usa una página o el único espacio contextual del ticket. Si se sustituye el talón, su borrador se guarda y la vuelta es explícita. Un ticket aceptado no muestra edición de selecciones.

## Back, cierre y reentrada

| Origen | Al volver |
| --- | --- |
| Evento desde lista filtrada | Mismo filtro y posición de lista |
| Búsqueda → evento → back | Consulta/resultados y posición previos |
| Evento → talón → cerrar | Mismo evento/categoría y borrador |
| Talón → caja o límites → volver | Mismos grupos/importes; precio/restricciones revalidados |
| Talón → inspector → back | Mismo resumen; no volver a la home |
| Envío desconocido → otra vista | Operación original sigue en comprobación, sin reenvío |
| Cambiar tamaño o selector de viewport | Misma sesión/estado, sin nueva apuesta ni reset |

Back del navegador cierra primero la subvista/tarea abierta cuando corresponda; navegar explícitamente a un destino principal es otra acción. Al cerrar se devuelve el foco al control de apertura si sigue presente. Un enlace directo inexistente abre V16; no carga otro ticket parecido. Son requisitos por verificar durante implementación.

## Catálogo acotado y estados vacíos

Solo aparecen categorías con contenido definido y distinto. No añadir contadores de cientos de eventos o mercados, menús de streaming o promociones sin comportamiento. All, Goals, Players y Builder siguen la elegibilidad de V04; no hay un tab Main que duplique All.

En el escenario totalmente prepartido, Live muestra vacío con contexto y siguiente evento, sin inventar una cuota en directo. El marco de presentación permite cargar un snapshot live con advertencia de reemplazo. Desde el producto no se avanza el marcador para habilitar una apuesta. [Oferta por fase](live-offer-contract.md).

## Una variante de producto completa

La base usa inglés en-GB, GBP y cuotas decimales. No hay selector de país, moneda o cuota fraccional en esta entrega. Account puede explicar estos valores como información, sin un control que no funcione. No se sugiere soporte europeo completo con banderas. Localizar a otra jurisdicción exigiría revisar mercados, cuenta, límites y reglas, además de traducir el texto.

## Qué se comprobará al componer

Mismo contenido en laptop 1280×800 y 1440×900, móvil 390×844 y ancho 320. Verificar longitud de condiciones, campos de stake, estado de operación y acceso a límites sin depender de hover. Objetivo propio de controles principales de 44 px; no confundirlo con el mínimo y excepciones de WCAG. Foco, teclado, reflow, zoom y anuncios de cambio requieren prototipo, además de revisión estática. [Protocolo de calidad](../project/quality-review-protocol.md).
