# F10 — Cash Out total

Estado: spec documental v0.1. Regla R09; dependencias F08/F13.

## Referencias y decisión

D: Sky Bet distingue oferta, confirmación, procesamiento y posible fallo [S46](https://support.skybet.com/app/answers/detail/cash-out). BetMGM también documenta indisponibilidad [S29](https://help.betmgm.co.uk/hc/en-gb/articles/12975709519250-Why-is-the-Cash-Out-option-unavailable). No hay una promesa de disponibilidad permanente.

Decisión: cierre total solo para apuestas del escenario marcadas como elegibles. El importe mostrado incluye todo lo retornado. La revisión presenta stake original, retorno de cierre y resultado neto. No usar el color de ganancia si el retorno es inferior al stake.

## Recorrido y respuestas

Abrir oferta → revisar consecuencias → confirmar → comprobar operación → recibo de cierre. Atrás antes de confirmar no cambia apuesta. Una oferta vencida no se ejecuta con importe nuevo sin otra revisión.

| Estado | Respuesta |
| --- | --- |
| Elegible, sin oferta actual | Conservar etiqueta de disponibilidad condicionada; explicar suspensión si se conoce |
| Nueva oferta | Actualizar y pedir confirmación del importe nuevo |
| Procesando | Bloquear duplicados y nueva liquidación monetaria hasta reconciliar |
| Respuesta desconocida | Comprobar mismo ID; no asumir que el ticket sigue abierto para otro cierre |
| Confirmado | Cambiar a Cashed out y acreditar una vez |
| Rechazado | Mantener abierta y permitir revisar nueva oferta si existe |

Escritorio/móvil: acción dentro del ticket, revisión con contexto y confirmación distinguible. No confundir el control con Withdraw funds. En móvil el botón no comparte posición inmediata con una acción opuesta de navegación.

## Criterios de aceptación

- F10-A01: £100 inicial − £10 stake + £8 de cierre = £98; resultado de apuesta −£2.
- F10-A02: oferta cambia £8 → £7.50: ningún cobro hasta revisar y confirmar £7.50.
- F10-A03: éxito de Cash Out y liquidación oficial concurrentes producen una sola resolución monetaria final.
- F10-A04: retirar oferta no devuelve el stake ni cancela la apuesta.

Para Claude durante implementación/validación: copy de cotización caducada y orden de mensajes cuando coinciden suspensión y pérdida de conectividad. No se incluyen Cash Out parcial o automático como controles sin resolver.
