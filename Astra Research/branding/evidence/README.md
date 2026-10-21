# Evidencia de naming y fundamentos visuales

20-10-2026. Research de lectura, sin registro de dominios, solicitud de marca o compra. Las capturas son JPEG de 1280×720; el texto conserva filas fuera del viewport.

| Consulta | Evidencia conservada | Resultado observado |
| --- | --- | --- |
| TMview Ternside, Contains | [Captura](2026-10-20-tmview-ternside.jpg), [texto](2026-10-20-tmview-ternside.txt) | Una fila WESTERNSIDE; no coincidencia exacta |
| TMview Ternside, Fuzzy | [Captura](2026-10-20-tmview-ternside-fuzzy.jpg), [texto](2026-10-20-tmview-ternside-fuzzy.txt) | 18 filas; incluye Terntide, UK, clase 9 |
| TMview Terntide, detalle | [Texto](2026-10-20-tmview-terntide-detail.txt) | UK00003463669; productos descritos: fotografías digitales descargables |
| TMview Vennside, Contains | [Captura](2026-10-20-tmview-vennside.jpg), [texto](2026-10-20-tmview-vennside.txt) | No rows found |
| TMview Vennside, Fuzzy | [Captura](2026-10-20-tmview-vennside-fuzzy.jpg), [texto](2026-10-20-tmview-vennside-fuzzy.txt) | Siete filas; VENSIDE registrada en Suiza para varias clases |
| TMview Sidepace, Fuzzy | [Captura](2026-10-20-tmview-sidepace-fuzzy.jpg), [texto](2026-10-20-tmview-sidepace-fuzzy.txt) | 15 filas con variantes; no se consultó Contains |
| Registro .com RDAP | [Respuestas resumidas](2026-10-20-domain-rdap.json) | Control Bet365: 200; Ternside/Vennside: 404; Sidepace: 200 |
| Contraste de hipótesis A | [Parejas y cálculos](contrast-candidates.json) | Nueve parejas de texto/fondo; no auditoría de UI |

TMview se consultó con todas las clases, estados y oficinas disponibles por defecto, sin filtros adicionales. Sus fuentes se actualizan en fechas diferentes. No sustituye comprobar el registro de origen ni valorar similitud jurídica. El servicio directo de UK IPO mostró una comprobación de seguridad y no se completó allí la búsqueda.

RDAP se consultó directamente al endpoint de Verisign para .com. La primera lectura falló por DNS del sandbox; la consulta pública posterior obtuvo los códigos documentados, con un dominio registrado de control. Se conservaron solo códigos/nombres, sin datos de titulares. No se comprobaron precios, disponibilidad de compra, otros TLD o dominios similares.
