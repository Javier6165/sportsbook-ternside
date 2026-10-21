# Fuentes técnicas del handoff

S92–S99 · Consultadas 20-10-2026. Sirven para elegir herramientas y consultar APIs; no son evidencia de necesidades de apostadores.

| ID | Fuente primaria | Uso y límite |
| --- | --- | --- |
| S92 | [React — Quick Start](https://react.dev/learn) | Componentes, estado compartido y React 19; no determina arquitectura de dominio |
| S93 | [Vite — Getting Started](https://vite.dev/guide/) | Plantilla react-ts, build estático y requisitos Node; versiones exactas a fijar al instalar |
| S94 | [React Router — Declarative installation](https://reactrouter.com/start/declarative/installation) | Rutas cliente; elección de hash propia para evitar rewrites del hosting |
| S95 | [Tailwind — Using Vite](https://tailwindcss.com/docs/installation/using-vite) | Integración de la familia 4; no obliga a copiar una plantilla visual |
| S96 | [decimal.js — API](https://mikemcl.github.io/decimal.js/) | Aritmética decimal y modos de redondeo; configuración/reglas de pago propias |
| S97 | [Vitest — Guide](https://vitest.dev/guide/) | Runner para tests del dominio; no ejecutado sobre una app inexistente |
| S98 | [Playwright — Intro](https://playwright.dev/docs/intro) | Recorridos de navegador que Claude deberá implementar/ejecutar |
| S99 | [Node.js — Releases](https://nodejs.org/en/about/previous-releases) | Node 24 como familia LTS de trabajo; fijar patch compatible al instalar |

Los binarios de fuentes y sus licencias tienen procedencia/commit/hashes en [manifest de fonts](../branding/assets/fonts/manifest.json). Se reusan familias ya investigadas S78/S79; el mirror de distribución se identifica en el manifiesto.
