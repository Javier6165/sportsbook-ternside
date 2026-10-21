# F06 — Bet Builder e inspector de condiciones

Estado: spec documental v0.2; mayor prioridad de prueba visual. Reglas R03–R05/R13.

## Referencias y decisión

D: Sky Bet documenta mercados elegibles, contradicciones y continuidad de las condiciones restantes tras void [S37](https://support.skybet.com/app/answers/detail/buildabet). bet365 explica cotización que considera relación entre selecciones [S02](https://help.bet365.com/s/en-gb/sports/bet-builder). No se adopta su reglamento completo.

Decisión: constructor explícito prepartido desde el evento, con hasta tres condiciones de grupos diferentes. Permanecer con una condición es un borrador de builder; «Place single» requiere revisión y acción explícitas. Añadir una segunda dentro de ese modo ya elegido no cambia silenciosamente una simple existente. La revisión conserva nombres habituales de mercado y añade acceso a «How this bet works». La misma explicación acompaña el ticket aceptado. Editar un grupo existente actualiza el mismo ID; convertir simples en builder requiere reemplazo explícito y nuevo stake vacío, sin sumar los anteriores. [Contrato](../product/betslip-state-contract.md).

## Recorrido y respuestas

Entrar en builder → escoger resultado/total/jugador → ver condiciones y cuota conjunta → abrir inspector opcional → revisar stake → enviar por F07. Seleccionar otra opción del mismo grupo sustituye inmediatamente la anterior, con feedback y Undo; no pide confirmación modal y no crea una cotización imposible. Con una condición se ofrece una simple.

| Estado | Respuesta |
| --- | --- |
| Borrador incompleto | Mostrar condiciones y próximo paso sin inventar precio de builder |
| Cambio dentro del mismo grupo | Sustituir Home/Draw/Away u Over/Under en el borrador, anunciar cambio y ofrecer Undo |
| Combinación realmente no cotizable | Conservar condiciones, identificar incompatibilidad y permitir quitar; no crear un precio falso |
| Cotización no disponible | Conservar selecciones y explicar; no multiplicar cuotas como fallback |
| Escenario parcial | Indicar lo conocido y qué condiciones faltan para concluir resultado |
| Jugador no participa | Explicar void y subconjunto resultante de acuerdo con R05 |

El inspector es de solo lectura. «Empate al final» no define por sí solo goles o tiros. Puede mostrar «Esta condición perdería; el resto sigue sin determinar», pero la conclusión del ticket debe ser pérdida/retorno £0 cuando una condición requerida pierde sin una excepción que la anule. Un void parcial, en cambio, necesita expresar qué condiciones restantes faltan para el retorno condicional. No cambia el partido ni recomienda otra apuesta.

Escritorio: inspector dentro de la superficie del ticket, expandiendo o sustituyendo su detalle con un regreso claro; no requiere una cuarta columna junto a navegación, mercados y talón. Móvil: un solo panel activo con resumen de selección/importe y navegación interna hacia la regla/supuesto; volver conserva estado. No apilar otro sheet sobre el talón. Se comparará la solución concreta al componer.

## Criterios de aceptación

- F06-A01: el trío de referencia tiene precio conjunto 3.40, no 2.10 × 1.80 × 1.90.
- F06-A02: con jugador void y otras condiciones ganadoras se usa 2.70 y retorno £27 para £10.
- F06-A03: abrir inspector, cambiar supuesto y cerrarlo no altera talón, saldo o estado real del escenario.
- F06-A04: explica el alcance de tiempo y la participación junto a la condición pertinente.
- F06-A05: Home→Away sustituye una condición sin modal; Undo restaura Home y revalida precio, sin duplicaciones ni dinero.
- F06-A06: supuesto de empate al terminar 90 minutos con Home requerido concluye retorno hipotético £0 aunque no conozca los tiros o goles exactos.
- F06-A07: abrir ayuda/inspector no crea una cuarta columna obligatoria ni dos paneles modales activos.
- F06-A08: iniciar el partido bloquea el envío del builder prepartido conservando su borrador; no lo convierte en otra apuesta.
- F06-A09: editar/cerrar/reabrir el builder no añade otra apuesta; su grupo mantiene ID y stake propio.
- F06-A10: convertir dos simples mediante «Use as Bet Builder» reemplaza sus grupos una vez, vacía el stake y exige revisión; cancelar conserva todo.

Para Claude durante implementación/validación: demostrar que añade comprensión sin parecer un tutorial permanente. Si los usuarios lo confunden con predicción, revisar presentación antes de implementación.
