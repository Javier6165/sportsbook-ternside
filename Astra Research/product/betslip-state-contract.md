# Contrato del talón: selecciones, modos y envío

20-10-2026 · Propuesta propia, revisión 0.1. Complementa R02/R08 y F04–F07. No describe una implementación observada en todos los competidores. Su objetivo es impedir apuestas duplicadas y pérdidas de contexto en el handoff.

## Una lista compartida, dos formas de apostar

El talón conserva una sola lista de **grupos de borrador**, cada uno con ID estable. Un grupo simple contiene una selección. Un grupo Bet Builder contiene dos o tres condiciones del mismo evento, con precio conjunto. El editor de builder puede conservar temporalmente una condición; todavía no es un builder enviable.

Hay dos modos de envío: **Singles** y **Accumulator**. En Singles se colocan apuestas por separado; un builder también aparece aquí como una apuesta independiente, claramente rotulada **Bet Builder** y con sus condiciones. El nombre de la pestaña no convierte ese tipo en una simple en el modelo de dominio. Copy de apoyo: «Place each bet separately». No hay tercer tab monetario de builder ni «Place all».

Accumulator usa la misma lista; no crea copias de las selecciones. Requiere dos o tres grupos simples de eventos prepartido distintos y ningún builder. La base no permite seleccionar un subconjunto ocultando grupos incompatibles. Si hay un builder, se explica la restricción y se ofrece volver a Singles para revisarlo por separado, o quitarlo explícitamente. No se excluye de la combinada en silencio.

## Importes y revisiones

Cada grupo tiene su propio stake para envío separado. La combinada tiene otro campo de stake, inicialmente vacío. Cambiar de modo conserva ambos tipos de entrada, sin sumarlos, copiarlos o enviarlos. Cambiar selecciones, tipo, stake, fase o versión de cuota invalida la revisión monetaria afectada.

Ejemplo: Home de football-01 con £10 y Home de football-02 con £5. Pasar a Accumulator conserva esas entradas, pero exige introducir el stake conjunto; £15 no aparece como apuesta automática. Si se escribe £8 y se vuelve a Singles, siguen £10/£5. Regresar a Accumulator conserva £8 y exige validar de nuevo el contenido antes de enviar.

## Qué se consume al aceptar

| Operación confirmada | Cambio en borrador | Qué permanece |
| --- | --- | --- |
| Simple aceptada | Quitar solo su grupo y stake | Los otros grupos y sus importes; stake de combinada conservado como entrada, con elegibilidad/revisión recalculadas |
| Builder aceptado | Quitar solo ese grupo y stake | Otros grupos independientes |
| Combinada aceptada | Quitar todos sus grupos componentes y sus stakes separados; vaciar stake conjunto | Recibo aceptado; no queda una copia de esas apuestas en Singles |
| Rechazo | No consumir grupos | Entradas editables y motivo; nuevo intento explícito |
| Respuesta desconocida | Congelar snapshot del intento; no consumirlo todavía | Estado «Checking your bet», ID original y borrador; sin nuevas operaciones monetarias |

Recuperar aceptación consume una vez lo correspondiente; recuperar rechazo no consume nada. El recibo conserva el snapshot original aunque el borrador cambie después. Un Cash Out o una liquidación nunca vuelve a insertar grupos en el talón.

## Builder sin duplicaciones accidentales

Entrar por la pestaña Builder abre su editor explícito. Editar un grupo existente conserva su ID y lo actualiza en el mismo sitio; cerrar el editor mantiene el borrador. Añadir/quitar condiciones dentro del editor no crea nuevas filas de apuestas independientes. Con una condición, «Place single» exige revisar la conversión; no se envía como builder ni hereda una revisión anterior.

Las simples ya seleccionadas fuera del editor no se fusionan automáticamente. «Review as builder», disponible ante selecciones compatibles del mismo evento, abre una vista previa y una acción explícita «Use as Bet Builder»: reemplaza los grupos seleccionados por uno, muestra qué entradas reemplaza y deja el nuevo stake vacío. Cancelar conserva los originales. No suma ni hereda sus importes. Esta conversión invalida revisiones anteriores.

Una simple Home y un builder que incluye Home pueden existir como apuestas independientes si se añaden explícitamente por separado. Sus tipos, importes y retornos se muestran por separado; antes de revisar se indica «Home also appears in another bet». No es una copia creada al cambiar de modo. Quitar Home del builder no elimina la simple y viceversa. Las restricciones Home/Away y Over/Under de R04 se aplican dentro de cada builder; no prohíben dos simples independientes.

## Contador y vuelta al contexto

La entrada cerrada dice «Betslip (N)»: N es el número de grupos, no condiciones, stakes ni apuestas aceptadas. Dos grupos simples → 2; un builder de tres condiciones → 1. En Accumulator, el encabezado interno aclara «1 accumulator · 2 selections»; el contador exterior sigue contando grupos para evitar cambios arbitrarios al alternar modo. Con un editor incompleto se señala «Draft» y no un retorno ficticio.

Cerrar, cambiar viewport o volver desde caja preserva grupos/importes. Revalida precios y restricciones antes de enviar. [Navegación y móvil](navigation-and-mobile.md). Cargar otro escenario es distinto: F16 confirma reemplazo y restaura todo su estado.

## Comprobación pendiente

C45–C48 especifican alternancia, consumo tras aceptación, edición y conversión, con estados esperados. Son casos documentales. Sigue pendiente comprobar si las etiquetas Singles/Accumulator y el contador se entienden en pantallas reales; si no, se revisará el copy sin duplicar el modelo.
