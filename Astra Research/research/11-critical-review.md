# Revisión crítica de la investigación antes de componer

20-10-2026 · Revisión propia solicitada por Javier. No es un estudio con usuarios, una revisión independiente ni una puntuación de usabilidad. La revisión documental inicial precede a los borradores SC01; su [revisión visual posterior](../design/visual-review.md) se registra aparte.

## Método

Releer tesis, evidencia, alcance, reglas, datos y flows buscando un contraejemplo que los rompa. Verificar las atribuciones relevantes en fuentes primarias. Separar defectos documentales corregibles, riesgos de diseño por comprobar y limitaciones de evidencia que no desaparecen con más redacción.

Se consultaron los criterios de Impeccable y las heurísticas S85 para preparar preguntas de revisión. No se ejecutó el comando formal de crítica de interfaz: en ese corte todavía no había composición de producto. Los borradores rasterizados posteriores no son una app renderizada u operable. No se usaron agentes independientes, detector de markup ni pruebas de navegador del producto. No se asignan notas a una experiencia inexistente.

## Hallazgos y acciones

| ID | Qué se cuestionó | Resultado de la revisión | Acción / estado |
| --- | --- | --- | --- |
| CR01 | ¿Estamos validando la necesidad con un gran número de fuentes? | No: abundan documentos de reglas, varias marcas relacionadas y pocas observaciones públicas. No hay demanda o beneficio demostrados | Mantener H01–H05 como hipótesis y una matriz de afirmaciones; abierto para tareas de comprensión |
| CR02 | ¿Existe una evidencia actual de ausencia del inspector en el mercado? | No. El tracking tiene precedentes y parte de su evidencia es indexada/antigua | Retirar cualquier lectura de exclusividad; comparar contra ayuda convencional, no contra una interfaz artificialmente pobre |
| CR03 | ¿El directo permite seleccionar nuevas cuotas coherentes? | El seguimiento estaba definido; la oferta de nuevas apuestas después del inicio no. Era un hueco de producto real | Definir oferta por fase: builder prepartido y simples 1X2 en dos snapshots de directo. No reutilizar cuotas prepartido. Corregido en contrato y casos C42/C43 |
| CR04 | ¿Cambiar de Home a Away requiere una confirmación? | El borrador no compromete dinero. Confirmar cada cambio reversible añade fricción sin resolver una incompatibilidad real | Sustitución inmediata dentro del mismo grupo con feedback y Undo; nunca almacenar ambas. Cambios de tipo/envío siguen explícitos. C22 revisado |
| CR05 | ¿Un supuesto parcial siempre deja el ticket indeterminado? | No: empate al terminar 90 minutos hace perder Home, por tanto el builder Home+Over+Player no puede cobrar aunque falten otros datos | Separar estado de condiciones de conclusión conjunta. Retorno hipotético £0 sin resolver las demás. Corregido; C37 |
| CR06 | ¿«Redondear a peniques» basta para Claude? | No: falta qué hacer con medio penique y cuándo redondear una combinada | HALF_UP una vez sobre el retorno final; productos sin redondear entre piernas. Ejemplo £1.25×2.10=£2.625→£2.63. Corregido; C38 |
| CR07 | ¿Las ventanas de límites son inequívocas? | El texto mezclaba «24 h» con día natural local. En cambios horarios no son equivalentes y medianoche puede parecer una reposición universal | Elegir últimas 24 h y últimos 7 días por tiempo transcurrido; mes natural Europe/London. Es política propia, no interpretación universal de RTS. Fechar depósitos y definir borde. C39/C40 |
| CR08 | ¿Accesibilidad de límites está traducida a navegación? | RTS 12C se había consultado, pero Home no exigía enlace directo y visible a límites | Home y depósito enlazan directamente a V12, sin pasar por cuenta/menús intermedios. Corregido; C41 |
| CR09 | ¿El inspector cabe junto al ticket en laptop? | «Junto al ticket» podía producir cuatro columnas: navegación, mercados, ticket e inspector | Resolver dentro de la misma superficie del ticket; ninguna cuarta columna obligatoria. Un solo panel/modal activo en móvil. Decisión de composición documentada; falta verla |
| CR10 | ¿La navegación refleja realmente el pequeño catálogo? | All/Main podía duplicar contenido y generar apariencia de amplitud ficticia | Eliminar Main de la base; solo categorías con contenido distinto. No aumentar catálogo para rellenar pantalla |
| CR11 | ¿El primer recorrido muestra más reglamento que diseño? | Riesgo claro: las excepciones crecían más rápido que la comprobación de la propuesta principal | Priorizar selección→revisión→directo→void. Abandono/exclusión/reliquidación quedan disponibles como escenarios secundarios, no onboarding obligatorio |
| CR12 | ¿El nombre recomendado está cerrado? | No. Ternside tiene similitudes por revisar; .com sin registro devuelto no es compra disponible ni registro de marca libre | Mantenerlo como nombre de trabajo. Bloquea la etiqueta «branding final», no la investigación o composición interna reversible |
| CR13 | ¿Contraste calculado significa accesibilidad? | No. Faltan foco, controles, reflow, anuncios y teclado; una imagen tampoco los prueba | Añadir protocolo visual y comprobaciones de interacción posteriores, con evidencia separada |
| CR14 | ¿Las fuentes de precio cambiado y void sostienen las afirmaciones? | Relectura de S31/S37/S48 confirma esos precedentes documentales; no demuestra su buena usabilidad | Se conserva la atribución; sospecha descartada, sin fabricar un defecto de competidor |
| CR15 | ¿La galería de una tienda cubre la brecha móvil? | No: marketing, recortes y versiones desconocidas no permiten probar teclado, navegación o envío | Separar cuatro capturas publicadas de las tres observaciones web; mantener brecha abierta |
| CR16 | ¿Un builder tiene la misma regla en Europa? | S02/S09/S37 muestran diferencias de void y de acceso al constructor | Hacer visible la regla propia; no extrapolar excepciones ni llamar error a toda agrupación automática |
| CR17 | ¿Preservar borradores por modo podría duplicar apuestas? | Sí: el texto anterior no fijaba propiedad de selecciones ni qué se consume al aceptar | Lista compartida de grupos, stakes distintos y consumo confirmado; C45/C46 |
| CR18 | ¿Editar o convertir un builder crea otra fila? | Faltaba distinguir edición, conversión y apuestas independientes con condiciones compartidas | IDs estables, reemplazo explícito y stake vacío en conversión; C47/C48 |
| CR19 | ¿Una bandera o formato alternativo demostraría cobertura europea? | No: ANJ muestra diferencias en mercados y controles; una traducción no las resuelve | Una variante coherente, sin selectores ficticios; navegación móvil y retorno definidos para componer |

