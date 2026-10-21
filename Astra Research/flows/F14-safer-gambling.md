# F14 — Límites, pausa y autoexclusión

Estado: spec documental v0.2; referencia GB. Depende de R11, cuenta y caja.

## Referencias y decisión

D: RTS 12 guía límites y cambios [S21](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-12-financial-limits). Time-out tiene duraciones específicas [S40](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/3-3-4-remote-time-out-facility). La autoexclusión distingue requisitos de SR code y buenas prácticas de ordinary code [S43](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/3-5-3-remote-sr-code), [S42](https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/condition/3-5-4-remote-ordinary-code).

Decisión: tres tareas separadas, con consecuencias claras antes de confirmar. El flujo no añade obstáculos promocionales ni ofertas para abandonar la acción.

## Recorridos

Límites: ver consumo/periodo → introducir importe propio → revisar interacción con otros periodos → aplicar reducción o registrar aumento pendiente. El aumento no se activa hasta la espera mínima y confirmación posterior. Ventanas: últimas 24 h/7 días, mes natural local; mostrar cuándo liberan margen los depósitos que caducan, no un reset a medianoche para todas. «Quedan £5 para depositar» no significa que solo se puedan apostar £5 del saldo existente.

Pausa: elegir 24 h, semana, mes o periodo adicional hasta seis semanas → revisar bloqueo → confirmar. Conserva historial y retirada. No se puede cancelar para apostar durante el periodo elegido.

Autoexclusión: explicar cierre, devolución, cese de marketing simulado y alcance → elegir 6 meses, 1 año o 5 años → confirmar de forma inequívoca → cerrar acceso de juego e iniciar devolución ficticia. No se afirma registro en GAMSTOP ni exclusión de otros operadores. Expirar un periodo no reactiva automáticamente el acceso.

| Estado | Respuesta |
| --- | --- |
| Reducción aplicada | Nuevo límite y efecto inmediato |
| Aumento pendiente | Actual, solicitado y hora de primera confirmación posible |
| Pausa activa | Fin, restricciones y retirada disponible |
| Autoexclusión activa | Superficie de cierre y devolución; no cuotas o promociones |
| Ayuda | Información contextual y recursos; no enviar mensajes reales |

Recordatorios de tiempo son una política opcional del concepto: no presentar RTS 13B de gaming como obligación de sportsbook [S44](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-13-time-requirements-and-reality-checks).

## Criterios de aceptación

- F14-A01: retirar dinero no repone margen de depósito bruto.
- F14-A02: avanzar 24 h permite confirmar aumento, no lo aplica solo.
- F14-A03: pausa bloquea también accesos desde búsqueda, talón guardado y enlaces directos; F15 no está activo en v1.
- F14-A04: autoexclusión cierra juego y devuelve fondos mediante proceso separado.
- F14-A05: con una apuesta abierta no se demora la exclusión; devuelve disponible y mantiene resolución de la apuesta. Si gana, inicia devolución adicional sin reabrir juego.
- F14-A06: V13 explica la devolución inicial y posterior con importes/origen distintos, sin mostrar cuotas o CTA para apostar.
- F14-A07: una operación anterior desconocida se reconcilia por su ID con el juego ya bloqueado; no impide aplicar la exclusión.
- F14-A08: devolución rechazada mantiene fondos pendientes y ayuda, sin convertirlos en saldo jugable.
- F14-A09: medianoche y cambio horario no reinician la ventana de últimas 24 h; un depósito sale exactamente tras 24 h transcurridas.
- F14-A10: límites reciben entrada directa desde Home y depósito, conservando el borrador cuando se vuelve.

Política documental de abiertas y devoluciones tardías definida en [tanda 4](../research/09-lifecycle-edge-cases.md), con precedente [S64](https://support.betfair.com/app/answers/detail/a_id/10559/) y caso C29. Para Claude durante implementación/validación: comprobar su presentación y revisar copy con personas para distinguir pausa de cierre por exclusión. La devolución de fondos ya pagados que luego se corrijan queda fuera del alcance simulado.
