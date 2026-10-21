# Mapa de pantallas, superficies y acciones

v0.1 · Inventario lógico, no implementación de rutas. Una superficie puede ser página en móvil y panel en escritorio manteniendo el mismo contrato.

| ID | Superficie | Flows | Información esencial | Acciones y destinos |
| --- | --- | --- | --- | --- |
| V01 | Home | F01 | Deporte, próximos/directo, acceso a favoritos | Filtrar → V02; buscar → V03; evento → V04; cuota → V05; Deposit limits → V12 |
| V02 | Deporte/competición/favoritos | F01 | Filtro activo y eventos | Evento → V04; quitar filtro; guardar favorito; volver preservando contexto |
| V03 | Búsqueda | F02 | Consulta, resultados por tipo y recientes | Abrir evento/mercado → V04; borrar consulta/recientes; cerrar |
| V04 | Evento y builder | F03/F06 | Participantes, periodo, mercados, datos y elegibilidad | Seleccionar → V05; regla/escenario → V09 contextual; cambiar categoría |
| V05 | Talón | F04–F06 | Lista compartida de grupos, modo, stakes separados/conjunto, precio y retorno | Editar/quitar; cambiar modo explícito; revisar → V06; caja → V10 |
| V06 | Revisión y operación | F07 | Snapshot revisado y estado de envío | Confirmar → V07; volver; revisar cambio; comprobar intento desconocido |
| V07 | Recibo | F07/F11 | ID, aceptación o liquidación, cuota y dinero | Detalle → V09; Mis apuestas → V08; copiar recibo; ayuda |
| V08 | Mis apuestas | F08 | Open/Settled y filtros | Abrir ticket → V09; cambiar filtro; volver |
| V09 | Detalle de ticket / inspector | F06/F09–F11 | Condiciones, datos, reglas y estado monetario | Expandir condición; explorar supuesto; Cash Out → revisión propia; recibo → V07 |
| V10 | Caja y actividad | F13 | Disponible, reservas y movimientos | Depositar/retirar con revisión; abrir movimiento; límites → V12 |
| V11 | Cuenta y acceso | F12 | Perfil ficticio, sesión y verificación | Entrar demo; salir; preferencias; actividad → V10; juego seguro → V12 |
| V12 | Herramientas de juego seguro | F14 | Límites, consumo y consecuencias | Cambiar límite; confirmar aumento tras espera; pausa; exclusión → V13 |
| V13 | Cuenta cerrada y devolución | F12/F13/F14 | Cierre, devolución inicial, tickets pendientes y devoluciones posteriores | Ver estado administrativo/importes; ayuda; sin cuotas, directo, Cash Out o reactivación |
| V14 | Reservada, fuera de v1 | F15 archivado | Sin interfaz base | No implementar ruta, botón o chat |
| V15 | Marco de presentación | F16 | Estado de demo y escenario elegido | Cargar escenario; avanzar reloj pertinente; cambiar viewport; confirmar reinicio |
| V16 | Destino no encontrado | F16 | Recurso ausente sin datos de otra fixture | Volver a catálogo o Mis apuestas; no cargar un ticket distinto silenciosamente |

V01–V13/V15/V16 son superficies activas; V14 se conserva como ID reservado. D38 permite composición libre y no exige capturas por superficie.

## Reglas de navegación

[Navegación y móvil](navigation-and-mobile.md) fija cuatro destinos, tarea de talón y retorno con contexto; [contrato del talón](betslip-state-contract.md) fija propiedad y consumo de grupos. No interpretar el cambio de modo como creación de otro borrador independiente.

El fondo del panel conserva selección y posición. Cerrar restaura foco al control que lo abrió. El botón de atrás debe actuar sobre la superficie abierta antes de perder el evento, salvo navegación explícita. Un enlace directo requiere cargar una fixture compatible o V16.

V09 se compone dentro del espacio del ticket o como destino de detalle, no como cuarta columna obligatoria. En móvil solo hay una superficie modal activa; la ayuda usa navegación interna con volver. V09 usa el mismo modelo de condición desde evento, borrador o apuesta aceptada, pero identifica su contexto: hipótesis previa, observación en directo o liquidación. No usar botones de editar en un ticket ya aceptado.

V13 no comparte menú de cuotas con V11. V15 se distingue visualmente del producto; sus controles no quedan dentro del perfil del supuesto apostador.

## Controles con respuesta obligatoria

Favorito confirma cambio; cuota añade/quita selección; categoría filtra; stake recalcula; cambiar modo informa del tipo; continuar muestra revisión; confirmar muestra operación; operación muestra estado verificable; copiar muestra feedback; ayuda abre contenido relacionado; filtros indican vacío; cerrar devuelve contexto; cargar/reiniciar confirma reemplazo.

No se añaden iconos de notificaciones, streaming, promociones o compartir con otras personas si no existe un comportamiento definido. Compartir externamente no forma parte del alcance base.

## Prioridad de composición para Claude

Prioridad A: V04 evento, V05/V06 ticket y revisión, V09 inspector previo/directo, V07 recibo. Prioridad B: V01 home, V08 Mis apuestas y V10/V12 dinero/límites. Prioridad C: acceso y estados secundarios.

Cada superficie activa debe funcionar en móvil estrecho, móvil habitual y laptop. Claude fija composición y breakpoints al implementar; no se requiere captura por superficie ni copiar el benchmark.
