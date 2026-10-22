import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
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
  const g = new THREE.ExtrudeGeometry(shirtShape(kind), { depth: 0.22, bevelEnabled: true, bevelThickness: 0.16, bevelSize: 0.1, bevelSegments: 8, curveSegments: 28, steps: 1 })
  g.translate(0, 0, -0.11)
  // Bulge the front and back so it reads as fabric over a torso, not a flat cookie.
  const p = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i)
    const y = p.getY(i)
    const z = p.getZ(i)
    const chest = Math.max(0, 1 - (x / 1.05) ** 2) * (0.75 + 0.25 * Math.cos(y * 1.2))
    const sign = z >= 0 ? 1 : -1
    p.setZ(i, z + sign * chest * 0.26)
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

function Kit({ team, kind, side, delay }: { team: Participant; kind: Garment; side: -1 | 1; delay: number }) {
  const ref = useRef<THREE.Group>(null)
  const geo = useMemo(() => makeGeometry(kind), [kind])
  const tex = useMemo(() => kitTexture(team.crest!, kind, team.crest!.mark ?? team.name[0]), [team, kind])
  const born = useRef<number | null>(null)
  useEffect(() => () => (geo.dispose(), tex.dispose()), [geo, tex])

  useFrame((state, dt) => {
    const g = ref.current
    if (!g) return
    const t = state.clock.elapsedTime
    if (born.current === null) born.current = t
    const age = Math.max(0, t - born.current - delay)
    // entrance: spring-ish ease from off-stage, spinning
    const k = 1 - Math.exp(-age * 3.2) * Math.cos(age * 5.5) * 0.85
    const p = Math.min(1, age / 1.6)
    const e = 1 - (1 - p) ** 4
    const baseX = side * 0.95
    const baseZ = side === -1 ? 0.35 : -0.35
    g.position.x = THREE.MathUtils.lerp(side * 6, baseX, e) + pointer.x * 0.18 * (side === -1 ? 1 : 0.6)
    g.position.y = THREE.MathUtils.lerp(-1.2, 0, e) + Math.sin(t * 1.1 + side) * 0.06 - pointer.y * 0.1
    g.position.z = baseZ
    const spin = (1 - e) * Math.PI * 2.5 * -side
    const idle = Math.sin(t * 0.55 + side * 1.3) * 0.28
    const target = -side * 0.42 + idle + pointer.x * 0.35 + spin
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target, 6, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.06 + pointer.y * 0.12, 4, dt)
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, side * 0.06 + Math.sin(t * 0.7) * 0.02, 4, dt)
    const sc = Math.max(0.001, Math.min(1, k)) * (side === -1 ? 1 : 0.92)
    g.scale.setScalar(sc)
  })

  return (
    <group ref={ref} scale={0.001}>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial attach="material-0" map={tex} roughness={0.72} sheen={0.8} sheenRoughness={0.5} sheenColor="#ffffff" clearcoat={0.12} envMapIntensity={0.7} />
        <meshPhysicalMaterial attach="material-1" color={team.crest!.c1} roughness={0.8} sheen={0.6} sheenColor="#ffffff" envMapIntensity={0.5} />
      </mesh>
    </group>
  )
}

export default function Kits3D({ home, away, kind = 'shirt' }: { home: Participant; away: Participant; kind?: Garment }) {
  if (!home.crest || !away.crest) return null
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7.6], fov: 32 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} style={{ pointerEvents: 'none' }}>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 4, 5]} intensity={2.6} />
      <directionalLight position={[-4, 1, -3]} intensity={1.4} color="#86a8ff" />
      <Environment resolution={256} frames={1} environmentIntensity={0.6}>
        <Lightformer form="rect" intensity={3} position={[0, 3, 4]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} position={[-5, 0, 2]} scale={[2, 6, 1]} color="#c8d4ff" />
        <Lightformer form="ring" intensity={2} position={[5, 1, -2]} scale={2} color="#ffd9c2" />
      </Environment>
      <Kit team={away} kind={kind} side={1} delay={0.25} />
      <Kit team={home} kind={kind} side={-1} delay={0} />
    </Canvas>
  )
}
