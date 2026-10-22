# De la evidencia a las decisiones y a su evaluación

22-10-2026 · Este documento explica criterios; no especifica cambios de implementación ni certifica lo que la app hace. El estado del producto procede del handoff de Claude.

## Cadena de razonamiento

Evidencia externa → problema posible en una tarea → hipótesis de diseño → decisión concreta → comprobación con usuarios. La existencia de un paper respalda una pregunta; no demuestra el último eslabón.

| Decisión del producto | Base pertinente | Hipótesis de Ternside | Qué medir o qué podría fallar |
| --- | --- | --- | --- |
| For you y Popular | B09/B10: efectos de amplitud dependientes de tarea; B11: divulgación progresiva | Dos entradas permiten orientación sin eliminar profundidad | Buscar un partido concreto, descubrir uno y cambiar de hub sin confusión. Medir éxito y rodeos, no número de apuestas |
| Grupos de mercados plegados y búsqueda | B10/B11; B04: información debe ser utilizable | Menos competencia visual inicial con acceso recuperable a lo demás | Hallabilidad de mercado poco frecuente; que el usuario sepa que existe antes de abrirlo |
| Estadísticas en dos capas | B04; B08 como límite a generalizar incapacidad | Lenguaje llano facilita una primera interpretación y la capa técnica conserva detalle | Pedir interpretar un dato de tenis y uno de fútbol; registrar exactitud, no solo preferencia |
| Ticket continuo y reglas por condición | Benchmark anterior de reglas divergentes; B04 sobre continuidad | Mantener condiciones y precio aceptados reduce la necesidad de reconstruir la apuesta | Seguir la misma selección entre revisión, directo y recibo; detectar confusión entre precio actual y aceptado |
| Explore outcomes | B07/B08: complejidad y comprensión dependen del tipo de tarea | Ejemplos de consecuencias ayudan más que un reglamento bien escrito por sí solo | Comparar casos con/sin herramienta manteniendo idéntica información y oportunidad de consulta |
| Match context separado de precio | B08: margen no necesariamente comprendido | Una explicación descriptiva evita presentar una predicción propia inexistente | Preguntar si las barras proceden de un modelo o de cuotas; probar que no se entiende como garantía |
| Retorno, stake y neto diferenciados | B05/B06: errores específicos ante incentivos | Explicitar el dinero de cada caso evita confundir recompensa, efectivo y devolución | Respuestas numéricas con cash, free bet, Cash Out y void |
| Promociones con ejemplo y condiciones materiales | B05/B06; B15/B16 | Una oferta puede evaluarse sin leer un reglamento extenso para descubrir su mecánica básica | Comprensión de elegibilidad, apuesta cualificante, caducidad y naturaleza del premio |
| Control de ofertas en home | B17 distingue esto de marketing directo | Permite ajustar exposición dentro de la app | Encontrar el control y explicar qué cambia; no prometer que equivale a desuscribirse de email/SMS |
| Límites accesibles y retiradas sin reversión | B18; marco anterior de cuenta y límites | Las acciones de control se pueden realizar sin competir con el recorrido comercial | Ruta hasta límites, confirmación y comprensión de esperas. No usar aumento de engagement como éxito |

