# Plan de test de usabilidad · Ternside

Revisión 2 · 22-10-2026, tras la revisión de Astra. Un test real y ligero sobre la demo para el case study. Objetivo: tener evidencia propia, pequeña pero verdadera. **No hay resultados todavía; nada de este documento es un hallazgo.**

## Qué queremos saber

Cinco preguntas, una por tarea principal:

1. ¿Se entiende qué pasa con un Bet Builder cuando una condición es void?
2. ¿Se distingue un umbral provisional en directo de una apuesta ya pagada?
3. ¿Se entiende el dinero del Cash Out (cuánto se recibe y cuánto se pierde en neto)?
4. ¿Se llega a los límites de depósito sin buscarlos?
5. ¿Se entiende que una free bet no devuelve su stake y no es dinero retirable?

El «20 % relevante» es una **heurística de diseño**, no una hipótesis que este test pueda validar. Como mucho podemos observar si alguien echa algo en falta (pregunta abierta final) y si encuentra un partido plegado (tarea secundaria S1).

## Participantes

- 5–8 adultos (18+) que hayan apostado en deportes en el último año: al menos 3 ocasionales y 2 habituales.
- Opcional: 1–2 personas que no apuestan. **No son un grupo de control**: con este n no permiten inferencias causales. Sirven para detectar jerga que solo entiende quien ya apuesta.
- Sin dinero real ni datos de cuentas reales. Demo con Fresh start, fondos ficticios.

## Formato

- Moderado en remoto, 30 minutos, pensando en voz alta, con grabación de pantalla y consentimiento.
- Dispositivo: la mitad en móvil (enlace en su propio teléfono) y la mitad en escritorio.
- Se prueba solo la demo interactiva. **No se compara con capturas estáticas de otro sportsbook**: una captura y un prototipo interactivo no son condiciones equivalentes y la comparación no sería honesta.

## Tareas principales

| # | Tarea (lo que se dice al participante) | Éxito | Qué medir |
| --- | --- | --- | --- |
| T1 | Caso A o B (ver abajo). «Antes de apostar: si pasa esto, ¿qué ocurre con esta apuesta de tres condiciones y cuánto cobrarías?» | Dice que la condición se anula, la apuesta sigue a otra cuota y da el importe | Respuesta sin ayuda; después, el otro caso con Explore outcomes |
| T2 | Escena Live tracking. «¿Has ganado ya la condición de Over 2.5?» | Dice que va bien pero aún no está pagada | Comprensión de «provisional» |
| T3 | Escena Cash Out. «Si haces Cash Out ahora, ¿cuánto recibes y cuánto pierdes respecto a lo apostado?» | £8 recibidos, −£2 en neto | Comprensión del dinero |
| T4 | «Pon un límite de depósito diario más bajo.» | Lo cambia sin pasar por Account | Ruta, tiempo |
| T5 | Escena «Free bet ready». «Usa tu free bet de £5 en Eastford a 1.80. ¿Cuánto te devolvería si gana?» | £4.00, porque el stake de la free bet no se devuelve | Comprensión de free bet frente a dinero |

**T1 con casos equivalentes y orden alterno.** Para no medir el aprendizaje del primer intento como efecto de Explore outcomes, se usan dos casos de la misma dificultad:

- Caso A: «Costa no juega» → la apuesta sigue con dos condiciones a 2.70 (£27 por £10).
- Caso B: «Se suspende el partido con 2–1 y Costa lleva un tiro» → solo cuenta el Over a 1.80 (£18 por £10).

La mitad de los participantes hace A sin ayuda y B con Explore outcomes; la otra mitad, al revés. Se informa de cada caso por separado.

## Tareas secundarias (si sobra tiempo)

- S1 «Busca un partido de la Caspian Super League.» Hallabilidad de lo plegado.
- S2 Apostar £10 al Bet Builder y encontrarlo después en My Bets. SEQ de 1 a 7.

**Al final:** SUS (10 preguntas) y tres preguntas abiertas: qué echaste en falta, qué te sobró y qué te ha parecido distinto de tu sportsbook habitual.

## Cómo se cuenta en el case study

- Se informa del n real, de los éxitos por tarea con su denominador («4 de 6 encontraron el límite sin ayuda»), de los rangos de tiempo y de citas literales.
- Con 5–8 personas no se calculan porcentajes de mejora ni significancia, ni se afirma que un cambio de diseño «mejoró» algo. Se habla de patrones y problemas encontrados.
- Cada problema detectado → el cambio de diseño que se hizo → el resultado de volver a probar, solo si hay una segunda ronda real con 3–5 personas.
- Lo que no se mida queda como hipótesis con la métrica prevista. **Ningún resultado se redacta antes de que exista.**
