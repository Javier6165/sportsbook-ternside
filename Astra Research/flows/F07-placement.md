# F07 — Envío, confirmación y recuperación

Estado: spec documental v0.2. Regla R08; dependencia crítica de F04–F06 y F13.

## Referencias y decisión

D: Sky Bet documenta preferencias para cambios de precio [S31](https://support.skybet.com/app/answers/detail/how-do-odds-work). La política de liquidación distingue el precio del recibo [S51](https://support.skybet.com/app/answers/detail/bet-settlement-policy).

Decisión propia: revisión manual de cualquier cambio y un ID por operación. No hay autoaceptación en v0.2. La recuperación de respuesta desconocida es un requisito de coherencia de la demo, no una afirmación sobre la infraestructura de un competidor.

## Recorrido y estados

Revisar → validar cuenta/importe/precio/mercado/saldo → enviar → resultado confirmado → recibo. El CTA incluye stake, por ejemplo «Place bet · £10». La aceptación conserva snapshot y aplica un débito único. Un rechazo vuelve al borrador con motivo y sin cobrar.

| Estado | Respuesta |
| --- | --- |
| Precio cambió | Comparar cuota y retorno; pedir revisar; cualquier cambio posterior invalida revisión |
| Enviando | Desactivar reenvío, anunciar procesamiento y mantener contexto |
| Sin respuesta | «Checking your bet»; consultar el mismo ID, bloquear nuevas operaciones monetarias |
| Aceptada recuperada | Mostrar el mismo recibo y débito una vez |
| Rechazada recuperada | Conservar borrador y motivo; nuevo intento solo por acción explícita |
| Sesión vencida | Recuperar acceso antes de enviar; si ya había intento, reconciliarlo primero |

La aceptación consume solo los grupos del snapshot enviado, una vez. Rechazo conserva el borrador; respuesta desconocida congela ese snapshot hasta reconciliarlo. Nunca limpiar otras apuestas independientes. [Contrato del talón](../product/betslip-state-contract.md).

Navegar o recargar no vuelve a enviar. Una respuesta tardía se vincula al intento original, aunque el panel esté cerrado. No hay toast de éxito si falta confirmación.

Escritorio/móvil: estado y resultado dentro de la superficie de revisión; foco va al encabezado del recibo o al error relevante. Mensajes persistentes ante incertidumbre; no depender de una animación breve.

## Criterios de aceptación

- F07-A01: doble clic produce un recibo y un débito.
- F07-A02: resultado desconocido no se etiqueta como rechazo y no habilita reenvío.
- F07-A03: cambio 3.40 → 3.20 con £10 muestra £34 → £32 antes de aceptar.
- F07-A04: si se confirma rechazo, el saldo es el anterior y el borrador queda recuperable.
- F07-A05: el inicio de evento impide aceptar el builder revisado prepartido; no hay débito ni recibo.
- F07-A06: simple live acepta la versión del snapshot tras procesamiento ficticio y revalidación; si cambia, exige nueva revisión sin debitar. [Contrato](../product/live-offer-contract.md).
- F07-A07: recuperar una aceptación consume sus grupos una sola vez; recuperar rechazo los conserva, sin copias ni reenvíos.

Para Claude durante implementación/validación: copy de recuperación y cómo representar tiempo sin prometer un plazo garantizado. Cualquier timeout de simulación se configura en escenarios, no se convierte en una regla legal.
