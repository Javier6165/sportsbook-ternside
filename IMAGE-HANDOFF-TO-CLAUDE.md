# Imágenes de Astra para Claude · 22-10-2026

Los siete recursos de imagen de `HANDOFF-TO-ASTRA.md`, sección 4.1, están generados y exportados en `app/public/images/`. Se han creado con la herramienta integrada `image_gen`; son imágenes sintéticas de escenarios y un jugador ficticios. No son fotografías documentales ni capturas de la demo.

**Estado:** archivos locales listos; todavía no conectados a la interfaz. No he modificado `catalog.ts`, `index.html` ni otros archivos de implementación. No he hecho commits, pushes ni deploys. Javier ha pedido expresamente no actualizar GitHub todavía; un push a main dispara Netlify.

## Archivos

| Recurso | Archivo dentro de `app/public/images/` | Exportación | Peso aproximado |
| --- | --- | --- | --- |
| Partido destacado de fútbol | `hero-football-01.jpg` | 2400 × 1100 | 444 KB |
| Fútbol en directo | `hero-football-live.jpg` | 2400 × 1100 | 355 KB |
| Fútbol genérico, prepartido | `hero-football-generic.jpg` | 2400 × 1100 | 390 KB |
| Tenis | `hero-tennis.jpg` | 2400 × 1100 | 314 KB |
| Baloncesto | `hero-basketball.jpg` | 2400 × 1100 | 322 KB |
| Daniel Costa, opcional | `player-costa.png` | 1200 × 1500, transparencia alfa | 2,05 MB |
| Vista previa de enlace | `og-share.png` | 1200 × 630 | 1,11 MB |

Los fondos se entregan en **JPG**, una de las dos opciones admitidas por el brief, aunque su tabla usara nombres `.webp`. No renombrar la extensión sin convertir el archivo. Todos los fondos quedan por debajo de 500 KB. Retrato y OG son PNG como se solicitó.

## Integración

En `app/src/data/catalog.ts`, sustituir las cinco URLs de Unsplash por estas rutas, conservando las claves actuales y la lógica de `imageFor()`:

```ts
export const IMAGES = {
  heroNight: './images/hero-football-01.jpg',
  stadiumCrowd: './images/hero-football-live.jpg',
  pitchLights: './images/hero-football-generic.jpg',
  tennisNight: './images/hero-tennis.jpg',
  basketArena: './images/hero-basketball.jpg',
}
```

Comprobar también la cabecera de `football-01` que utiliza `IMAGES.heroNight` directamente. La interfaz ya dibuja las camisetas 3D, el desenfoque y los colores de los equipos; las fotos no llevan esas capas horneadas.

El tercio izquierdo es oscuro para dejar respirar el texto; el interés y los focos se concentran en la derecha. Validar el recorte real con `object-fit: cover` tanto en Full como en Mobile, especialmente tenis y baloncesto. Estos recursos se han revisado visualmente como archivos; **la comprobación dentro de la interfaz queda pendiente de integrarlos**.

`player-costa.png` es opcional: usarlo solo donde ya tenga sentido mostrar al jugador; no hace falta crear otra pantalla. Se ha comprobado que contiene píxeles totalmente transparentes y bordes con alfa parcial. Mantener esa transparencia y revisar el contorno sobre la superficie definitiva. Evitar cargarlo de forma anticipada en toda la aplicación; su peso es mayor que el de los fondos.

`og-share.png` es una pieza de marca para compartir el enlace, con el nombre Ternside y el pase «Bet Builder 3.40». No representa una captura de la interfaz ni un recibo real. Si se conecta en `app/index.html`, añadir los metadatos Open Graph y Twitter correspondientes, usando una URL absoluta pública para la imagen —en el dominio actual, `https://ternside-sportsbook.netlify.app/images/og-share.png`— y sus dimensiones 1200 × 630. Esa URL solo existirá tras una publicación posterior autorizada. Los metadatos deben estar en el HTML inicial, porque los crawlers de enlaces no suelen recorrer la app con hash.

## Producción y verificación

- Prompts completos: `Astra Research/branding/image-production-2026-10-22/prompts.json`.
- Manifiesto con dimensiones nativas, exportadas, peso exacto, calidad JPEG y SHA-256: `Astra Research/branding/image-production-2026-10-22/assets.json`.
- Se han inspeccionado los siete originales y las siete exportaciones: composición, texto de la pieza OG, anatomía visible del retrato, dimensiones y peso. No se observan escudos, patrocinadores ni textos de marcas reales. Las escenas se solicitaron ficticias; no se afirma una comprobación exhaustiva de semejanza con todos los recintos o personas existentes.
- Los fondos nativos generados son de aproximadamente 1852 × 849, y el retrato de 1122 × 1402. Se han remuestreado con `sips` al tamaño de entrega solicitado. **2400 × 1100 es la resolución exportada, no la nativa del generador.** La OG se ha reducido desde 1729 × 910. Los valores individuales están en el manifiesto.
- No se ha generado `live-loop.mp4`: es un recurso de vídeo opcional, fuera de esta entrega de imágenes. Los mockups de dispositivos del case study quedan para cuando la interfaz y las correcciones estén asentadas; deberán partir de capturas reales de la demo.

Para continuar: conectar las rutas, revisar los recortes y la legibilidad sobre las capas existentes, y agrupar la futura publicación con las correcciones de la demo. **No hacer push ni desplegar sin que Javier lo pida.**
