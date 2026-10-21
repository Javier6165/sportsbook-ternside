# Oferta por fase: separar seguir una apuesta de crear otra

20-10-2026 · Decisión propia de alcance, revisión 0.1. Completa CR03; no copia la cobertura de un operador real. Valores de demo, nunca un modelo estadístico.

| Fase de football-01 | Nuevas simples | Nuevo builder | Nueva combinada | Tickets aceptados |
| --- | --- | --- | --- | --- |
| Prepartido | 1X2, O/U 2.5, Player 2+ SOT | 2–3 condiciones compatibles | 2–3 selecciones de eventos todavía prepartido | Reglas y precio aceptados archivados |
| Inicio/suspensión sin cotización nueva | No disponibles sobre evento afectado | No disponible | Bloqueada si contiene ese evento | Conservados; no confundir suspensión con void |
| Directo minuto 68, 2–1 | Solo resultado 90 minutos: Home 1.30 / Draw 5.00 / Away 13.00, versión live-qv1 | Construcción cerrada; borrador conservado | Solo eventos prepartido; no añadir esta simple live a una acca | Seguimiento de todas las condiciones previamente aceptadas |
| Directo minuto 72, 2–1 | Home 1.24 / Draw 5.80 / Away 15.00, versión live-qv2 | Cerrado | Igual que anterior | La corrección SOT 2→1 no modifica por sí sola estas cuotas de resultado |
| Final/abandono/aplazamiento | No disponibles | Cerrado | Componente no elegible | Pendiente de resolución por la política aplicable |

La cobertura de totales y jugador en directo no se simula. Un mercado prepartido conservado como contexto se etiqueta «Pre-match market closed» y nunca mantiene un botón activo con el precio anterior. «Bet Builder closed for new bets» no cierra ni liquida un builder aceptado.

## Snapshots y envío

La oferta live está vinculada al ID del snapshot, fase, minuto, marcador y versión de precio; el reloj de evento y sus observaciones cambian juntos. No avanzar el reloj a minuto 72 mostrando el precio de minuto 68 como vigente. En los intervalos sin snapshot cotizado, mostrar suspensión/no disponible; no interpolar precios.

En directo la simple es el resultado final de 90 minutos, incluido el marcador ya existente. No es «ganador desde ahora» ni «próximo gol». La revisión muestra ese periodo y el contexto de aceptación, sin tratar el score como garantía.

La fixture de envío live tiene un procesamiento ficticio de dos segundos para poder representar validación pendiente. Es duración de escenario, no latencia real garantizada ni estándar regulatorio. Antes de aceptar se revalidan fase, versión, estado de mercado, cuenta y saldo. Si cambia precio, no hay débito: revisión explícita del nuevo precio y nuevo intento elegido por el usuario. Respuesta desconocida usa R08.

## Borradores anteriores al inicio

Un borrador de builder nunca se envía después del inicio con su cuota prepartido. Se conserva y explica el cierre. No se convierte automáticamente en una simple o en otro modo. La selección de un mercado live se inicia explícitamente y cotiza a su versión nueva. Cargar un escenario desde Demo controls advierte de reemplazo de estado; avanzar el partido dentro del escenario conserva borradores y apuestas con estas reglas.

## Aviso y fuentes

Información compacta en las superficies live: «Live information can be delayed. Others may have more up-to-date information.» Es copy propuesto basado en [S24 / RTS 15](https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards/rts-15-in-play-betting); el contexto de demo identifica datos simulados. No se atribuye al RTS obligación de fijar dos segundos ni de ofrecer estos mercados.

Los nuevos datos se guardan en `live_offer_snapshots` de [fixtures.json](../demo/fixtures.json). Los casos C42/C43 cubren aceptación live y borrador obsoleto al inicio. La oferta secundaria de tenis y basket permanece solo prepartido en esta versión.
