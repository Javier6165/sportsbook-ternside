export function Wordmark({ className = '', size = 30 }: { className?: string; size?: number }) {
  return (
    <span className={`display leading-none select-none ${className}`} style={{ fontSize: size }} aria-label="Ternside">
      Ternside
    </span>
  )
}
