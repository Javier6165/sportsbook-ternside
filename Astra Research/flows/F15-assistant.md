# F15 — Asistencia por intención, módulo opcional

Estado: ARCHIVADO / FUERA DE V1 por D40. No implementar ruta, botón, chat o servicio. Los cuatro criterios se conservan para trazabilidad, no forman parte de la aceptación activa. La búsqueda F02 y el inspector F06 siguen activos. Lo siguiente documenta una alternativa estudiada.

## Referencias y decisión

D: AceAI documenta búsqueda de estadísticas y preparación de selecciones con decisiones del usuario [S18](https://www.fanduel.com/about/news/meet-aceai-fanduel-s-ai-powered-sports-betting-assistant). Bet Mentor ofrece otro tipo de creación asistida [S10](https://support.betano.cz/hc/cs/articles/32469741819933-Jak-mohu-pou%C5%BE%C3%ADvat-funkci-Bet-Mentor). Su existencia no prueba utilidad de este módulo.

Decisión: asistencia para localizar, desambiguar y explicar. Respuesta con tarjeta de evento/mercado o acceso a regla. No seleccionar importe, enviar apuestas, emitir probabilidades propias o proponer recuperación de pérdidas. La demo puede resolver un catálogo de intenciones sin servicio generativo real; se decide en fase técnica.

## Recorrido y estados

Petición → reconocer intención → desambiguar si hace falta → mostrar resultado revisable → abrir mercado o regla. Añadir una selección requiere acción explícita sobre resultado disponible, con la misma validación del catálogo.

| Intención / estado | Respuesta |
| --- | --- |
| «Player 2+ shots on target tonight» | Encontrar jugador y evento; pedir precisión si hay más de uno |
| «What if he does not play?» | Abrir regla del ticket seleccionado; pedir cuál si hay varios |
| Mercado inexistente | Decir que no está disponible; no fabricar cuota |
| Petición fuera de cobertura | Explicar alcance y ofrecer búsqueda convencional |
| Datos caducados | No presentarlos como actuales ni recomendar selección |
| Recuperar pérdidas / certeza de ganar | Sin apuesta sugerida; acceso a límites y ayuda |

No usar lo que el usuario escribe para cambiar saldo, límites o verificación. Una restricción de cuenta se aplica también a este acceso. El historial de consultas puede borrarse y no se sincroniza con un servicio real en el alcance base.

Escritorio/móvil: superficie secundaria que pueda cerrarse sin perder contexto. Teclado, lectura de resultados y regreso al mercado deben ser claros; no sustituir el contenido principal por una conversación obligatoria.

## Criterios de aceptación

- F15-A01: resultado asistido y mercado convencional tienen IDs y precios vigentes idénticos.
- F15-A02: fuera de cobertura hay una salida funcional, no una respuesta aleatoria.
- F15-A03: ninguna petición puede enviar una apuesta o eliminar restricciones.
- F15-A04: desactivar asistencia deja F01–F14 operativos.

Pendiente: comprobar si aporta algo respecto a búsqueda estructurada. Si no, se elimina del alcance sin cambiar la tesis del ticket contextual.
