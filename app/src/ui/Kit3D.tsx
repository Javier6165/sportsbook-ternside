import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import type { Crest, Participant } from '../data/catalog'

/**
 * Real-time 3D kits: an extruded, bulged shirt (or basketball vest) wearing the
 * team's colours and pattern, lit like a product shot. They fly in spinning,
 * settle with a soft spring, float, and lean towards the cursor.
 */

type Garment = 'shirt' | 'vest'

function shirtShape(kind: Garment) {
  const s = new THREE.Shape()
  if (kind === 'vest') {
    s.moveTo(-0.38, 1.22)
    s.quadraticCurveTo(0, 0.82, 0.38, 1.22) // round neck
    s.lineTo(0.62, 1.22)
    s.quadraticCurveTo(0.66, 0.55, 1.0, 0.42) // armhole
    s.lineTo(0.98, -1.2)
    s.quadraticCurveTo(0, -1.3, -0.98, -1.2)
    s.lineTo(-1.0, 0.42)
    s.quadraticCurveTo(-0.66, 0.55, -0.62, 1.22)
    s.closePath()
    return s
  }
  s.moveTo(-0.34, 1.22)
  s.quadraticCurveTo(0, 0.86, 0.34, 1.22) // collar
  s.lineTo(0.78, 1.12)
  s.lineTo(1.42, 0.68) // shoulder → sleeve top
  s.lineTo(1.22, 0.14) // sleeve cuff
  s.lineTo(0.92, 0.32) // under sleeve
  s.lineTo(0.94, -1.2)
  s.quadraticCurveTo(0, -1.3, -0.94, -1.2)
  s.lineTo(-0.92, 0.32)
  s.lineTo(-1.22, 0.14)
  s.lineTo(-1.42, 0.68)
  s.lineTo(-0.78, 1.12)
  s.closePath()
  return s
}

function makeGeometry(kind: Garment) {
  // A thin fabric shell, not a block: tiny depth, soft rounded edge.
  const g = new THREE.ExtrudeGeometry(shirtShape(kind), { depth: 0.03, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 5, curveSegments: 36, steps: 1 })
  g.translate(0, 0, -0.015)
  const p = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const z = p.getZ(i)
    // gentle torso curve + a few soft folds; front and back move together so it stays thin
    const torso = Math.max(0, 1 - (x / 1.1) ** 2) * 0.16
    const folds = 0.022 * Math.sin(y * 7.5 + x * 2.2) * Math.max(0, 1 - Math.abs(x)) + 0.014 * Math.sin(x * 11 - y * 3)
    const hem = y < -0.9 ? (y + 0.9) * -0.08 : 0
    p.setZ(i, z + torso + folds + hem)
  }
  g.computeVertexNormals()
  return g
}

function kitTexture(c: Crest, kind: Garment, mark: string) {
  const W = 1024
  const cv = document.createElement('canvas')
  cv.width = cv.height = W
  const x = cv.getContext('2d')!
  x.fillStyle = c.c1
  x.fillRect(0, 0, W, W)
  x.fillStyle = c.c2
  switch (c.pattern) {
    case 'stripes':
      for (let i = -1; i < 9; i++) x.fillRect(i * 128 + 40, 0, 56, W)
      break
    case 'hoops':
      for (let i = 0; i < 8; i++) x.fillRect(0, i * 128 + 30, W, 52)
      break
    case 'half':
      x.fillRect(W / 2, 0, W / 2, W)
      break
    case 'sash':
      x.save()
      x.translate(W / 2, W / 2)
      x.rotate(-Math.PI / 4)
      x.fillRect(-W, -70, W * 2, 140)
      x.restore()
      break
    case 'chevron':
      x.beginPath()
      x.moveTo(0, 300)
      x.lineTo(W / 2, 560)
      x.lineTo(W, 300)
      x.lineTo(W, 400)
      x.lineTo(W / 2, 660)
      x.lineTo(0, 400)
      x.fill()
      break
    case 'quarters':
      x.fillRect(0, 0, W / 2, W / 2)
      x.fillRect(W / 2, W / 2, W / 2, W / 2)
      break
    case 'band':
      x.fillRect(0, 420, W, 150)
      break
  }
  // collar / armhole trim
  x.strokeStyle = c.c2 === '#FFFFFF' || c.pattern === 'solid' ? c.c2 : c.c1
  x.lineWidth = 26
  x.beginPath()
  x.arc(W / 2, kind === 'vest' ? 8 : 30, kind === 'vest' ? 190 : 150, 0.15 * Math.PI, 0.85 * Math.PI)
  x.stroke()
  // chest crest (wearer's left = viewer's right)
  const cx = W * 0.64
  const cy = W * 0.36
  x.fillStyle = c.c2
  x.beginPath()
  x.arc(cx, cy, 58, 0, Math.PI * 2)
  x.fill()
  x.fillStyle = c.c1
  x.beginPath()
  x.arc(cx, cy, 46, 0, Math.PI * 2)
  x.fill()
  x.fillStyle = c.c2
  x.font = '700 58px "Inter Tight Variable", Inter, sans-serif'
  x.textAlign = 'center'
  x.textBaseline = 'middle'
  x.fillText(mark, cx, cy + 3)
  // side seams and a sleeve cuff band in the secondary colour
  x.strokeStyle = 'rgba(0,0,0,0.18)'
  x.lineWidth = 3
  for (const u of [0.18, 0.82]) {
    x.beginPath()
    x.moveTo(u * W, W * 0.42)
    x.lineTo(u * W, W)
    x.stroke()
  }
  // fine knitted mesh, like a match shirt
  x.globalAlpha = 0.06
  x.strokeStyle = '#000'
  x.lineWidth = 1
  for (let i = -W; i < W; i += 6) {
    x.beginPath()
    x.moveTo(i, 0)
    x.lineTo(i + W, W)
    x.stroke()
  }
  x.globalAlpha = 1
  // soft fabric shading + weave
  const g = x.createRadialGradient(W / 2, W * 0.42, 60, W / 2, W / 2, W * 0.75)
  g.addColorStop(0, 'rgba(255,255,255,0.10)')
  g.addColorStop(1, 'rgba(0,0,0,0.28)')
  x.fillStyle = g
  x.fillRect(0, 0, W, W)
  const img = x.getImageData(0, 0, W, W)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  x.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(cv)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  // ExtrudeGeometry UVs are raw x/y; map the shape's bounds onto 0..1
  t.repeat.set(1 / 2.9, 1 / 2.6)
  t.offset.set(0.5, 0.5)
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  return t
}

