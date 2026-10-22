/** Score with real spacing around the dash, so tight display tracking never makes digits touch it. */
export function Score({ a, b }: { a: number | string; b: number | string }) {
  return (
    <span className="inline-flex items-baseline">
      <span>{a}</span>
      <span className="mx-[0.14em] opacity-60">–</span>
      <span>{b}</span>
    </span>
  )
}