No se ha encontrado otro concepto más interesante que active la parada D15. Estos cambios pulen el concepto actual. Si una prueba posterior muestra que el inspector perjudica o no aporta, se recortará; no se conservará solo para justificar la inversión de research.

## Afirmaciones con carga de prueba

| Afirmación | Evidencia disponible | Qué podría refutarla | Estado permitido en el case study |
| --- | --- | --- | --- |
| Hay precedentes de chat, builder y tracking | Documentación identificada y fechada | Cambio de oferta o acceso; revisar país/fecha | Hecho documental acotado |
| Las reglas tienen consecuencias distintas para el ticket | Reglas primarias y ejemplos propios calculados | Fuente mal atribuida o política del concepto incoherente | Hecho de dominio + decisión propia separados |
| El inspector mejora comprensión | Ninguna medición del concepto | Mismos errores, más ayuda o confusión con probabilidad | Hipótesis, nunca mejora conseguida |
| La continuidad de representación aporta una diferencia útil | Propuesta de ejecución, sin exclusividad demostrada | Ayuda compacta produce igual comprensión con menor carga | Hipótesis de diseño |
| El diseño es reconocible y rápido para habituales | Primeros borradores SC01; sin tareas con usuarios ni app | No encuentran cuota, tipo o CTA; perciben un tutorial | Pendiente de composición/tareas |
| Ternside y dirección A son la mejor marca | Filtro de nombres y argumentos visuales, sin prueba aplicada | Mala lectura, interferencia de marca, poco carácter deportivo | Recomendación provisional |
| La demo está lista para implementar | Specs, datos y comprobaciones documentales | Huecos visuales, recursos ausentes o flows ambiguos | No; faltan diseño y handoff final |

## Dejar de expandir no significa dejar de revisar

El siguiente paso no necesita más features para parecer innovador. Sí necesita un ticket compacto, una comparación justa de explicación y estados difíciles bien representados. Cada nueva búsqueda debe responder a una duda que pueda cambiar una decisión; cada nueva iteración visual debe corregir un defecto registrado.

No se puede probar «la mejor versión posible» de forma absoluta. Se puede exigir una versión revisada sin defectos críticos conocidos, coherente con el brief y con sus límites de evidencia explícitos. El [protocolo de revisión](../project/quality-review-protocol.md) fija esa salida y conserva las iteraciones reales.