const pointer = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  })
}

function useKitTexture(team: Participant, kind: Garment) {
  // Prefer a real front-view kit image (./images/kits/<team>.png, from Astra); fall back to a drawn kit.
  const fallback = useMemo(() => kitTexture(team.crest!, kind, team.crest!.mark ?? team.name[0]), [team, kind])
  const [tex, setTex] = useState<THREE.Texture>(fallback)
  useEffect(() => {
    let alive = true
    new THREE.TextureLoader().load(
      `./images/kits/${team.id}.png`,
      (t) => {
        if (!alive) return t.dispose()
        t.colorSpace = THREE.SRGBColorSpace
        t.anisotropy = 8
        t.repeat.copy(fallback.repeat)
        t.offset.copy(fallback.offset)
        setTex(t)
      },
      undefined,
      () => {},
    )
    return () => {
      alive = false
    }
  }, [team.id, fallback])
  return tex
}

function Kit({ team, kind, side, delay, still, hover }: { team: Participant; kind: Garment; side: -1 | 1; delay: number; still: boolean; hover: { current: boolean } }) {
  const ref = useRef<THREE.Group>(null)
  const geo = useMemo(() => makeGeometry(kind), [kind])
  const tex = useKitTexture(team, kind)
  const born = useRef<number | null>(null)
  useEffect(() => () => (geo.dispose(), tex.dispose()), [geo, tex])

  useFrame((state, dt) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    if (born.current === null) born.current = t
    const age = still ? 99 : Math.max(0, t - born.current - delay)
    // entrance: rise in with a quarter turn, ease-out, no bounce
    const e = 1 - (1 - Math.min(1, age / 1.1)) ** 3
    const restY = -side * 0.32
    // Hover reaction off for now (it jumped); `hover` stays wired for the textured revisit.
    void hover
    const h = 0
    g.position.x = side * 0.95 + (1 - e) * side * 0.6 + (still ? 0 : pointer.x * 0.06 * h)
    g.position.y = (1 - e) * -0.7 + (still ? 0 : Math.sin(t * 0.8 + side) * 0.012)
    g.position.z = side === -1 ? 0.3 : -0.3
    const turn = (1 - e) * -side * 0.9
    const target = restY + turn + (still ? 0 : Math.sin(t * 0.45 + side) * 0.035 + pointer.x * 0.28 * h)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target, 5, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.04 + (still ? 0 : pointer.y * 0.1 * h), 4, dt)
    g.rotation.z = side * 0.04
    g.scale.setScalar((0.86 + 0.14 * e) * (side === -1 ? 1 : 0.92) * (1 + 0.03 * h))
    const m = (g.children[0] as THREE.Mesh).material as THREE.Material[]
    for (const mat of m) mat.opacity = e
  })

  return (
    <group ref={ref} scale={0.86}>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial attach="material-0" map={tex} transparent roughness={0.82} sheen={0.9} sheenRoughness={0.45} sheenColor="#ffffff" envMapIntensity={0.6} side={THREE.DoubleSide} />
        <meshPhysicalMaterial attach="material-1" transparent color={team.crest!.c1} roughness={0.85} sheen={0.6} sheenColor="#ffffff" envMapIntensity={0.5} />
      </mesh>
    </group>
  )
}

export default function Kits3D({ home, away, kind = 'shirt' }: { home: Participant; away: Participant; kind?: Garment }) {
  const wrap = useRef<HTMLDivElement>(null)
  const hover = useRef(false)
  const [visible, setVisible] = useState(true)
  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useEffect(() => {
    const el = wrap.current
    if (!el) return
    // Render only while on screen.
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    // React to the cursor only while it is over the banner that holds the kits.
    const host = el.closest('section') ?? el
    const on = () => (hover.current = true)
    const off = () => (hover.current = false)
    host.addEventListener('pointerenter', on)
    host.addEventListener('pointerleave', off)
    return () => (io.disconnect(), host.removeEventListener('pointerenter', on), host.removeEventListener('pointerleave', off))
  }, [])
  if (!home.crest || !away.crest) return null
  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas frameloop={visible ? (still ? 'demand' : 'always') : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 7.6], fov: 32 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} />
        <directionalLight position={[-4, 1, -3]} intensity={1.2} color="#86a8ff" />
        <Environment resolution={256} frames={1} environmentIntensity={0.6}>
          <Lightformer form="rect" intensity={3} position={[0, 3, 4]} scale={[6, 2, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[-5, 0, 2]} scale={[2, 6, 1]} color="#c8d4ff" />
          <Lightformer form="ring" intensity={2} position={[5, 1, -2]} scale={2} color="#ffd9c2" />
        </Environment>
        <Kit team={away} kind={kind} side={1} delay={0.15} still={still} hover={hover} />
        <Kit team={home} kind={kind} side={-1} delay={0} still={still} hover={hover} />
      </Canvas>
    </div>
  )
}
