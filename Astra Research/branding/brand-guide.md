# Ternside — identidad del concepto

BRAND-01 · 20-10-2026 · Definida por el asistente dentro de la autonomía delegada por Javier. Aplicación: demo ficticia y case study de portfolio. No se presenta como una aprobación individual de Javier de cada recurso.

## Nombre y posicionamiento

**Ternside**, con T mayúscula y resto en minúsculas. Pronunciación orientativa inglesa: «tern-said». No usar TernSide, TernBet ni una traducción. Es una marca independiente de concepto, sin afiliación con operadores o clubes reales.

Un sportsbook para seguir el deporte y entender las condiciones de la apuesta elegida. Personalidad: editor deportivo preciso, directo y contemporáneo. Claim editorial opcional: **The game. The bet. The details.** Se reserva para presentación/case study; no ocupa permanentemente el espacio de mercados.

La elección queda cerrada para construir esta demo. El [research de naming](01-positioning-and-naming.md) conserva los descartes y las reservas. TMview encontró similitud Terntide; la consulta directa UK IPO no se completó; un 404 de RDAP no acredita compra disponible. No se ha comprado dominio, registrado marca ni obtenido autorización comercial. Claude usa Ternside como nombre ficticio, sin añadir ®, «licensed operator» o un dominio supuestamente propio. Esos límites no dejan el nombre abierto a que el implementador lo cambie por su cuenta.

## Firma tipográfica

Wordmark de texto **Ternside**, Barlow Condensed SemiBold 600, capitalización exacta, espaciado de letras −0.015em. Sin símbolo separado, ave, escudo, check o destello de IA. Color Ink sobre fondo claro y blanco sobre Navigation. Respetar espacio libre equivalente al alto de la T en los cuatro lados. Altura orientativa de texto: 28–36 px en cabeceras; mínimo 24 px. El wordmark no es una imagen reconstruida de los borradores.

No se necesita un logo rasterizado. La firma es texto con la fuente local suministrada, escalable y accesible; el nombre tiene una etiqueta accesible una sola vez. No usar esa condensada para datos monetarios.

## Colores elegidos

| Rol | Valor | Uso |
| --- | --- | --- |
| Canvas | #F4F5F7 | Fondo base claro |
| Surface | #FFFFFF | Superficies de lectura |
| Ink | #182134 | Texto principal |
| Secondary | #596579 | Texto secundario sobre blanco |
| Navigation | #10182B | Superficie oscura de marca; texto blanco |
| Action | #2948FF | Acción primaria con texto blanco |
| Brand on dark | #86A8FF | Acento/texto de marca sobre Navigation |
| Selected fill / ink | #E9EEFF / #2440D8 | Selección en borrador, con indicador adicional |
| Won fill / ink | #E7F5EC / #14653A | Resultado oficialmente ganado |
| Warning fill / ink | #FFF2D6 / #805000 | Precio cambiado/atención, con motivo |
| Lost fill / ink | #FDECEF / #AD2536 | Pérdida o error con etiquetas diferentes |
| Void fill / ink | #EEF0F3 / #505968 | Anulación |

Los [tokens](brand-tokens.json) son la referencia exacta de color y fuente. Nueve parejas textuales ya se calcularon; no equivalen a auditoría de UI. Foco y bordes operables deben alcanzar contraste perceptible en su contexto; partir de un contorno de foco de 2 px en Selected ink sobre claro, Brand on dark sobre oscuro, con separación. El color siempre acompaña texto/símbolo. Provisional no adopta el check verde de liquidación.

## Tipografía y recursos exactos

**Inter Variable** para interfaz, cuotas, dinero, reglas y mensajes. Pesos 400/500/600/700; óptica de trabajo 14 para UI. Cuotas y cantidades con cifras tabulares y alineación adecuada. Cuerpo habitual 14–16 px; textos de regla/estado legibles, sin usar una nota minúscula para esconder información necesaria.

**Barlow Condensed SemiBold** para wordmark y titulares deportivos/editoriales. No usar para cuotas, balances, campos, condiciones o errores. Claude elige escala y jerarquía de titulares según el contenido.

Archivos originales y licencias OFL en [assets/fonts](assets/fonts/manifest.json), fijados al commit del proveedor y con SHA-256. Copiar al proyecto y servir localmente; no depender de Google Fonts/CDN en ejecución. Las familias no se modifican. Mantener ambas licencias en la entrega de la demo. Fallback funcional de UI: system-ui, sans-serif mientras carga; no dar por reproducida la identidad con el fallback.

## Iconografía, imagen y tono

Un sistema de iconos Lucide, mismo grosor de trabajo 1.75–2, con texto/etiqueta accesible para acciones. Estados críticos nunca dependen solo del icono. Equipos y jugador ficticios: iniciales o emblemas geométricos propios; no descargar escudos reales. La demo debe funcionar sin fotografía. Claude puede crear decoración deportiva abstracta sobria, sin ocupar el lugar de datos o introducir otro proveedor imprescindible.

Tono de interfaz en inglés claro: «Review new odds», «Awaiting settlement», «Selection void — player did not take part», «£8 returned · £2 net loss». No prometer ganancias o probabilidades no calculadas. «Potential return» incluye stake; «Potential profit» es neto. Marcar dinero/demo de forma visible sin un modal obligatorio de entrada.

## Libertad visual de Claude

Javier ha eliminado las capturas por pantalla del encargo. Claude decide composición, grid, densidad, espaciado, radios, jerarquía, tratamiento de tarjetas y breakpoints, dentro de esta identidad y las specs de comportamiento. No debe copiar SC01 ni esperar imágenes finales.

La base usa una interfaz clara con contraste navy/cobalt y carácter deportivo; la distribución exacta de esas superficies es libre. No se exige un segundo tema oscuro. La navegación puede adoptar la forma que mejor funcione por tamaño, conservando destinos y continuidad. No modificar para mejorar una imagen: mercados, precios, estados, reglas, stakes o saldo. [Contrato creativo](../implementation/creative-direction.md).
