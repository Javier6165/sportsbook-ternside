# Registro de revisión visual

> Estado posterior: D38 elimina las referencias visuales obligatorias. [START-HERE](../handoff/START-HERE.md) y [BRAND-01](../branding/brand-guide.md) fijan el encargo vigente. Este documento conserva investigación/exploración anterior y no obliga a replicar pantallas ni reabrir opciones ya cerradas.

20-10-2026 · Revisión propia, sin participantes ni app implementada. [Protocolo](../project/quality-review-protocol.md).

La primera escena es SC01: evento y builder compacto. Estado: primera composición y corrección documental/visual, sin escenas finales. Las dimensiones de los archivos generados no prueban dimensiones CSS o viewport.

| ID | Archivo/escena | Hallazgo | Severidad | Acción | Estado |
| --- | --- | --- | --- | --- | --- |
| VR01 | SC01 desktop A v1 | El generador añadió tres jugadores y thresholds 1+/3+ no ofrecidos por fixtures | Mayor: oferta inventada | Sustituir tabla por una fila Daniel Costa 2+ SOT a 1.90, sin rellenar espacio con mercados nuevos | Corregido en desktop A v2; comprobación visual confirma solo Daniel Costa 2+ a 1.90; v1 descartado |
| VR02 | SC01 desktop A v1 | Exportación 1586×992; no coincide exactamente con objetivo 1440×900 | Limitación de artefacto | Registrar dimensiones reales; no declarar comprobado ese viewport ni medir targets CSS desde el bitmap | Abierto para composición reproducible |

| VR03 | SC01 desktop A v2 / móvil v1 | La apariencia de cuerpo/números difiere: escritorio parece más condensado que móvil; los bitmaps no fijan los archivos de fuente | Mayor para cerrar sistema | Fijar Inter para UI y dinero, Barlow Condensed solo para display; comprobar en composición con fuentes reales | Pendiente; no declarar sistema final |
| VR04 | SC01 desktop A v2 | Falta etiqueta explícita «3 selections» en cabecera de builder; móvil sí la contiene | Menor | Incluirla en siguiente composición sin convertirla en tres apuestas | Pendiente |
| VR05 | SC01 desktop A v2 / móvil v1 | Aún no hay referencia móvil del evento ni composición real a 320/1280 | Cobertura pendiente | Crear encuadre de evento móvil y verificar tamaños prioritarios al fijar composición reproducible | Abierto |

## Lote de revisión 1 y confirmación de corrección

Se inspeccionaron escritorio A v2 y boleto móvil A v1. Ambos conservan £100 disponibles, £10 de stake, £34 de retorno y £24 netos potenciales, con precio conjunto 3.40. No muestran recibo aceptado ni checks de ganado. Se identifican las tres condiciones y el periodo; la regla de participación y el acceso a ayuda siguen presentes. En móvil hay una sola tarea sin navegación global inferior.

VR01 está corregido: la tabla central tiene solo Daniel Costa 2+ a 1.90; se han eliminado los jugadores/umbrales ajenos al dataset. No se vuelve a generar por ese defecto. VR03/VR04 y las limitaciones de tamaño siguen abiertas. Esta revisión propia no es prueba con usuarios ni demuestra que la interfaz sea responsive, accesible u operable.

## Archivos y estado

- Desktop A v1 (`design/drafts/SC01-desktop-A-v1.png`, solo workspace): 1586×992, descartado como referencia por oferta inventada; se conserva para documentar corrección.
- Desktop A v2 (`design/drafts/SC01-desktop-A-v2.png`, solo workspace): 1586×992, borrador con cobertura de mercado corregida.
- Boleto móvil A v1 (`design/drafts/SC01-mobile-betslip-A-v1.png`, solo workspace): 853×1844, borrador de tarea móvil con el mismo estado monetario.

Los objetivos 1440×900 y 390×844 son de layout; no son las dimensiones reales de estas exportaciones. No se deducen tamaños CSS de los PNG ni se declaran comprobados viewport, teclado o foco. Continúan pendientes inspector, estados difíciles y recursos canónicos.

No hay escenas declaradas finales. La primera comprobación conjunta y la confirmación de VR01 se registran arriba; quedan pendientes los demás defectos/coberturas. Los fallos del generador no se trasladan al contenido canónico.
