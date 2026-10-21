export function Wordmark({ className = '', size = 26 }: { className?: string; size?: number }) {
  return (
    <span className={`font-display leading-none font-[780] tracking-[-0.032em] select-none ${className}`} style={{ fontSize: size }} aria-label="Ternside">
      Ter<span className="ml-[0.035em]">n</span>side<span className="text-action">.</span>
    </span>
  )
}
