# F13 — Saldo, depósitos, retiradas y movimientos

Estado: spec documental v0.2. Reglas R01/R08–R11; referencia GB.

## Referencias y decisión

D: RTS 1 diferencia saldo e historial [S50](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-1-customer-account-information). Las guías británicas tratan el derecho de retirada y su separación de promociones [S41](https://www.gamblingcommission.gov.uk/licensees-and-businesses/guide/page/restrictions-on-withdrawing-deposit-and-deposit-winnings). El método de demo no incluye crédito, conforme a la referencia local [S55](https://www.gamblingcommission.gov.uk/public-and-players/guide/page/why-we-banned-gambling-with-credit-cards).

Decisión: caja con Deposit / Withdraw / Activity; saldo disponible, stakes abiertos y retiradas reservadas separados. Método ficticio predefinido de débito, sin datos financieros reales.

## Recorridos y estados

Depósito: introducir importe → comprobar límites y cuenta → revisar → solicitud → éxito/fallo. Solo el éxito suma saldo y consumo de límite. No proponer un importe mayor al solicitado.

Retirada: importe ≤ disponible → revisar → reservar → pendiente → completada o rechazada. La completada no resta otra vez; el rechazo libera reserva una vez. No hay botón de cancelar retirada. No se exige apostar previamente el saldo.

| Estado | Respuesta |
| --- | --- |
| Límite restante menor al importe | Indicar margen real y acceso al límite; no modificarlo automáticamente |
| Método rechazado | Sin crédito ni consumo de límite; reintento explícito |
| Respuesta desconocida | Operación pendiente con ID; no volver a solicitar automáticamente |
| Retirada pendiente | Importe reservado y fecha; sin plazo bancario real inventado |
| Cuenta cerrada por exclusión | Superficie de devolución/ayuda de F14, sin reapertura de juego |

Escritorio/móvil: acceso a límites en la superficie de depósito y desglose legible de movimientos. El saldo no debe cambiar de definición entre header y caja. La lista admite tipos y estados, no solo números con signo.

## Criterios de aceptación

- F13-A01: saldo £100, retirada £20 pendiente → disponible £80 y reserva £20; completar mantiene £80.
- F13-A02: rechazar esa retirada ordinaria devuelve disponible a £100 una sola vez; devoluciones por exclusión siguen R11.
- F13-A03: depósito £10 rechazado no suma ni consume límite.
- F13-A04: cada cambio del saldo tiene un movimiento confirmado de origen identificable.
- F13-A05: tras exclusión, retorno de apuesta y reserva para devolución quedan vinculados y no habilitan juego.
- F13-A06: reliquidación ajusta solo la diferencia de retorno reconocido, conserva movimientos anteriores y no debita stake otra vez.

Ajustes posteriores y devoluciones de exclusión definidos en [tanda 4](../research/09-lifecycle-edge-cases.md). Para Claude durante implementación/validación: representación de revisión adicional de fondos y de esos movimientos. No atribuir cumplimiento AML a una animación de aprobación ficticia.
