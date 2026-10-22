import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
const visible = (el: HTMLElement) => el.getClientRects().length > 0

/**
 * Modal behaviour for sheets and dialogs: moves focus inside, traps Tab,
 * closes on Escape, makes the page behind inert, and gives focus back to
 * whatever opened it.
 */
export function useModal<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const root = ref.current
    const t = setTimeout(() => {
      const first = root && [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].find(visible)
      ;(first ?? root)?.focus()
    }, 80)
    const behind = [...document.querySelectorAll<HTMLElement>('#main, header, nav[aria-label="Primary"], nav[aria-label="Sports"]')].filter((el) => root && !el.contains(root))
    behind.forEach((el) => el.setAttribute('inert', ''))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close.current()
      }
      if (e.key === 'Tab' && root) {
        const items = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(visible)
        if (!items.length) return
        const [a, z] = [items[0], items[items.length - 1]]
        if (e.shiftKey && document.activeElement === a) (e.preventDefault(), z.focus())
        else if (!e.shiftKey && document.activeElement === z) (e.preventDefault(), a.focus())
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey, true)
      behind.forEach((el) => el.removeAttribute('inert'))
      if (opener && document.contains(opener)) opener.focus()
    }
  }, [open])
  return ref
}
