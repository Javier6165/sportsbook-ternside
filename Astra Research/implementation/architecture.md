# Encargo técnico para Claude

TECH-01 · 20-10-2026. Decisiones del asistente para el handoff; no se ha creado código de aplicación aquí. Demo web estática, sin backend, sin secretos y sin servicios de pago.

## Stack elegido

| Área | Elección | Motivo |
| --- | --- | --- |
| UI | React 19, TypeScript estricto | Compatibilidad con el ecosistema de componentes mencionado por Javier |
| Desarrollo/build | Vite, plantilla react-ts; Node 24 LTS; npm | SPA estática sencilla, reproducible y descargable |
| Estilos | Tailwind CSS 4 con integración Vite y CSS propio para identidad | Libertad de composición con tokens centrales |
| Rutas | React Router 7, modo declarativo, HashRouter | Enlaces recargables en alojamiento estático sin depender de rewrites |
| Estado | Context + reducer tipado; un único store de dominio | Misma cuenta, talón y libro mayor en todas las vistas y preview |
| Cálculos | decimal.js desde strings; precisión 40, HALF_UP final | Evitar errores binarios y redondeo intermedio de combinadas |
| Iconos | lucide-react | Sistema coherente; el nombre accesible sigue siendo obligatorio |
| Pruebas | Vitest para dominio; Playwright para recorridos | Casos críticos comprobables sin backend real |

Fuentes técnicas oficiales en [S92–S99](../research/sources-wave-08.md). Elegir versiones estables compatibles dentro de esas familias al iniciar, fijar las versiones exactas en package-lock.json y documentar Node/npm efectivos. No usar prereleases. No hay un lockfile de app en este dossier porque la instalación la hará Claude; no presentar una instalación no probada como reproducible. Si cambian requisitos de toolchain, ajustar versiones compatibles y registrarlo sin cambiar el producto.

No se requieren Next.js/SSR, base de datos, API de resultados, autenticación, LLM o pasarela. Los assets y fuentes se sirven con la app. Transiciones CSS breves y reduced-motion; no añadir biblioteca de animación salvo necesidad demostrada. React Bits/21st son recursos opcionales, no proveedores imprescindibles ni pantallas a copiar.

## Organización prevista

`src/domain/`: tipos, reglas, cálculo de cotizaciones/retornos, límites, resolución, ledger y operaciones. Funciones independientes de React. `src/demo/`: adaptación de fixtures, escenarios y relojes. `src/state/`: reducer/store, persistencia y comandos. `src/features/`: catálogo, búsqueda, evento/builder, talón, Mis apuestas, caja, cuenta, juego seguro e inspector. `src/presentation/`: controles de demo y selector. `src/ui/`: componentes compartidos. `public/fonts/`: originales suministrados y licencias. `tests/`: dominio y E2E. Es una estructura de responsabilidades; no un scaffold ya escrito.

## Rutas y superficies

Usar URL con hash: `#/sports`, `#/sports/:sportId`, `#/live`, `#/search`, `#/event/:eventId`, `#/betslip`, `#/bets/:betId`, `#/receipt/:betId`, `#/my-bets`, `#/wallet`, `#/account`, `#/safer-gambling` y `#/account-closed`. Un panel de escritorio puede corresponder a una tarea/página móvil; back conserva el contexto. Filtros relevantes en query; IDs desconocidos → V16, sin sustituir por otro ticket.

Un enlace a un recibo de una sesión inexistente explica que el ticket no está en esta sesión y permite cargar un escenario identificado con confirmación; no fabrica un recibo a partir de una cuota actual. V14/F15 se reserva, sin ruta ni botón base.

## Persistencia y reloj

Un snapshot JSON versionado en localStorage, clave `ternside.demo.v1`: cuenta/restricciones, ledger, recibos y liquidaciones, cotizaciones aceptadas, grupos/stakes, operaciones pendientes y sus resultados simulados, escenario/relojes, favoritos y búsqueda. Importes/cuotas como strings, nunca instancias Decimal serializadas. Versiones incompatibles o contenido corrupto: ofrecer reiniciar demo con explicación, no mezclar estados. Si storage falla, avisar de modo temporal y de pérdida al cerrar; no afirmar persistencia disponible.

Persistir cada transición de dominio como un único snapshot consistente. Recargar no reenvía solicitudes. No reconstruir saldo desde importes de UI o sumar retornos en efectos React. Una sola pestaña de escritura activa: detectar otra pestaña sobre la misma sesión y dejarla en lectura con opción explícita de tomar control; reconciliar/recargar snapshot antes de escribir. La demo no implementa concurrencia bancaria distribuida.

Clocks de cuenta, evento y sesión independientes. Fechas de reglas/casos se mantienen en 2026; no usar el día real del visitante para caducar partidos o cambiar ventanas. Reloj de sesión puede contar duración real de uso. Procesamiento ficticio de live de dos segundos según fixture; no SLA. Un avance de evento actualiza oferta/observación juntos, sin avanzar cuenta.

## Dinero y operaciones

Reglas exactas en RULES-GB-01. Decimal desde strings; retorno a dos decimales HALF_UP una vez al final, producto exacto de cuotas hasta liquidar. Un servicio simulado de comandos valida cuenta, saldo, reglas, fase y revisión antes de aceptar. UI muestra resultados del mismo store; no mantiene otro saldo local.

Cada envío/cashout/retirada/devolución tiene ID y estado. Para respuesta desconocida, el escenario fija el resultado del mismo ID y lo conserva. Reconciliar revela/aplica ese resultado una vez; navegar, renderizar de nuevo o recargar no sortea un resultado nuevo. Nueva operación monetaria bloqueada mientras sea desconocido. Autoexclusión puede aplicarse inmediatamente, como R11 exige. Deshabilitar acciones de edición que alteren el snapshot pendiente; otros borradores no se consumen.

Liquidaciones versionadas se aplican por diferencia de retorno bruto; IDs duplicados y versiones antiguas no cambian dinero. Cash Out y liquidación compiten por una única resolución terminal. Devoluciones por exclusión se reservan para administración, sin habilitar saldo de juego. No ofrecer transiciones de corrección fuera de las precondiciones de los escenarios.

## Contrato de entrega de la app

Claude añadirá scripts `dev`, `build`, `preview`, `typecheck`, `test` (modo no watch) y `test:e2e`. Entregar fuente completa, lockfile, README con instalación/ejecución/build, licencias, informe de pruebas y limitaciones. Debe poder ejecutarse con `npm ci`, `npm run dev`; producción con `npm run build` y `npm run preview`. Validar los comandos en su entorno. El artefacto estático es dist; debe funcionar bajo subruta con rutas/assets relativos cuando se configure base. No desplegar públicamente ni registrar dominios como parte de este encargo.

No necesita variables de entorno ni claves. No recoger datos reales, introducir analítica o conectar servicios de terceros. Una vez instalada, la experiencia de demo no necesita red para sus datos; no prometer un service worker/PWA que no se implementa.
