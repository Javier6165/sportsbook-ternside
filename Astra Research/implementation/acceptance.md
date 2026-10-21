# Aceptación de la implementación

QA-01 · Lo ejecutará Claude sobre la app que construya. Este dossier solo ha comprobado documentación, datos y recursos; no contiene resultados de tests de la app.

## Entrega mínima

- Fuente completa, package-lock.json, fuentes locales/licencias y build estático.
- `npm ci`, typecheck, tests no-watch y build sin errores; README con versiones y comandos reales.
- Informe con fecha, commit/versión, entorno, casos ejecutados, resultado y limitaciones. Diferenciar fail, pass y not run. No ocultar fallos como notas de estilo.
- Los 48 casos y ramas de `demo/scenario-cases.json` conservan sus resultados. Cuatro criterios F15 se conservan solo como archivo de alternativa: no son requisitos activos de v1.

## Pruebas de dominio prioritarias

Implementar tablas de casos sobre las funciones reales, no copias del cálculo de la UI. Todos los caminos de saldo/retorno del JSON, redondeo HALF_UP y producto sin redondeo intermedio. Cobertura de 23 subconjuntos, qv2 y void; abandono por condición; periodo/participación; aplicación de liquidaciones por versión/diferencia y rechazo de duplicados/antiguas.

Comprobar depósito bruto con fechas, borde exacto 24h/168h, DST y mes London; reducciones/aumentos con confirmación; retirada reserva/completa/rechaza; exclusión con posteriores retornos, operaciones desconocidas y devolución fallida. Confirmación de operación única y consumo de grupos C45–C48. Tests temporales con reloj controlado, sin esperar un día real.

## Recorridos E2E mínimos

| Recorrido | Casos / evidencia que debe comprobar |
| --- | --- |
| Encontrar partido → builder → revisión → aceptación → recibo | C05/C22; 3.40, £10, un débito; posterior void paga £27 |
| Cambio de precio | C07; nueva revisión 3.20/£32 antes de aceptar |
| Envío desconocido | C09/C10; navegación y recarga no duplican solicitud; recuperar mismo ID |
| Oferta y seguimiento live | C11/C42/C43; precio live 1.30, builder nuevo bloqueado, estadística corregida no paga |
| Cash Out | C12 y ambas ramas C14; £8 de retorno, £98 disponibles, sin segundo pago |
| Caja/límites/exclusión | C15/C16/C29/C35/C36/C39/C40/C41; sin saldo reutilizable tras cierre |
| Modos de talón | C45–C48; lista compartida, stakes separados, aceptación consume sin clones |
| Navegación libre, refresh, enlaces y reset | C25/C26; ID desconocido → V16, regreso con contexto, misma sesión |

Ejecutar el camino principal y navegación en desktop 1280×800 y móvil 390×844; repetir comprobaciones de layout a 1440×900 y ancho 320. E2E no requiere una captura patrón por pantalla. Puede guardar evidencia de un defecto para depurarlo. Si un navegador/dispositivo no está disponible, registrarlo como no ejecutado.

## Revisión de diseño en la app

Claude decide las pantallas y debe revisarlas después de renderizarlas. Detectar nombres/condiciones truncados, overflow horizontal, dinero incoherente, CTA tapado, estados provisional/ganado confundidos, foco perdido, paneles superpuestos y targets demasiado pequeños. Corregir antes de cerrar. Verificar teclado, cierre/back, ayuda, mensajes persistentes y zoom/reflow. Usar [protocolo actualizado](../project/quality-review-protocol.md), sin exigir imágenes previas.

## Criterio de finalización

Todos los flujos activos son alcanzables y sus controles responden. No quedan defectos críticos/mayores conocidos en reglas, dinero, tarea, lectura o navegación. Las afirmaciones del informe se apoyan en pruebas ejecutadas; las tareas con personas siguen no realizadas hasta que ocurran. No publicar/desplegar ni añadir servicios reales para «completar» la simulación.
