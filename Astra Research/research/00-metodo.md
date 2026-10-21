# Método y alcance de la primera investigación

Fecha de consulta: 2026-10-20. Investigación documental cualitativa para seleccionar una dirección de producto.

Este documento describe la primera tanda de 36 fuentes. La [segunda tanda](07-flow-findings.md) añade investigación por flow, 19 fuentes y specs documentales, para 55 fuentes registradas en total. No añade pruebas con usuarios ni observaciones móviles/autenticadas.

La ampliación a case study añade una [tercera tanda de fuentes](sources-wave-03.md) y un [registro de cifras](../case-study/metrics-register.md), para 63 fuentes registradas. El contexto cuantitativo se distingue de resultados del concepto y de recuentos de documentación.

La [revisión crítica](11-critical-review.md) añade contraste de atribuciones, contraejemplos y correcciones. Registra qué se sostuvo, qué cambió y qué sigue sin respaldo de tareas. El [protocolo](../project/quality-review-protocol.md) conserva la revisión visual posterior; la revisión documental inicial precedió a las imágenes. Después se añadieron borradores generados del concepto y una [revisión propia](../design/visual-review.md); siguen sin existir pruebas con personas.

El corte vigente incorpora siete tandas y 91 fuentes registradas. La revisión crítica no transforma ese recuento en validación de demanda ni en 91 observaciones independientes. El [contraste móvil/europeo](12-mobile-and-europe-contrast.md) separa imágenes publicadas y marketing de una sesión de app observada; descarta las reseñas destacadas como soporte suficiente de necesidad.

## Preguntas de investigación

1. ¿Qué funcionalidades son convenciones de un sportsbook europeo y cuáles podrían aportar una diferencia relevante?
2. ¿Qué tensión concreta permite mostrar criterio de diseño sin convertir el producto en otra categoría?
3. ¿Qué referencias estadounidenses son transferibles como patrones, separadas de sus reglas locales?
4. ¿Qué restricciones afectan a pantallas, estados, mensajes y acciones?
5. ¿Qué recorrido puede demostrar el concepto de forma convincente en escritorio y móvil?

## Muestra

Se han consultado referencias sobre bet365, Sky Bet, Paddy Power, bwin, Betano, Betfair, Unibet, William Hill, Winamax y SBK. FanDuel y DraftKings aportan referencias estadounidenses. BetMGM UK se utiliza como fuente puntual sobre indisponibilidad de Cash Out.

La selección busca variedad de patrones y geografías. No representa un ranking de cuota de mercado ni una muestra estadística de todo el sector. Varias marcas pertenecen al mismo entorno corporativo; no se cuentan como votos independientes que validen una necesidad.

## Tipos de evidencia

| Código | Qué permite afirmar | Qué no permite afirmar |
| --- | --- | --- |
| O — Observación directa | Un elemento estaba visible en la página pública observada, en ese momento y contexto | Funcionamiento tras login, cobertura nacional completa o rendimiento |
| D — Documentación primaria | El operador o regulador describe una función, regla o requisito; incluye imágenes publicadas, identificadas como representación | Que la ejecución sea fácil, que todos los clientes accedan o que mejore un KPI |
| E — Estudio externo | Resultados dentro de su muestra, método y fecha | Que describa automáticamente al futuro usuario del concepto |
| H — Hipótesis | Una explicación o necesidad plausible por investigar | Una conclusión probada con usuarios |
| R — Recomendación | Una elección de diseño razonada para este proyecto | Una funcionalidad inédita o validación comercial |

## Trabajo realizado

- Búsquedas y lectura de documentación pública de operadores y autoridades; registro de 36 fuentes en `sources.md`.
- Observación directa de home de bet365 España, home y detalle de evento de bwin España, con tres capturas locales.
- Consulta de dos referencias de investigación sobre comprensión de cuotas y comportamiento de gasto.
- Contraste de jurisdicciones: Comisión Europea, Gambling Commission británica y DGOJ española.
- Comparación de cuatro territorios conceptuales con criterios explícitos de portfolio y producto.

## Límites que afectan a las conclusiones

Paddy Power restringió el acceso a su interfaz pública desde la ubicación de consulta. No se ha eludido esa restricción. Algunas páginas de Unibet y páginas promocionales de Sky Bet solo aportaron el contenido pertinente mediante el índice de búsqueda; las aperturas posteriores devolvieron restricción o redirección. Queda indicado en sus fichas y se consideran precedentes documentados, sin asumir disponibilidad actual completa.

No se ha accedido a cuentas, enviado apuestas, depositado dinero ni realizado recorridos autenticados. No se han inspeccionado apps nativas ni capturado móvil. No hay todavía una auditoría de interacción por flow ni pruebas con usuarios.

Las capturas españolas muestran un estado sin sesión. La jerarquía puede cambiar tras login, por campañas, país, tamaño de pantalla o experimentos. Los horarios, jugadores, cuotas y promociones capturados son contenido volátil y no se usarán como datos deportivos fiables de la futura demo.

Los centros de ayuda pueden conservar artículos antiguos. Cuando aparecen señales de transición o contradicción, se evita afirmar una disponibilidad universal. Las páginas corporativas y fichas publicadas por el desarrollador se tratan como declaraciones del operador, no como evaluación independiente.

## Cómo leer los hallazgos

La investigación sostiene que los mecanismos examinados ya tienen precedentes y que existen reglas con consecuencias concretas para UX. La idea de que una experiencia más coherente de comprensión y seguimiento resultará mejor es una hipótesis de diseño. El research no demuestra un hueco de mercado sin competidores ni que los usuarios cambiarían de operador por esta propuesta.
