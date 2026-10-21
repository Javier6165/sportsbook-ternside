# Plan de comprobación visual y de comprensión

Versión 0.2. No describe un estudio ya realizado. Su función es evitar que el siguiente paso consista solo en embellecer pantallas.

## Primera pasada: comprobar composiciones

Tras definir la identidad en la fase de branding, componer evento, ticket/revisión, inspector previo, ticket en directo y recibo con esa marca aplicada. Después home, Mis apuestas, caja y límites. Para cada una: móvil estrecho, móvil habitual y laptop. Usar datos de las fixtures y estados reales de las specs.

Revisar nombres largos, tres condiciones, cambio de cuota, error de stake, datos retrasados y void. El texto y las cifras deben caber sin esconder el motivo de la operación. Comprobar la identidad de trabajo en estas composiciones antes de cerrar sus recursos finales. La entrega final usará una identidad elegida y recursos canónicos; no una mezcla de alternativas.

## Segunda pasada: recorrer escenarios

Los 44 casos de `demo/scenario-cases.json` son contratos de comportamiento, no tests de aplicación ejecutados. Al tener un prototipo interactivo o la demo, cada caso registra resultado, captura y defecto. No basta con que una captura final coincida si el recorrido duplica dinero o pierde contexto.

## Tercera pasada: estudio exploratorio si hay participantes

Propuesta: cinco o seis adultos que conozcan apuestas deportivas, con mezcla de uso ocasional y habitual. Es una ronda cualitativa para descubrir problemas, sin inferencia estadística sobre el mercado. No incluir menores ni pedir apuestas o depósitos reales.

Usar información de prueba, evitar recoger datos financieros y permitir abandonar. La participación no requiere revelar historial de pérdidas o situación personal.

| Tarea | Qué se observa | Respuesta o comportamiento esperado |
| --- | --- | --- |
| Encontrar el partido de un equipo homónimo | Contexto utilizado y errores de selección | Elegir evento correcto sin selección automática |
| Distinguir dos simples de una combinada | Número de apuestas y dinero comprometido | Entender stakes independientes frente a stake único |
| Revisar un cambio 3.40 → 3.20 con £10 | Precio y retorno que cree aceptar | Explicar £34 → £32 antes de confirmar |
| Explicar «jugador no participa» | Comprensión de regla y efecto en builder | Identificar void y resultado condicional restante |
| Interpretar contador corregido | Confianza atribuida al dato y estado | Distinguir dato provisional de liquidación |
| Interpretar Cash Out de £8 con stake £10 | Confusión entre retorno y beneficio | Reconocer pérdida neta de £2 |
| Explicar depósito restante £5 con saldo £100 | Confusión entre depósito y apuesta | Entender que son magnitudes distintas |
| Recuperarse de envío desconocido | Intento de repetir y comprensión del mensaje | Buscar estado de la operación, no asumir rechazo |

## Comparación del inspector

Probar tareas equivalentes con explicación convencional y con inspector, alternando el orden entre participantes. No mostrar primero un caso ya resuelto que revele la respuesta de la segunda variante.

Medidas: respuestas correctas sobre periodo, condición, dinero y estado; errores críticos; ayuda necesaria; comprensión expresada con sus palabras. El tiempo orienta fricción, pero una tarea de revisión no es mejor solo por ser más rápida.

No utilizar incremento de stake, frecuencia o deseo de apostar como medida de éxito. Preguntar preferencia después de las tareas, separada del rendimiento observado.

## Criterios para iterar o recortar

Si se interpreta el inspector como predicción, revisar lenguaje y jerarquía. Si añade lectura sin resolver errores, reducirlo o hacerlo más contextual. Si asistencia y búsqueda producen lo mismo, priorizar búsqueda. Si la vista móvil embebida resta espacio y dificulta explorar, ofrecer una alternativa de presentación más simple.

Los resultados se registrarán con evidencia de tareas, sin inventar porcentajes a partir de una muestra pequeña ni convertir opiniones en afirmaciones comerciales.

## Revisión propia obligatoria

Antes de componer, revisar [CR01–CR14](11-critical-review.md) y el [protocolo de calidad](../project/quality-review-protocol.md). Después, primera inspección conjunta móvil/laptop, corrección en lote y confirmación de escenas afectadas con los mismos datos. Una iteración adicional requiere un defecto concreto. Registrar antes/después reales y los puntos que una imagen no puede comprobar.

Para comparar inspector y ayuda convencional: ambas variantes contienen la misma regla y los mismos importes; una no puede omitir información esencial para favorecer la otra. La comparación evalúa presentación y comprensión, no disponer de una respuesta frente a no tener ninguna. Añadir una tarea de pérdida hipotética ya determinada (C37) y una normal sin excepciones para detectar coste innecesario. No poner cifras aritméticamente distintas entre variantes.
