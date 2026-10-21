# Hallazgos de la segunda tanda y su efecto

20-10-2026 · Research documental aplicado a especificación v0.1. No se han añadido pruebas con usuarios ni auditorías autenticadas. No ha aparecido una alternativa de concepto que justifique detener la investigación según la condición de Javier.

## 1. El inspector necesita reglas concretas, no explicaciones genéricas

Sky Bet distingue no titularidad, no participación y efectos por tipo de apuesta. La especificación adopta una política concreta para el mercado de jugador elegido y la referencia en todo el recorrido. [S48](https://support.skybet.com/app/answers/detail/player-not-starting).

Decisión: el inspector pregunta por el contexto que falta. Un supuesto sobre participación no fija automáticamente el marcador; su resultado puede ser condicional. Esto reduce el riesgo de que una explicación convincente sea falsa.

## 2. Un builder no se puede tratar como una combinada estándar

Las condiciones del mismo evento pueden relacionarse. El concepto necesita precio conjunto y una política de reducción ante void. Las referencias ofrecen mecanismos diferentes; la demo fija el suyo, sin prometer reproducir cualquier operador. [S02](https://help.bet365.com/s/en-gb/sports/bet-builder), [S37](https://support.skybet.com/app/answers/detail/buildabet).

Decisión: guardar también precios de subconjuntos en las fixtures. La liquidación explica el cambio sin dividir por una cuota individual o consultar precios actuales.

## 3. El dato visible y el resultado monetario son distintos

La documentación de directo contempla retrasos y discrepancias; las reglas estadísticas tienen definiciones específicas [S38](https://support.skybet.com/app/answers/detail/football-match-stat-markets/), [S52](https://support.skybet.com/app/answers/detail/football-in-play-rules/).

Decisión: separar estado del evento, disponibilidad del mercado, actualidad de datos y liquidación. El contador del ticket puede corregirse sin alterar dinero. «Umbral alcanzado» no se etiqueta como «pagado».

## 4. La operación desconocida necesita un recorrido propio

Hipótesis de robustez de diseño: si la demo cobra dos veces al recargar o interpreta una espera como rechazo, pierde credibilidad aunque la pantalla principal esté cuidada.

Decisión propia: ID único por operación, bloqueo de reenvío y reconciliación. Se documenta para aceptación, Cash Out y caja. No se atribuye esa arquitectura a un competidor observado.

## 5. La caja exige distinguir magnitudes

Saldo, importe apostado, retorno, neto, reserva de retirada y consumo de límite no son intercambiables. RTS 1 y la guía de retiradas aportan referencias de claridad y acceso. [S50](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-1-customer-account-information), [S41](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/restrictions-on-withdrawing-deposit-and-deposit-winnings).

Decisión: un libro de movimientos pequeño y reproducible; toda variación del disponible tiene un origen. Los casos de prueba separan pérdida reducida, devolución y ganancia.

## 6. Pausa y autoexclusión no pueden ser el mismo estado

La autoexclusión británica contempla impedir juego, cerrar cuenta y devolver fondos. La pausa tiene otro propósito y duración. [S40](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/3-3-4-remote-time-out-facility), [S43](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/3-5-3-remote-sr-code).

Decisión: pantallas y consecuencias distintas. Una exclusión de demo no deja el sportsbook autenticado abierto detrás de un banner; la devolución utiliza una superficie separada. Falta cerrar las variantes con apuestas abiertas antes del handoff final.

## 7. Los deportes secundarios tienen que tener reglas propias

La referencia de tenis muestra variaciones importantes para retiradas; en basket los periodos y overtime importan [S53](https://support.betfair.com/app/answers/detail/tennis-rules/), [S54](https://support.betfair.com/app/answers/detail/basketball-rules/).

Decisión: cobertura limitada y regla de demo declarada. Una fila de otro deporte no es solo un cambio de icono sobre las reglas de fútbol.

## Qué puede sostenerse ahora

Existe una primera especificación de 16 flows y un modelo común con decisiones concretas. Se puede comprobar su coherencia documental y aritmética. Todavía no se puede afirmar que el inspector se comprenda mejor, que las pantallas tengan densidad correcta o que cada interacción funcione en una aplicación.

## Dónde concentrar la siguiente comprobación

| Área | Evidencia disponible | Siguiente prueba prioritaria |
| --- | --- | --- |
| Navegación | Observación pública de escritorio y búsqueda documentada | Composición móvil y tareas de búsqueda |
| Builder/inspector | Reglas y precedentes documentados; decisión propia de escenarios | Prototipo de supuestos parciales y void |
| Ticket/envío | Tipos y precios documentados; estados propuestos | Doble clic, cambio de cuota y respuesta desconocida |
| Directo/recibo | Reglas de datos y liquidación | Comprensión de provisional frente a liquidado |
| Caja/límites | Referencias normativas y casos contables | Comprensión de saldo, reservas y límite bruto |
| Exclusión | Requisitos y buenas prácticas diferenciados | Cierre con apuestas abiertas y devoluciones posteriores |
| Asistencia | Precedentes, sin prueba de necesidad | Comparación con búsqueda convencional; eliminar si no aporta |
