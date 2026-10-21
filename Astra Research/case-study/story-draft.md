# Ternside — borrador editorial del caso

20-10-2026 · Material preparado antes de implementación. No presentarlo como proyecto comercial lanzado o evaluación con participantes.

## Versión breve para portfolio

Ternside es un concepto independiente de sportsbook europeo. La pregunta de diseño fue cómo mantener comprensibles condiciones, importes y cambios de una apuesta durante todo su recorrido, conservando los patrones habituales de la categoría.

La investigación documental encontró precedentes de IA y seguimiento por selección, así que la propuesta se centró en continuidad y explicación contextual. También mostró que un mismo Bet Builder puede tener diferentes consecuencias al anularse una selección. La demo propone conservar la regla y el precio aceptados y explicar el resultado en el mismo ticket, antes y después del partido.

El trabajo define navegación, tipos de apuesta, directo, dinero, recuperación y herramientas de juego seguro. Ternside tiene una identidad propia y datos ficticios. El handoff permite libertad de composición visual, con reglas, estados y criterios de aceptación concretos. La implementación y sus resultados se añadirán cuando existan.

## Estructura de la versión extensa

1. Objetivo de portfolio y rol. Concepto independiente, sin encargo de operador ni usuarios reclutados.
2. Método y límites. Documentación primaria, observación web pública de escritorio, contraste de mercados, cifras externas y ausencia de sesiones móviles/autenticadas.
3. Cambio de dirección. De IA como posibilidad a ticket contextual; precedentes que limitaron la originalidad defendible.
4. Decisiones que muestran criterio. Builder con precio conjunto/subconjuntos, regla de participación, provisional vs liquidado, respuesta desconocida y saldo, exclusión con retornos posteriores.
5. Iteración propia. Ventanas móviles de depósito y DST; HALF_UP; grupos compartidos para evitar copias. Ejemplo antes/después de oferta inventada por generación, sin presentarlo como estudio de usabilidad.
6. Branding. Filtro de nombres y similitudes, elección Ternside para concepto, dirección y recursos. Disponibilidad comercial no certificada.
7. Handoff e implementación. Javier delegó la composición a Claude; distinguir especificación del producto, generación de código y decisiones posteriores reales de diseño.
8. Evaluación. Qué comprobó el dossier y qué comprobó la app cuando exista, por versión/entorno. Pruebas con personas solo si realmente se realizan.

## Cifras utilizables

Tomar cifras externas de [metrics-register.md](metrics-register.md), manteniendo periodo/unidad/geografía/base. Ejemplos: GGY de apuestas remotas GB y reparto GGR prepartido/live de miembros EGBA. No son usuarios entrevistados, volumen de apuestas ni impacto de Ternside.

Los recuentos propios son cobertura: 48 casos y 50 caminos con expectativas de saldo en este corte. No escribir «redujimos errores» o «mejoramos comprensión» a partir de esos números. La implementación futura debe dejar trazabilidad entre casos y resultados ejecutados.

## Completar después de Claude

URL o build local, versión/fecha, pantallas reales que se decida mostrar en portfolio, informe de pruebas, defectos encontrados/corregidos y papel efectivo de Javier. No completar una sección de impacto con estimaciones, imágenes que parezcan un producto lanzado o testimonios inventados.
