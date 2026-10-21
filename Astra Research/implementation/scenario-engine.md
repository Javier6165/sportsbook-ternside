# Escenarios, presentación y sesión

SIM-01 · Especificación para implementar; no motor ya escrito.

## Estado inicial

Entrada libre, cuenta ficticia verificada, £100 disponibles, historial void existente, talón vacío y fixtures prepartido. Cuenta: 20-10-2026 12:00 UTC; evento: 18:00 UTC, antes del inicio. Usar fechas de fixture; el día real de visita no modifica el catálogo. El usuario puede navegar y apostar con sus propios importes válidos; las cifras de casos son setups de prueba, no botones de cantidades recomendadas.

## Demo controls

Panel externo al producto, rotulado «Demo controls», con selector de escenario, control de avance permitido y Reset. Mostrar qué reemplaza. Cancelar preserva sesión; confirmar restaura todos los datos del escenario, incluidos restricciones, relojes, ledger y resultados simulados de operaciones. No un botón de reactivar cuenta dentro de Account.

Exponer ocho escenas curadas, mapeadas a los casos ya especificados:

| Escena | Estado inicial y acciones | Referencias |
| --- | --- | --- |
| Pre-match exploration | Base; construir y enviar libremente simples/builder/acca válidos | C01–C08, C22, C38, C44–C48 |
| Price change | Builder £10 revisado a 3.40; «Change quote» aplica qv2 3.20 antes de aceptar | C07 |
| Checking your bet | Envío £10 con respuesta desconocida; resolver el mismo ID como accepted o rejected en ramas independientes | C09/C10 |
| Live tracking | Builder aceptado £10; entrar live-68 y avanzar por live-72-before-correction y live-72-corrected; oferta live sincronizada | C11/C28/C42/C43 |
| Player does not take part | Builder aceptado; resultado oficial Home+Over ganadores y jugador sin participación; liquidar £27 | C05 |
| Cash Out | Builder aceptado £10, disponible £90, oferta £8; revisión/cierre o cambio de oferta | C12–C14 |
| Money and limits | Cargar C15, C16, C39 o C40 por nombre; avanzar reloj de cuenta solo donde está definido | Casos de caja/límites |
| Exceptions | Subselector de abandono, corrección y exclusión con abiertas/desconocidas/devolución rechazada | C29–C36 |

Las ocho entradas son una agrupación de presentación, no ocho casos nuevos ni una obligación de ocho páginas. Los 48 casos quedan accesibles para las pruebas automatizadas como estados/acciones identificados, sin poblar la interfaz normal con 48 botones. Cada rama parte de su propio setup.

## Compilación de setups

Claude convierte `fixtures.json` y las precondiciones/acciones de `scenario-cases.json` en setups tipados. Reusar IDs de evento, condición y cotización; añadir solo IDs de borrador/operación/recibo/movimiento necesarios. Un setup de apuesta ya aceptada debe incluir su débito, snapshot/subconjuntos y ledger conciliado, además del recibo. No mostrar saldo £100 si el setup presupone stake £10 ya debitado, salvo apertura explícita distinta del caso.

Los strings `setup` son instrucciones legibles, no un lenguaje a evaluar con eval ni reglas inferidas con un LLM. Implementar adaptadores explícitos por familia/caso, con validación de apertura y resultado esperado. Si hay una ambigüedad de presentación, decidirla; si contradice dinero o reglas, resolverla antes de afirmar cobertura.

La escena live usa un **builder ya aceptado**. Empezar football-01 sin nuevo stake en live-68 no acepta automáticamente el viejo borrador prepartido; C43 lo bloquea. Nuevas apuestas live solo simples 1X2 a los precios del snapshot. Los precios de qv1 conservados en recibos no son botones disponibles de mercado.

## Avance permitido y restricciones

No interpolar precios o inventar partidos, estadísticas y variantes. Los snapshots especifican lo que se conoce; una corrección cambia observación, no un pago confirmado. Resultados oficiales son otra transición. Cumplir R05/R06 antes de liquidar.

Exclusión tiene prioridad de cierre aun con operación desconocida: reconciliar después antes de calcular devolución. Correcciones posteriores solo con fondos suficientes y sin fondos ya devueltos por exclusión/Cash Out erróneo. Si una sesión libre no cumple precondiciones, ofrecer cargar el caso independiente con confirmación; no manipular saldo para que encaje.

## Selector de vista incluido

Desktop: «Full» y «Mobile» en el marco de presentación, más el mismo panel de escenarios. Full usa el espacio disponible. Mobile contiene **el mismo árbol/store** a anchura de layout 390 y altura de trabajo 844; overflow si la ventana no lo admite. Usar adaptación por contenedor para que nav, talón y grids respondan a esa anchura real. No transformar con scale una pantalla desktop, montar otra sesión, abrir iframe independiente ni volver a cargar datos.

En pantallas estrechas usar responsive real y ocultar el selector redundante. Cambiar vista preserva ruta, grupos/stakes, operación, saldo y restricciones. No conservar un focus target que ya no existe: trasladar foco a su equivalente/encabezado. Comprobar también al estrechar la ventana fuera del selector; la preview no sustituye responsive real. La colocación y estilo del marco son libres.

## Asistencia

F15/V14 queda fuera de v1. No botón de chat, proveedor LLM, key ni promesa de «AI-native». Búsqueda convencional F02 e inspector F06 permanecen. El research de IA se conserva como alternativa estudiada; no una tarea pendiente para que Claude amplíe la demo.
