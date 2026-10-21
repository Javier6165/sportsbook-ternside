# Direcciones visuales para comprobar en producto

> Estado posterior: D38 elimina las referencias visuales obligatorias. [START-HERE](../handoff/START-HERE.md) y [BRAND-01](../branding/brand-guide.md) fijan el encargo vigente. Este documento conserva investigación/exploración anterior y no obliga a replicar pantallas ni reabrir opciones ya cerradas.

20-10-2026 · Hipótesis de identidad v0.1. No son una paleta aprobada, un logo final ni imágenes de producto ya validadas. Se recomienda A para la primera composición.

## Tres direcciones comparables

| Dirección | Color y forma propuestos | Tipografía propuesta | Qué comprobar / decisión |
| --- | --- | --- | --- |
| A. Matchday editorial | Navegación navy, superficies claras, acción azul intenso, líneas limpias y números estables | Barlow Condensed Semibold para display deportivo; Inter para producto y dinero | Recomendada: permite un carácter deportivo visible conservando detalle legible. El azul no se presenta como territorio exclusivo o innovación |
| B. Night session | Fondo #121A19, superficies #1C2825, texto #F4F8F5, acento #B8F34A; geometría compacta | Inter con mayor contraste de pesos | Más cercana a códigos de betting oscuro; comprobar fatiga/densidad y que selección no parezca estado ganado. No priorizada |
| C. Terrace | Fondo #F4EEE4, texto #262B2B, acción #BA421B, soporte #0B5551; bloques editoriales cálidos | Barlow Condensed + Inter | Más singular como pieza editorial; puede parecer revista, tiene interferencia con códigos naranjas de otros operadores y aviso/acción requieren separación. Reserva |

A, B y C deberán compararse con **el mismo evento, mercados, ticket, cantidades y estado**; no elegir una porque su mockup tiene mejor fotografía o menos contenido. B/C son territorios exploratorios, sin contraste completo calculado. A tiene parejas textuales calculadas, no una evaluación de pantalla.

## Hipótesis A: roles de color precisos

| Rol | Valor | Aplicación propuesta |
| --- | --- | --- |
| Canvas | #F4F5F7 | Fondo principal |
| Surface | #FFFFFF | Mercados, ticket y recibo |
| Ink | #182134 | Texto principal |
| Secondary | #596579 | Metadatos y texto de apoyo sobre blanco |
| Navigation | #10182B | Header/nav; texto claro #FFFFFF |
| Action | #2948FF | CTA de acción; texto blanco |
| Brand on dark | #86A8FF | Acento de marca sobre navy; no reutilizar Action sobre navy para texto pequeño |
| Selection fill / text | #E9EEFF / #2440D8 | Cuota elegida; añadir borde e indicador seleccionado |
| Won fill / text | #E7F5EC / #14653A | Resultado oficialmente ganado con etiqueta y símbolo |
| Warning fill / text | #FFF2D6 / #805000 | Precio cambiado o atención; etiquetas distintas por tarea |
| Lost fill / text | #FDECEF / #AD2536 | Resultado perdido/error, con lenguaje que los distinga |
| Void fill / text | #EEF0F3 / #505968 | Anulación; nunca presentarla como ganancia |

Se calculó luminancia sRGB y relación de contraste de nueve parejas de texto/fondo. [Datos exactos](evidence/contrast-candidates.json). Blanco sobre Action: 6.06:1; texto de selección sobre su fondo: 6.48:1; Secondary sobre blanco: 5.90:1. Los cálculos usaron valores sin redondear para comprobar el umbral de 4.5:1 de texto normal, con [referencia W3C S80](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Las cifras mostradas se redondean solo para informar.

No se ha comprobado aún contraste no textual de bordes/foco, estados de interacción, transparencias, imágenes, daltonismo o accesibilidad de una app. El verde solo señala liquidación favorable confirmada: en directo, «Threshold reached — provisional» conserva su etiqueta e icono propio; no pinta todo el ticket como ganado.

## Tipografía y carácter

**Inter para interfaz**: cuerpo, navegación, cuotas, dinero y condiciones. El autor documenta cifras tabulares; usarlas en columnas, cuotas y balances. [S78](https://rsms.me/inter/). Pesos de trabajo 400/500/600/700, sin convertir toda la interfaz en semibold. Importes y cuotas jamás en condensada.

**Barlow Condensed para display**: títulos deportivos grandes, identidad editorial y posibles exploraciones de wordmark. El repositorio del autor incluye varias anchuras y licencia OFL; la entrega debe fijar los binarios elegidos. [S79](https://github.com/jpt/barlow). No usar la anchura estrecha para reglas, errores o nombres largos dentro del talón.

Ambas familias documentan SIL OFL 1.1; aún no se han descargado/fijado versiones. El paquete debe incluir archivos exactos y sus licencias. No depender de un CDN externo para reproducir las referencias finales. Las fuentes propuestas no implican un wordmark diseñado ni aprobado.

## Lenguaje de marca aplicado al sistema

Probar una línea editorial de contexto: participantes → condiciones → importe → resultado. Ese recurso puede conectar evento, ticket y recibo, pero no se convierte en barra de progreso con porcentaje de victoria. No diseñar checks de éxito antes de liquidación para decorar el recorrido.

Fotografía: deporte adulto y entorno real de partido, con derechos/origen documentados. No depender de fotos de jugadores conocidos para que la marca funcione. Los equipos del dataset son ficticios; escudos y equipaciones deben ser propios. Las tarjetas de cuotas necesitan funcionar sin fotografía.

Iconografía: sistema sencillo y coherente con texto en acciones críticas. Evitar balón como único identificador de una marca multideporte, escudos de «seguridad garantizada» y destellos de IA. Una marca de verificación no debe ser simultáneamente logo, selección y resultado ganado.

Tono: «Review new odds», «Selection void — player did not take part», «£8 returned · £2 net loss». Son propuestas de copy para comprobar; no «AI found a safe bet», «Guaranteed win» o mensajes para recuperar pérdidas. El error indica tarea y remedio, no culpabiliza al usuario.

## Aplicaciones que decidirán si funciona

1. Evento + tres mercados + ticket de builder Home/Over/Player: laptop y móvil. Mantener densidad suficiente para reconocer el sportsbook.
2. Ticket con precio 3.40→3.20 y respuesta desconocida: jerarquía de estado por encima de decoración de marca.
3. Directo con contador corregido 2→1: distinguir observación provisional de resultado.
4. Recibo tras jugador void, precio reducido y retorno £27: demostrar que el lenguaje de marca admite una explicación concreta.
5. Cuenta cerrada y devolución posterior: diseño administrativo claro sin arrastrar estímulos deportivos.

No pasar una imagen plana a Claude como única fuente de verdad. La siguiente fase debe entregar recursos canónicos, medidas, color/estados, tipografía, contenido y comportamiento junto a cada imagen. La identidad se considera cerrada cuando esas aplicaciones funcionan; todavía no se ha llegado a ese punto.
