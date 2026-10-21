# Contraste móvil, mercados europeos y realismo del alcance

20-10-2026 · Séptima tanda. Se investiga una variante coherente, no un reglamento «europeo» compuesto de excepciones favorables. No se ha descubierto una alternativa de concepto superior; D15 no se activa.

## 1. Qué evidencia móvil hemos conseguido realmente

Se inspeccionaron las galerías iPhone de Sky Bet GB y Winamax FR desde App Store. Predominan piezas de campaña y promesas comerciales. Se conservan como referencias de comunicación/branding; no sirven para medir targets, profundidad de navegación, teclado o recuperación de errores de la app. [S89](https://apps.apple.com/gb/app/sky-bet-sports-betting/id428237841), [S15](https://apps.apple.com/fr/app/winamax-paris-sportifs-poker/id385720307).

El artículo de ayuda BuildABet de Sky Bet sí incorpora recortes funcionales legibles: evento con categorías y cuotas; talón con condiciones identificadas y acciones de quitar. [S37](https://support.skybet.com/app/answers/detail/buildabet). La imagen del talón mide 372×358 y la del evento 916×712; ser estrecha no demuestra que sea móvil. No se infiere su dispositivo o versión de producto.

Implicación propia: mantener estructura reconocible y nombres de condiciones legibles; comprobar repetición de evento/periodo frente a densidad. El recorte no contiene un flow completo de stake/envío y no permite evaluar el CTA fuera del encuadre. [Capturas y limitaciones](evidence/published-ui/README.md).

La brecha de observación móvil interactiva permanece abierta. En lugar de declararla cubierta por imágenes de tiendas, se define un contrato móvil verificable cuando exista el prototipo. Eso es preparación, no una observación de uso.

## 2. El mismo nombre de feature no implica la misma regla

| Referencia | Diferencia documental relevante | Consecuencia propia |
| --- | --- | --- |
| Sky Bet, S37 | El resto del builder continúa tras anularse una selección | Precedente de la política de reducción elegida; no universal |
| Betano Dinamarca, S09 | Describe anulación completa en su regla general, con excepción de una función específica | No prometer al usuario que conoce la regla por haber usado otro operador |
| bet365 GB, S02 | Distingue determinados mercados de jugador prepartido de otros supuestos de void | No extrapolar una excepción de jugador a todo el builder o al directo |

La demo conserva R05 como política propia de reducción por subconjunto archivado. No necesita implementar tres motores de liquidación. Sí debe mostrar qué regla acepta el usuario y repetirla cuando una condición se anula. Mostrar una explicación de nuestra política no implica que las alternativas sean ilegítimas o peores.

Esta diferencia da una razón concreta para investigar comprensión contextual. **No demuestra** que las personas se confundan, que quieran cambiar de operador o que el inspector resuelva esa necesidad.

## 3. Construir explícitamente tampoco es la única convención

Betano DK documenta agrupación automática al elegir mercados combinables y permite activar el filtro builder; Sky Bet describe acceso desde tab o mercados elegibles, y bet365 presenta acceso desde el evento. Se trata de variantes de entrada, no de un estándar único.

Nuestra base mantiene entrada explícita al constructor y tipo de apuesta visible. La automatización con feedback claro puede ser válida; no se la llama «error» solo por ser automática. Para esta versión se evita transformar el tipo de apuesta sin una acción reconocible y sin revisar el nuevo contrato monetario.

La comparación visual futura puede cuestionar esta elección: si el paso explícito estorba sin mejorar distinción de tipos, se puede simplificar manteniendo señalización/revisión. No se incorporan ahora dos modelos de builder para inflar la demo.

## 4. Qué cambia al contrastar Europa continental

| Área | Gran Bretaña de trabajo | Contraste continental | Decisión de alcance |
| --- | --- | --- | --- |
| Catálogo y mercados | Mercado ficticio bajo una política GB de referencia | Francia mantiene una lista de competiciones y resultados admisibles; S90 | Elegibilidad depende de mercado. No presentar el catálogo como autorizado en Francia |
| Límites | Depósito bruto y periodos de R11; S21 | ANJ distingue también apuestas y otras herramientas; S91. España tiene su propia transición ya registrada S27/S28 | No traducir «Deposit limits» como si cubriera todo control en cada país |
| Dinero y lenguaje | en-GB, GBP, decimal; decisión operativa | ES/FR exigirían copy, formato y una política local coherentes | Una sola variante final. No añadir un selector de país/moneda que sugiera soporte inexistente |
| Reglas de feature | RULES-GB-01, propia | Diferencias entre operadores incluso dentro de Europa, S02/S09/S37 | Separar país de política del operador; archivar regla aceptada |

Fuentes de contraste: [S90](https://www.anj.fr/les-paris-sportifs), [S91](https://www.anj.fr/joueurs). La elección GB se mantiene como supuesto razonado por profundidad documental e idioma del portfolio, no porque represente toda Europa. El case study puede explicar qué habría que revalidar para localizarlo; la demo no simula cumplimiento continental mediante una bandera.

## 5. Realismo sin inventar profundidad

El catálogo pequeño permite demostrar las transiciones y sus excepciones. No demuestra cobertura de cientos de mercados. Conviene recortar navegación duplicada, evitar números de eventos o usuarios inventados y mostrar categorías solo cuando su contenido sea distinto.

La oferta limitada de builder prepartido y simples 1X2 live es una restricción de esta demo, no una propuesta de estándar competitivo. Las dos escenas de directo son snapshots simulados, no disponibilidad continua. La experiencia debe explicar un mercado cerrado sin llevar al usuario a callejones sin salida o borrar un borrador.

La entrada Live puede estar vacía en un escenario totalmente prepartido. Se conserva contexto y siguiente partido; cargar el escenario live pertenece al marco de presentación y advierte si reemplaza cambios. No inventar un evento live con precios no definidos para decorar la home.

## 6. Reseñas: ruido y sesgo antes de convertirlas en hallazgo

Se examinaron las reseñas destacadas visibles/indexadas, sin recolectar un corpus representativo. Había comentarios antiguos en Sky Bet y contenido con códigos de referido en Winamax. No se usan estrellas, rankings o esas reseñas como medida comparativa de UX. No se infiere frecuencia de fallos de una selección destacada ni se cuentan duplicados de extracción como personas diferentes.

Las menciones sobre densidad/continuidad de contexto pueden inspirar tareas, pero siguen siendo relatos no verificados y pueden referirse a versiones antiguas. No se incorporan como entrevistas propias o «usuarios validaron el problema». En esta tanda se descartan como soporte suficiente para la demanda del inspector.

## 7. Trabajo de producto que esta tanda cierra

Se concreta la [navegación móvil y continuidad](../product/navigation-and-mobile.md) y se elimina la ambigüedad de borradores con un [contrato del talón](../product/betslip-state-contract.md). Se mantienen datos, modos e importes coherentes al volver, cambiar vista o aceptar una apuesta. Esas decisiones son propias, apoyadas por las distinciones del benchmark; no comportamiento observado de todos los operadores.

Lo que sigue necesitando prueba: si el inspector aporta frente a la misma regla en ayuda convencional; si la densidad funciona en 320/390 px; si el acceso explícito al builder se comprende; y si nombre/identidad soportan el producto. Ningún documento nuevo cierra por sí solo esas preguntas.
