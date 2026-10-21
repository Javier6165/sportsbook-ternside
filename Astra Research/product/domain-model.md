# Modelo de dominio y vocabulario compartido

v0.2 · Especificación conceptual, independiente de tecnología. Los nombres de campos explican necesidades de datos; no son código de aplicación.

## Objetos y límites

| Objeto | Información mínima | Distinción necesaria |
| --- | --- | --- |
| Deporte y competición | ID, nombre y orden | Una competición contiene eventos; no precios |
| Evento | ID, participantes, local/visitante explícitos, inicio, periodo, estado | El reloj del evento difiere del reloj de la sesión |
| Mercado | ID, evento, tipo, periodo, línea y regla versionada | «Gana» no identifica por sí solo un mercado |
| Selección | ID, mercado, participante o resultado | La cuota puede cambiar sin cambiar la identidad de la selección |
| Cotización | ID, selección o conjunto de condiciones, valor, versión, disponibilidad | No es una apuesta aceptada |
| Grupo de borrador | ID estable, tipo, selección/condiciones, stake individual, cotización | Editar builder actualiza el grupo; no crea una copia |
| Borrador de ticket | Lista única de grupos, modo activo, stake de combinada y revisión | Editable; no compromete dinero ni duplica grupos al cambiar modo |
| Solicitud de apuesta | ID de operación, contenido y estado de respuesta | Puede tener resultado desconocido para el cliente |
| Apuesta aceptada | ID de recibo, cuota y reglas aceptadas, importe, fecha | No sigue la cuota pública actual |
| Condición | Regla, observaciones de partido y resultado oficial | Un umbral visual alcanzado no acredita saldo |
| Oferta de Cash Out | ID, apuesta, importe, versión y disponibilidad | Puede caducar o dejar de estar disponible |
| Liquidación | ID, resultado, motivo, fecha, retorno total reconocido, versión y versión sustituida | La versión vigente se comparte entre lista, recibo y detalle; ajustes por diferencia, con historial conservado |
| Devolución por exclusión | ID, origen, importe reservado, estado y apuesta vinculada si procede | Puede haber devolución inicial y posteriores sin reabrir la cuenta de juego |
| Movimiento | ID, operación origen, importe con signo y estado | Solo un movimiento confirmado altera el saldo disponible |
| Restricción de cuenta | Tipo, vigencia y acciones afectadas | Un límite de depósito no equivale a un límite de stake |
| Escenario de presentación | ID, estado inicial y transiciones permitidas | Está fuera de la interfaz del supuesto apostador |

## Estados independientes

**Evento:** programado → directo → finalizado. Puede pasar por interrumpido, aplazado o abandonado. «Finalizado» no implica que todos los mercados ya estén liquidados.

**Mercado:** abierto / suspendido / cerrado. La suspensión impide nuevas operaciones sobre el mercado afectado; no borra apuestas aceptadas.

**Datos:** actualizados / con retraso / no disponibles. Un fallo de estadísticas no debe poner contadores a cero ni convertir una selección en perdedora.

**Solicitud de apuesta:** preparada → enviando → aceptada o rechazada. Si se pierde la respuesta: comprobando resultado. No existe el paso «timeout → automáticamente rechazada».

**Apuesta aceptada:** abierta → pendiente de liquidación → ganada, perdida o anulada; también puede cerrarse mediante Cash Out confirmado. Para una combinada, una condición perdida puede determinar el resultado aunque otros eventos sigan; el recibo debe conservar sus estados. En el escenario base de builder se espera la confirmación del conjunto y sus anulaciones antes de liquidar. Una corrección oficial posterior añade una versión y ajuste; conserva la anterior como historial, sin restaurarla al recibir mensajes antiguos.

**Cuenta excluida:** el juego permanece cerrado aunque haya tickets aceptados pendientes. Cada retorno posterior genera una devolución administrativa; no acceso a Mis apuestas en una sesión de juego. Las variantes se detallan en [excepciones](../research/09-lifecycle-edge-cases.md).

**Condición en directo:** pendiente / favorable ahora / umbral alcanzado provisionalmente / no alcanzable según datos actuales. Separado del resultado oficial ganada / perdida / anulada. No sumar estados como si fueran probabilidades.

El [contrato del talón](betslip-state-contract.md) separa grupos compartidos, importes y snapshot enviado. Aceptación consume los grupos del intento; rechazo no los consume y respuesta desconocida bloquea el intento hasta reconciliarlo. La pestaña Singles puede mostrar un grupo Bet Builder como apuesta separada sin cambiar su tipo de dominio.

## Snapshot de aceptación

La apuesta aceptada conserva IDs, nombres legibles, periodo, línea, importe, precio decimal exacto, regla, revisión documental y fecha. Un builder conserva además las cotizaciones necesarias para sus subconjuntos válidos si después se anula una condición. El snapshot no se reconstruye consultando cuotas actuales.

La cotización visual puede redondearse para leerla, pero los cálculos usan el valor aceptado. En esta demo los precios de las tablas se fijan con dos decimales, para evitar una falsa precisión.

## Vocabulario para interfaz en inglés

| Concepto | Etiqueta de trabajo | Evitar |
| --- | --- | --- |
| Talón editable | Betslip | Confundirlo con una apuesta enviada |
| Importe comprometido | Stake | «Investment» o «savings» |
| Retorno bruto | Potential return — includes stake | «Profit» para un importe que incluye stake |
| Beneficio neto | Potential profit | Promesa de ingreso garantizado |
| Explicación de reglas | How this bet works | Afirmar predicción o consejo |
| Supuesto del inspector | Explore outcomes | Presentarlo como simulación de probabilidad |
| Liquidación sin confirmar | Awaiting settlement | Mostrar «Won» y abonar dinero anticipadamente |
| Selección anulada | Void — selection removed | Tratarla como condición ganada a la cuota original |
| Datos con retraso | Stats delayed | Cuenta atrás arbitraria hacia una recuperación no conocida |
| Cash Out | Cash Out | «Withdraw»; son operaciones diferentes |
| Retirada de saldo | Withdraw funds | Cancelar una apuesta abierta |

Las etiquetas son borradores para las pruebas visuales. No deben mezclarse libremente con traducciones que cambien el significado contable.

## Referencias de dominio

Tipos de apuesta: [S47](https://support.skybet.com/app/answers/detail/bet-types). Aceptación frente a liquidación y retrasos: [S51](https://support.skybet.com/app/answers/detail/bet-settlement-policy). Reglas de periodo y variantes deportivas: [S39](https://support.betfair.com/app/answers/detail/a_id/10555/). Estas referencias orientan distinciones; los estados y el contrato anteriores son decisiones de diseño de la demo.

## Precisiones de revisión crítica

Cotización incluye fase/snapshot de oferta. Los precios prepartido no siguen disponibles por el mero hecho de conservarse en un borrador. [Oferta live](live-offer-contract.md). En combinadas mostrar el producto exacto de precios aceptados hasta seis decimales; redondear una vez el retorno final según R01.

Depósito confirmado incluye ID, importe, fecha UTC y estado; el margen móvil se deriva de esos registros. El reloj de cuenta es independiente del partido y permite comprobar bordes temporales. Los límites precargados se identifican como previamente elegidos por el personaje ficticio.
