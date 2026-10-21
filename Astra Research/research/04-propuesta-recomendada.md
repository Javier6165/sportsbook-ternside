# Propuesta recomendada: un sportsbook que hace legible cada apuesta

**Estado: dirección base de investigación tras la instrucción de continuar.** «Sportsbook contextual» es una etiqueta de trabajo, no un nombre de marca. Ninguna feature está todavía validada con usuarios. La segunda tanda concreta el alcance en `product/` y `flows/`; este documento conserva el razonamiento conceptual inicial.

## Tesis de producto

Un sportsbook de cuota fija con todas sus convenciones esenciales y una representación consistente de la apuesta: qué has elegido, bajo qué condiciones, qué está ocurriendo y cómo se determina el resultado.

El diferenciador visible sería un **ticket visual que acompaña todo el recorrido**. Debe sentirse como una evolución del talón habitual y de Mis apuestas. Su valor se demuestra con una apuesta concreta y sus cambios; no necesita una landing que explique una nueva categoría.

El benchmark muestra que ya existen builders, asistentes, estadísticas y seguimiento. La aportación propuesta es coordinar estas piezas con una jerarquía y un lenguaje consistentes. [Benchmark y límites](02-benchmark.md).

El competidor más cercano identificado es Sky Bet, que ya describe seguimiento de cada selección de BuildABet. La novedad del caso no puede ser simplemente mostrar progreso. La exploración se centrará en un **inspector de condiciones y escenarios** que también permita entender la apuesta antes de confirmarla y explicar su liquidación después. Esa combinación es una hipótesis de diferenciación, no una exclusividad comprobada. [S35](https://m.skybet.com/lp/buildabet/globals).

## Usuario de trabajo propuesto

Adulto aficionado al deporte, con experiencia ocasional o habitual en apuestas, que conoce simples y combinadas y no trabaja como trader profesional. Quiere encontrar su mercado, revisar lo que está aceptando y seguir el resultado sin reconstruir las reglas.

Es una hipótesis de foco, no una persona derivada de entrevistas. Los usuarios nuevos pueden beneficiarse de explicaciones opcionales, pero el catálogo y las cuotas siguen siendo operables con rapidez. Los usuarios profesionales tendrían otras prioridades —precio, límites, ejecución— que no se cubrirán con profundidad en esta demo.

## Tres capacidades conectadas

### 1. Encontrar y seleccionar

Catálogo convencional por deporte, competición y evento, con búsqueda por equipos, jugadores y mercados. En la página del partido, categorías compactas y acceso a mercados completos. La explicación de una selección aparece al pedirla o cuando la condición requiere contexto.

Ejemplo: «Más de 2,5 goles» mantiene su nombre habitual y puede expandirse a «Necesitas al menos 3 goles entre ambos equipos en tiempo reglamentario, incluido el añadido». La prórroga se explica como exclusión para ese mercado concreto, no como regla de todos los mercados.

### 2. Revisar un ticket comprensible

El talón distingue selecciones simples, combinadas entre eventos y Bet Builder. Cada selección conserva evento, sujeto, mercado, periodo y cuota. Un builder deja claro que deben cumplirse todas sus condiciones.

Al revisar una apuesta de dinero simulado, se muestran importe, retorno potencial bruto y beneficio potencial separados. Una cuota decimal sintética de 3,40 con £10 implica £34 de retorno potencial, incluidos los £10 iniciales, y £24 de beneficio potencial. La aritmética de este ejemplo no incluye promociones.

El precio de un builder se tratará como una cotización conjunta simulada. No se calculará multiplicando automáticamente las cuotas de condiciones correlacionadas. El modelo definitivo se documentará por flow. Como antecedente de dominio, bet365 explica que la cotización considera la relación entre condiciones. [S02](https://help.bet365.com/s/en-gb/sports/bet-builder).

Una acción opcional «Ver escenarios» permitiría comprobar el significado de las reglas con supuestos acotados: «¿Qué pasa si empatan al minuto 90?» o «¿Qué pasa si el jugador no participa?». La respuesta señalaría las condiciones afectadas y el tratamiento previsto según las reglas elegidas para el concepto. No estimaría la probabilidad del escenario ni propondría añadir apuestas. Las variantes de no participación y anulación requieren investigación detallada antes de dibujar su resultado; no hay una respuesta universal entre operadores.

Cuando una selección entra en conflicto, la interfaz explica el conflicto y permite corregirlo antes de confirmar. Si cambia la cuota, se muestra la anterior, la nueva y el impacto en el retorno antes de aceptar el cambio.

### 3. Seguir y entender el resultado

Mis apuestas reutiliza la misma estructura del ticket. El detalle en directo relaciona cada condición con datos relevantes del partido y diferencia observación provisional de liquidación oficial.

Ejemplo completamente ficticio, no una recomendación de apuesta:

| Condición de un builder | Estado al minuto 68, marcador 2–1 | Mensaje posible |
| --- | --- | --- |
| Atlético Norte gana en tiempo reglamentario | El local va por delante; resultado abierto | «Va ganando 2–1. Debe mantener la victoria hasta el final» |
| Más de 2,5 goles | El marcador suma 3; pendiente de confirmación y reglas | «Umbral alcanzado según el marcador actual» |
| Daniel Costa, 2+ tiros a puerta | El feed simulado registra 1 | «1 de 2 tiros a puerta registrados» |

El ticket completo continúa abierto. «Umbral alcanzado» no equivale a saldo abonado. La interfaz contempla correcciones de datos, incidencias y el estado pendiente de liquidación.

No habrá una barra «67% completado» que pueda confundirse con una probabilidad de ganar. Un contador de estadísticas representa datos del partido, no seguridad de cobro.

Al liquidarse, el recibo explica qué condición ganó, perdió o fue anulada y qué pasó con el importe. Cash Out, cuando exista una oferta, se presenta como una operación distinta y con su propia confirmación.

## Papel opcional de la IA

Una entrada discreta junto a la búsqueda podría aceptar «Encuentra los tiros a puerta de Daniel Costa en el partido de esta noche». Devuelve el partido y mercados concretos para revisar, sin sustituir la navegación.

Ante «gana el Madrid», desambigua equipo, evento y periodo si hace falta. Ante una petición sin mercado disponible, explica que no hay resultado. Si el dato no está actualizado, lo indica. La respuesta no inventa una cuota.

Para una demo futura bastaría simular un conjunto explícito de peticiones y alternativas, con una salida honesta fuera de cobertura. La elección tecnológica llegará después.

La asistencia no elige automáticamente importe, no envía apuestas y no presenta certeza de ganar. Una petición de recuperar pérdidas conduce a ayuda y controles, no a una combinada. Es una política propuesta del producto, coherente con las restricciones británicas de diseño responsable, que deberá concretarse por flow. [S23](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-14-responsible-product-design).

## Cómo debe verse en escritorio

Navegación de deportes y competiciones; catálogo o evento central; panel de ticket/detalle contextual que permanezca disponible. El espacio adicional permite comparar y revisar sin abandonar el evento.

La pieza central seguirá teniendo filas de mercados y botones de cuotas. La jerarquía visual puede ser limpia, pero debe conservar suficiente densidad para reconocer el producto y operar sobre él. El criterio visual se explorará con páginas de verdad, no con una portada aislada.

## Cómo debe funcionar en móvil

Evento y mercados ocupan el contenido principal. El acceso persistente al ticket indica selecciones e importe cuando corresponda y abre una superficie de revisión. Las explicaciones se muestran en expansión contextual o en un panel sin perder el estado.

El seguimiento conserva orden y lenguaje del ticket de escritorio. No se trasladan tres columnas a una columna interminable. Los detalles se distribuyen por prioridad y las acciones principales deben seguir siendo alcanzables.

El eventual selector móvil/escritorio pertenece a la presentación de la demo. Debe conservar la apuesta y la ruta. Una vista enmarcada dentro del escritorio no demuestra por sí sola que el responsive sea correcto.

## Recorrido de demostración propuesto

1. Entrar como usuario de demostración con saldo ficticio e identificación ya verificada.
2. Encontrar un partido desde el catálogo o búsqueda.
3. Crear una simple y después explorar un builder breve con condiciones distintas.
4. Abrir una explicación contextual, comprobar un escenario hipotético y resolver un conflicto de selección.
5. Revisar importe y retorno; responder a un cambio simulado de cuota.
6. Confirmar y recibir un recibo coherente.
7. Abrir el mismo ticket en directo y ver una suspensión temporal.
8. Avanzar mediante controles de escenario de la demo hasta liquidación o Cash Out.
9. Consultar actividad y límites; reiniciar el escenario para el siguiente visitante.

El control de escenarios será visible como herramienta de demostración. No fingirá un feed deportivo real. Los recorridos alternativos deberán funcionar por separado; una visita libre no puede quedar atrapada porque no siguió la secuencia prevista.

## Alcance recomendado para la siguiente etapa

Profundidad principal en fútbol: descubrimiento, evento, simple, combinada, builder, ticket, Mis apuestas y seguimiento. Tenis y baloncesto pueden demostrar navegación y simples con reglas acotadas. Caja y cuenta deben responder con estados simulados bien definidos. Su profundidad se acordará al cerrar flows.

Exchange, casino, red social, streaming real, motor real de cuotas e IA autónoma no forman parte del núcleo recomendado. Cualquier sección visible que se conserve en la demo tendrá una función definida o una explicación clara de su alcance.

## Cómo decidir si funciona antes de implementar

Probar visualmente seis composiciones: home, evento, builder, revisión del ticket, ticket en directo y recibo liquidado, en móvil y escritorio. Deben aguantar selecciones largas, estados vacíos, errores y cambios de cuota.

Después, un estudio exploratorio pequeño con adultos que conozcan sportsbook podría comparar catálogo y ticket con tareas equivalentes. Mediríamos selección correcta, comprensión de periodo e importe, distinción entre provisional y liquidado y capacidad de corregir errores. Ni más apuestas ni mayor gasto serían criterios de éxito de esta intervención. No se ha realizado ese estudio.

La dirección se reconsideraría si la capa contextual estorba a usuarios habituales, si parece un tutorial permanente o si los indicadores de directo se interpretan como probabilidades de ganar.
