# F16 — Presentación, escenarios y reinicio

Estado: spec documental v0.2. Su usuario es quien explora el portfolio; pertenece al marco de demo, no a la cuenta de apuestas.

## Base y decisión

Requisito del brief: escritorio y móvil importantes, demo explorable y botones con respuestas. El selector Full/Mobile queda incluido por D40; aplica el contrato de una sesión en SIM-01.

Decisión: modo libre por defecto, con entrada opcional al recorrido sugerido y panel Demo controls claramente separado. El panel permite cargar fixtures y avanzar el partido de referencia. El inspector de condiciones de F06 no es ese panel.

## Recorrido y estados

Entrar → explorar libremente o abrir guía → cargar escenario si se desea → cambiar viewport → seguir con el mismo estado. Reiniciar abre confirmación que enumera cambios ficticios que se perderán. Confirmar restaura catálogo, reloj, cuenta, límites, saldo, recibos y búsquedas del escenario base.

| Estado | Respuesta |
| --- | --- |
| Cambio desktop/mobile | Conservar ruta, selección, stake, operaciones y saldo |
| Escenario con cambios locales | Advertir antes de reemplazarlo; cancelar conserva todo |
| Operación en curso | No permitir un avance que evite reconciliación; ofrecer escenario independiente tras confirmar reemplazo |
| Enlace directo a ticket | Resolver fixture/ID o mostrar no encontrado con vuelta a Mis apuestas |
| Cuenta excluida simulada | Reinicio solo en marco de presentación; nunca como CTA de reactivar juego |
| Corrección posterior no soportada con el saldo actual | Explicar precondición y ofrecer cargar el caso independiente con confirmación; nunca forzar deuda o alterar saldo para hacerlo encajar |

Vista móvil embebida: deberá usar anchura real de layout y no escalar visualmente una página de escritorio. Aunque exista, se verificará responsive también al estrechar la ventana real. Implementación fijada en [SIM-01](../implementation/scenario-engine.md): un árbol/store y adaptación por contenedor, sin iframe o sesión duplicada. No se requieren capturas previas.

Los relojes de partido, fecha de depósitos y duración de la sesión son independientes. Avanzar al minuto 90 no puede liberar un aumento de límite de 24 h. Hay un control específico de tiempo de cuenta para ese escenario.

## Criterios de aceptación

- F16-A01: cambiar viewport no crea otra cuenta ni borra un stake escrito.
- F16-A02: reinicio confirmado deja exactamente el saldo y los registros iniciales.
- F16-A03: navegación libre alcanza un recibo sin depender de haber seguido una guía.
- F16-A04: un escenario de presentación no se describe como partido o pago real.
- F16-A05: todos los controles visibles tienen resultado o estado definido.
- F16-A06: si una transición de corrección requiere fondos que ya no existen, muestra el límite de ese escenario y permite cargar su fixture tras confirmar reemplazo; no encadena correcciones de devoluciones ya pagadas.
- F16-A07: avanzar un snapshot de partido actualiza su contexto y oferta live juntos, sin avanzar el reloj de cuenta o sesión.

La navegación del producto es libre. Las mutaciones extraordinarias del marco de presentación se limitan a transiciones definidas por cada caso; no son botones para imponer cualquier resultado a cualquier cuenta.

La ubicación/estilo del marco los decide Claude con una huella compacta. En móvil real se oculta el selector redundante; los controles de escena siguen identificados como presentación. Comprobar espacio, foco y continuidad en la app.
