# Paquete de implementación Ternside

HANDOFF-01. Entrada: [START-HERE.md](START-HERE.md); en raíz [CLAUDE.md](../CLAUDE.md). El ZIP incluye dossier, especificaciones, datos, identidad/fuentes, encargo técnico y material editorial. No código de aplicación ni capturas finales obligatorias.

## Contenido

`project/`: brief/decisiones/revisión. `product/`: contratos de dominio y navegación. `flows/`: 15 activos y F15 archivado. `demo/`: fixtures y 48 casos. `branding/`: guía vigente, tokens, fuentes/licencias y evidencia de naming. `implementation/`: TECH-01/SIM-01/QA-01 y contrato creativo. `research/`: fuentes/evidencias y hallazgos. `case-study/`: material editorial. `design/`: solo textos históricos no vinculantes. `handoff/`: entrada, guion, release notes, manifiesto y control del paquete.

No se incluyen PNG SC01 ni un diseño para copiar píxel a píxel. Las imágenes de competidores/naming son evidencia con procedencia, no assets para reutilizar en la interfaz.

## Empaquetado

Un único directorio raíz `ternside-handoff-v1/`. Excluir deliverables, PNG de design/drafts, caches y metadatos del sistema. Manifiesto SHA-256 de todos los payloads salvo el propio manifiesto. Crear ZIP, comprobar CRC, extraer en temporal y validar hashes, lista de archivos, enlaces locales y recursos. La extracción no depende de rutas del ordenador original.

El [informe del paquete](package-check.json) registra el resultado. La app que Claude construya tendrá después su propio lockfile, build y reporte QA. No desplegar públicamente por inferencia.
