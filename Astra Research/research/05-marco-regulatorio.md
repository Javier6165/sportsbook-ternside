# Marco regulatorio traducido a decisiones de diseño

Fecha de comprobación: 2026-10-20. Este documento identifica restricciones y preguntas relevantes para un concepto. No es una certificación de cumplimiento ni una revisión normativa exhaustiva.

## Elegir un país de referencia

La UE no tiene una legislación sectorial única de juego online. El concepto puede ser relevante para empresas europeas, pero sus variantes deben responder a cada mercado. [S01](https://single-market-economy.ec.europa.eu/sectors/online-gambling_en).

**Supuesto operativo del asistente, revisable:** usar Gran Bretaña como referencia de una primera variante, con inglés y GBP. La Gambling Commission regula Gran Bretaña; no debe ampliarse automáticamente su alcance a toda Europa ni a todo el Reino Unido. España se mantiene como alternativa y como contraste documental.

## Gran Bretaña: requisitos verificados con consecuencia en interfaz

| Área | Evidencia de referencia | Traducción propuesta a la demo |
| --- | --- | --- |
| Verificación | Se exige comprobar edad e identidad antes de apostar [S25](https://www.gamblingcommission.gov.uk/public-and-players/guide/age-and-id-verification) | Usuario ficticio verificado por defecto. Si se representa onboarding, incluir estados de revisión y bloqueo; no recoger documentos reales |
| Importe de la operación | RTS 2 pide claridad sobre el valor comprometido [S20](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-2-displaying-transactions) | Mostrar importe y moneda de la apuesta en la revisión, con recibo consistente |
| Límites | RTS 12 regula acceso y funcionamiento de límites; versión actualizada el 30-09-2026 [S21](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-12-financial-limits) | Acceso visible desde home y depósitos; entrada libre para fijar importe; representar límites de depósito bruto de 24 h, 7 días y un mes, con el más restrictivo aplicable |
| Cambios de límites | RTS 12 distingue reducción y aumento [S21](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-12-financial-limits) | Reducción inmediata salvo fallo técnico; aumento solicitado por el usuario con al menos 24 h de espera y confirmación posterior. No resetear silenciosamente límites al cambiar de escenario |
| Conducta de producto | RTS 14A prohíbe fomentar persecución de pérdidas y otras conductas descritas; 14B impide cancelar retiradas [S23](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-14-responsible-product-design) | Sin prompts de «recupera lo perdido», escalado de importe o cancelación de retirada para seguir jugando |
| Directo | RTS 15 requiere información sobre retraso de transmisiones [S24](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-15-in-play-betting) | Aviso breve en superficies de directo y detalle accesible. No prometer sincronía perfecta entre marcador, vídeo y cuotas |
| Cash Out | La autoridad explica límites de disponibilidad [S30](https://www.gamblingcommission.gov.uk/public-and-players/page/i-cant-cash-out-on-a-bet) | Oferta condicionada; estados disponible, cotización cambiada, solicitada, confirmada y no disponible. La ausencia de oferta no anula la apuesta |

El cambio de límites de septiembre de 2026 es especialmente relevante: la fecha inicialmente prevista se amplió. La fuente actual aclara la terminología de depósitos brutos y los periodos ofrecidos. No usar un resumen anterior a la actualización para cerrar el flow. [S22](https://www.gamblingcommission.gov.uk/news/article/implementation-extension-for-new-deposit-limit-requirements).

**Límite de aplicación:** RTS 14 contiene también apartados específicos de casino y slots. Sus restricciones sobre ciclos o juego simultáneo no se trasladan al sportsbook de eventos deportivos como si fueran obligaciones generales.

## España: contraste y cambio futuro

La DGOJ identifica verificación, acceso de personas prohibidas y menores y control de límites entre sus ámbitos de supervisión. Esto justifica incluir estados de acceso y cuenta en una variante española, no solo una etiqueta de mayoría de edad. [S26](https://ordenacionjuego.es/datos-estudios/actividad-historica/control/inspeccion).

En 2026 se anunció un sistema de límites conjuntos. La FAQ consultada fija su aplicación el **25 de marzo de 2027** y explica su convivencia con límites por operador. En el corte de este research es una obligación futura a tener en cuenta, no una funcionalidad que deba describirse como ya operativa. [S27](https://www.ordenacionjuego.es/novedades/gobierno-aprueba-nuevo-sistema-limites-conjuntos-deposito-reforzar-seguridad-jugadores), [S28](https://ordenacionjuego.es/preguntas-frecuentes?faq=210).

Si se elige España habrá que comprobar el texto normativo consolidado y sus transiciones antes de especificar caja. No se copiarán importes o ventanas británicos a una interfaz española. Tampoco se simulará conexión con un sistema público de límites.

## Políticas propuestas del concepto

Estas son elecciones del proyecto, no una lista de obligaciones comunes a todos los países:

- Dinero y datos inequívocamente ficticios; sin licencia, sello o relación con regulador inventados.
- Cuotas, estadísticas y explicaciones con estado y fecha del escenario; no presentar cálculos de IA como resultado oficial.
- Sin probabilidades de éxito derivadas de «porcentaje de condiciones completadas».
- Selecciones y operación final siempre revisadas por el usuario.
- Límites, pausa, autoexclusión y retirada accesibles desde las áreas pertinentes.
- No convertir actividad, pérdidas o frecuencia en rachas competitivas.
- Contraste, etiquetas legibles, teclado y estados distinguibles sin depender únicamente del color.

## Pendiente antes de cerrar cuenta y dinero

Autoexclusión y periodos aplicables; intervenciones de juego seguro y comprobaciones financieras; métodos de pago permitidos; identidad y documentación adicional; marketing y promociones; privacidad de datos y conversaciones; quejas y disputas; reglas concretas de liquidación. La elección de país determinará qué fuentes y condiciones se necesitan.

La demo podrá mostrar escenarios de estos procesos sin ejecutar verificaciones, pagos ni controles regulatorios reales. Esa diferencia debe quedar explícita en la presentación del caso.

## Revisión de traducción a producto

Relectura de S21 al revisar CR07/CR08: el acceso a límites debe ser directo desde Home y depósito; estaba en este marco pero faltaba en F01. Ahora se exige allí y en C41. La demo elige ventanas móviles de 24 h/7 días y mes natural local; no se presenta esa elección como una obligación universal de calendario. [Regla R11](../product/demo-rules.md).
