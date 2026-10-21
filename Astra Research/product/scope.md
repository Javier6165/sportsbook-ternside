# Alcance de trabajo de la demo

v1.0 · Alcance del handoff. Decisiones del asistente bajo autonomía delegada. D38 deja composición a Claude; BRAND-01 y TECH-01 fijan identidad/tecnología. No es validación con usuarios.

## Recorrido principal

Catálogo → partido → selección → talón → revisión → recibo → Mis apuestas → seguimiento → liquidación o Cash Out. El inspector de condiciones se abre desde el evento, el talón y el detalle de apuesta, con las mismas reglas.

La primera visita comienza con un usuario ficticio adulto, verificado y con £100 de saldo disponible. Se puede entrar como invitado o cargar escenarios de cuenta desde el panel de presentación. El producto usa en-GB, GBP y cuotas decimales; el dossier interno usa español. No hay selectores de país, moneda o cuota fraccional en esta base. [Navegación y variante](navigation-and-mobile.md).

## Profundidad por área

| Área | Profundidad v0.1 | Decisión y motivo |
| --- | --- | --- |
| Fútbol | Tres eventos; 1X2, totales y jugador prepartido; nuevas simples 1X2 en dos snapshots live de football-01 | Suficiente variedad para investigar periodos, correlación y estados |
| Bet Builder | Un evento, prepartido, hasta tres condiciones: resultado, total y jugador; seguimiento después | Límites explícitos de producto de la demo; evita prometer un constructor universal |
| Combinadas | Dos o tres selecciones de eventos diferentes todavía prepartido; fútbol, tenis o basket | Demuestra diferencia entre múltiples y builder; no sistemas o permutaciones |
| Simples | Una o varias, con importe separado y envío individual por fila | Evita un envío en lote con aceptación parcial no resuelta |
| Tenis | Ganador del partido, encuentro ficticio y excepción de retirada | Demuestra variación de reglas sin simular un catálogo completo |
| Basket | Ganador incluidas prórrogas, encuentro ficticio | Periodo explícito; sin handicap, player props o builder |
| Cash Out | Total, con cotización, revisión y confirmación | Parcial y automático se excluyen; las referencias los tratan como modalidades adicionales |
| Cuenta | Invitado, verificado, sesión vencida y pendiente; acceso demo | Sin credenciales o documentos reales |
| Caja | Depósito y retirada simulados, pendientes, rechazados y movimientos | Dinero consistente; método ficticio de débito sin recoger números de tarjeta |
| Juego seguro | Límites, pausa y autoexclusión simuladas con consecuencias | No conectar registros públicos ni servicios reales |
| Asistencia | F15 fuera de v1; sin botón/chat/LLM | Búsqueda F02 e inspector F06 cubren acceso y explicación |
| Presentación | Escenarios, reinicio y Full/Mobile incluidos | Una sesión compartida; separado del supuesto apostador |

Los máximos elegidos son decisiones de alcance del concepto, no límites habituales de todos los operadores. Deben revisarse visualmente si hacen que el producto parezca artificialmente reducido.

## Fuera de la versión base

Bonos, free bets, boosts, early payout, Super Sub, Ghost Leg, Exchange, casino, streaming, social, sistemas combinatorios, retiradas parciales de apuesta y mercados de prórroga de fútbol. Tampoco se mezclan builders con combinadas externas en esta versión.

No se dejan estos productos como botones decorativos. La navegación publicada solo presenta áreas que tengan una respuesta definida. La arquitectura futura puede ampliarse, pero la demo no promete cobertura inexistente.

## Requisitos transversales

- Identificación persistente como demo y dinero ficticio, sin impedir explorar.
- Mismos datos, reglas y saldo al navegar o cambiar de viewport.
- Catálogo y funciones esenciales operables por teclado; foco recuperable al cerrar paneles.
- Nombres largos, múltiples selecciones y estados vacíos incluidos en la revisión visual.
- Sin reenvío automático de una operación cuyo resultado no se conoce.
- Un panel de presentación puede cargar escenarios; el usuario del producto no puede cambiar resultados deportivos o resolver su propia verificación.

## Decisiones de cierre

Ternside/BRAND-01; TECH-01; catálogo de fixtures como base; sin IA F15; Full/Mobile incluido. Claude decide redacción de apoyo, layout y recursos deportivos propios dentro de los contratos. No necesita imágenes finales ni otra elección de paleta. [Entrada del paquete](../handoff/START-HERE.md).

Oferta live y cierre al inicio: [contrato por fase](live-offer-contract.md). Las coberturas limitadas se comunican donde afectan una acción; no se inventan cotizaciones para hacer funcional una sección no definida.

Talón: [contrato de estado](betslip-state-contract.md). Simples y builders separados comparten lista con el modo Accumulator, conservando stakes independientes. La aceptación consume sus grupos; alternar modo no crea copias.