Fuentes: [metaanálisis 2010](https://doi.org/10.1086/651235), [metaanálisis 2015](https://myscp.onlinelibrary.wiley.com/doi/abs/10.1016/j.jcps.2014.08.002), [NN/g](https://www.nngroup.com/articles/progressive-disclosure/), [UKGC/BIT](https://www.gamblingcommission.gov.uk/statistics-and-research/publication/exploring-consumer-views-on-informed-choice-in-gambling), [Newall](https://dspace.stir.ac.uk/bitstream/1893/25099/1/resubmission%20file%20ARaT.pdf), [Andersson/Nilsson](https://research.hhs.se/esploro/outputs/journalArticle/Do-bettors-correctly-perceive-odds-Three/991001480487306056), [ESRI](https://www.esri.ie/system/files/publications/RB202509_0.pdf), [Torrance et al.](https://link.springer.com/article/10.1007/s10899-026-10491-6). El [registro de fuentes](02-source-cards.md) conserva método y límites, incluidas las normas citadas.

## Lo que no tiene todavía un respaldo numérico específico

- **20 % visible:** heurística editorial, no resultado de analytics ni aplicación demostrada de Pareto. Tampoco significa retirar el 80 % de mercados.
- **Tres condiciones por builder o cuatro por acumulador:** límites de alcance del concepto. No se ha identificado una frontera empírica por la que tres sean seguras y cuatro peligrosas.
- **Predominio de fuentes grandes y balón/camiseta:** decisiones visuales y de jerarquía. No afirmar mejora de confianza, accesibilidad o rendimiento sin medición.
- **Personalización por intereses:** criterio de producto. No es un recomendador entrenado ni se ha medido precisión o satisfacción.
- **Más claridad = menor daño:** no establecido. Una explicación también podría aumentar confianza o facilitar más actividad. Medir comprensión y decisiones erróneas; no inferir efectos clínicos desde un test de interfaz.
- **Porcentaje móvil:** no se ha verificado una cuota actual de sportsbook GB/UE. B12 es una muestra australiana seleccionada y B13 es histórico. Desktop conserva prioridad por el objetivo de portfolio fijado por Javier; no necesita disfrazarse de conclusión de mercado.

## Revisión del plan de test, sin editarlo

El plan de Claude ya reconoce una muestra exploratoria, alterna orden y evita comparar una captura estática con una demo interactiva. Se mantiene como documento independiente; esta tanda no lo modifica.

**Dos puntos para la próxima revisión:**

1. «Costa no juega» y «abandono 2–1 con un tiro» no deben declararse de igual dificultad solo porque ambos produzcan un void. El segundo exige más reglas. Pilotarlos o analizarlos por separado; alternar el orden por sí solo no elimina esa diferencia. Para estudiar formato, preparar dos variantes con la misma estructura y distintas etiquetas/importes, o una comparación entre participantes con reconocimiento de sus límites.
2. El nuevo alcance promocional necesita una tarea específica. Con una sesión breve, sustituir una tarea secundaria o dedicar otra ronda; no añadir un catálogo de tareas que sobrecargue a los participantes.

## Tarea promocional propuesta

**Instrucción neutral:** «Tienes una free bet de £5 y esta selección a cuota 3.40. Antes de usarla, dime qué recibirías si gana, qué recibirías si pierde y si podrías retirar ahora los £5».

**Clave sintética, según la mecánica descrita en el plan:** si gana, £12 de retorno en efectivo (`5 × (3.40 − 1)`); si pierde, £0; los £5 promocionales no son efectivo retirable. Confirmar las reglas finales antes de usar la tarea. No llamar £17 al retorno de esta free bet.

Segunda pregunta: «La oferta dice apuesta £10 y recibe £5. ¿Qué tienes que arriesgar para conseguirla?». Esperado: reconocer el gasto/apuesta cualificante y que la recompensa no elimina el riesgo inicial.

Registrar respuesta exacta, ayuda utilizada, tiempo aproximado y seguridad declarada. Una persona muy segura que responde mal es un hallazgo distinto de una persona que reconoce que necesita consultar términos.

## Qué resultados publicar

Con 5–8 participantes: conteos con denominador, errores observados y citas consentidas, por tarea y versión. Conservar intento sin ayuda, intento con ayuda y aprendizaje del orden. No convertir diferencias pequeñas en porcentajes de mejora del mercado.

Si después se necesita una comparación cuantitativa, predefinir resultado principal, comparación equivalente, tamaño muestral y análisis. La demo de portfolio puede contar decisiones bien fundamentadas sin fingir un experimento de impacto.

## Precisión técnica al explicar cuotas y probabilidades

Estos son cálculos y criterios de representación, no resultados de usuarios. Para una cuota decimal `o`, `1/o` es la probabilidad de equilibrio del precio; no demuestra la probabilidad real del suceso. En un conjunto completo de resultados excluyentes, la suma de esos inversos puede superar 1. Ese exceso es el overround; no debe confundirse con beneficio realizado del operador.

Dividir cada inverso por la suma produce una **normalización proporcional**. No demuestra que el margen se reparta así en la realidad ni convierte el resultado en una predicción calibrada. La discusión de B07 sobre márgenes y B08 sobre su interpretación aconseja explicar el supuesto en Match context, sin afirmar «probabilidad verdadera».

Ejemplo propio, sintético: cuotas 1.80 / 3.60 / 4.50 → suma de inversos 105,56 %; overround 5,56 puntos porcentuales; reparto normalizado aproximado 52,63 % / 26,32 % / 21,05 %. Si cambia el snapshot de cuotas, cambia este reparto; el precio de un ticket aceptado no cambia por ello.

En un builder, la dependencia entre condiciones impide tratar una multiplicación de cuotas individuales como precio conjunto correcto por defecto. Usar las cotizaciones conjuntas archivadas del concepto. En una free bet con stake no devuelto, separar `importe promocional × (cuota − 1)` del retorno de una apuesta con dinero propio; las reglas finales deben resolver void y devolución del crédito.
