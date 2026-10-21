# F12 — Cuenta, acceso y verificación simulada

Estado: spec documental v0.1. Referencia GB; dependencias F07/F13/F14.

## Referencias y decisión

D: la Gambling Commission exige verificación antes de apostar [S25](https://www.gamblingcommission.gov.uk/public-and-players/guide/age-and-id-verification). El concepto representa estados sin ejecutar un proceso real de identidad.

Decisión: entrada principal como usuario de demo verificado. Desde la presentación se carga modo invitado, sesión vencida o cuenta pendiente. No hay formulario que recoja nombre legal, contraseña, documento o dirección reales. El perfil ficticio se identifica como tal.

## Recorrido y respuestas

Invitado explora catálogo → acción de apuesta requiere acceso demo → volver al borrador y revalidar. Usuario activo abre perfil, preferencias e historial. Cerrar sesión limpia datos visibles de cuenta; no liquida ni elimina apuestas. Volver a la cuenta demo recupera su mismo estado hasta reinicio explícito.

| Estado | Respuesta |
| --- | --- |
| Invitado | Navegar sin saldo personal; CTA de entrar en demo |
| Verificado | Acceso al alcance de apuestas y caja |
| Verificación pendiente | Estado/motivo y acción de ayuda; no depósito o apuesta en el modelo elegido |
| Sesión vencida | Recuperación sin pérdida del borrador; reconciliar antes un envío incierto |
| Pausa | Acceso de lectura y retirada; bloqueo de nuevas apuestas y depósitos |
| Autoexcluido | Confirmación de cierre/devolución y ayuda; sin acceso al sportsbook autenticado |

Una persona no resuelve su verificación pulsando un botón dentro de Account. Cargar «verified» es una acción de presentación, rotulada como escenario. La base muestra en-GB, GBP y cuotas decimales como información; no hay selector de país, moneda o formato fraccional. [Decisión de navegación/variante](../product/navigation-and-mobile.md).

Escritorio/móvil: menú o página de cuenta accesible sin ocultar límites y movimientos bajo varios niveles. Los errores de sesión no exponen información de otra cuenta ni lanzan un login real.

## Criterios de aceptación

- F12-A01: usuario no verificado no puede enviar apuestas por URL directa o asistencia.
- F12-A02: sesión vencida durante un intento no genera un segundo intento al recuperar acceso.
- F12-A03: logout no reinicia saldo, apuestas ni restricciones de la cuenta demo.
- F12-A04: ningún control solicita credenciales o archivos reales.
- F12-A05: no se muestran selectores de país/moneda/formato sin soporte; los valores informativos coinciden con recibos y caja.

Para Claude durante implementación/validación: decidir cuánto onboarding necesita el relato del portfolio; el recorrido principal no comenzará con una verificación larga que impida explorar el producto.
