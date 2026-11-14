import { useEffect, useRef } from 'react'
import { useNavigation } from '../context/NavigationContext'

// ============================================================================
// SELF-HEALING PARTICLE & DOT CANVAS CONTROLLER (Module-Level Singleton)
// ============================================================================

interface Dot {
  col: number
  row: number
  x: number
  y: number
  baseX: number
  baseY: number
  vx: number
  vy: number
  size: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

interface EmberParticle {
  x: number
  y: number
  baseX: number
  z: number
  radius: number
  baseAlpha: number
  speed: number
  wobbleSpeed: number
  wobbleAmp: number
  phase: number
  isWarmWhite: boolean
  pushX: number
  pushY: number
  glow: number
}

type QualityLevel = 'high' | 'medium' | 'low'

const DOT_SPACING = 40
const CURSOR_RADIUS = 140
const CURSOR_RADIUS_SQ = CURSOR_RADIUS * CURSOR_RADIUS
const PARTICLE_REPULSION_RADIUS = 120
const PARTICLE_REPULSION_RADIUS_SQ = PARTICLE_REPULSION_RADIUS * PARTICLE_REPULSION_RADIUS

function createGlowSprite(color: string, coreColor: string, size = 32): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const sCtx = canvas.getContext('2d')
  if (!sCtx) return canvas

  const center = size / 2
  const grad = sCtx.createRadialGradient(center, center, 0, center, center, center)
  grad.addColorStop(0, coreColor)
  grad.addColorStop(0.28, color)
  grad.addColorStop(0.65, color)
  grad.addColorStop(1, 'rgba(0,0,0,0)')

  sCtx.fillStyle = grad
  sCtx.beginPath()
  sCtx.arc(center, center, center, 0, Math.PI * 2)
  sCtx.fill()
  return canvas
}

class ParticleCanvasController {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private animId: number | null = null
  private watchdogId: number | null = null

  private isDestroyed = true
  private isPaused = false
  private isReduced = false
  private isMobile = false

  private lastFrameTime = 0
  private lastFrameDrawnTime = 0

  private quality: QualityLevel = 'high'
  private frameCount = 0
  private fpsTimer = 0
  private highFpsDuration = 0

  private currentBrightness = 1.0
  private targetBrightness = 1.0

  private width = 0
  private height = 0
  private dpr = 1
  private cols = 0
  private rows = 0

  private dots: Dot[] = []
  private grid: Dot[][] = []
  private ripples: Ripple[] = []
  private particles: EmberParticle[] = []

  private emberSprite: HTMLCanvasElement | null = null
  private warmWhiteSprite: HTMLCanvasElement | null = null

  private mouse = { x: -1000, y: -1000, prevX: -1000, prevY: -1000, speed: 0 }
  private smoothMx = 0
  private smoothMy = 0
  private isMouseMoving = false
  private mouseMoveTimeout: number | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.emberSprite = createGlowSprite('rgba(255, 91, 31, 0.75)', 'rgba(255, 145, 85, 0.95)', 32)
      this.warmWhiteSprite = createGlowSprite('rgba(255, 235, 220, 0.70)', 'rgba(255, 255, 255, 0.95)', 32)
    }
  }

  public mount(canvas: HTMLCanvasElement) {
    this.stop()
    this.canvas = canvas
    this.isDestroyed = false
    this.isPaused = document.hidden

    this.ctx = canvas.getContext('2d', { alpha: true })
    this.isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.recomputeSize()
    this.attachEventListeners()
    this.startWatchdog()

    if (this.isReduced || this.isMobile) {
      this.drawSettledField()
    } else {
      this.ensureRunning()
    }
  }

  public unmount() {
    this.stop()
    this.stopWatchdog()
    this.removeEventListeners()
    this.isDestroyed = true
    this.canvas = null
    this.ctx = null
  }

  public setSection(sectionId: string) {
    this.targetBrightness = sectionId === 'hero' ? 1.0 : 0.60
  }

  public getQuality(): QualityLevel {
    return this.quality
  }

  public start() {
    this.stop() // Always cancel previous frame to avoid multiple concurrent loops
    if (this.isDestroyed || !this.canvas || this.isPaused || this.isReduced || this.isMobile) return

    this.lastFrameTime = performance.now()
    this.lastFrameDrawnTime = performance.now()
    this.animId = requestAnimationFrame(this.loop)
  }

  public stop() {
    if (this.animId !== null) {
      cancelAnimationFrame(this.animId)
      this.animId = null
    }
  }

  public ensureRunning() {
    if (this.isDestroyed || !this.canvas || this.isPaused || this.isReduced || this.isMobile) return
    if (this.animId === null) {
      this.start()
    }
  }

  private startWatchdog() {
    this.stopWatchdog()
    this.watchdogId = window.setInterval(() => {
      if (this.isDestroyed || this.isPaused || !this.canvas || this.isReduced || this.isMobile) return
      const now = performance.now()
      if (now - this.lastFrameDrawnTime > 1500) {
        this.ensureRunning()
      }
    }, 1000)
  }

  private stopWatchdog() {
    if (this.watchdogId !== null) {
      clearInterval(this.watchdogId)
      this.watchdogId = null
    }
  }

  private getParticleCount(): number {
    if (this.isMobile || this.isReduced) return 0
    const isTablet = this.width >= 768 && this.width < 1024
    if (isTablet) {
      if (this.quality === 'high') return 20
      if (this.quality === 'medium') return 12
      return 6
    }
    // Desktop >= 1024px
    if (this.quality === 'high') return 40
    if (this.quality === 'medium') return 24
    return 12 // Low quality still shows 12 particles; never zero
  }

  private initParticles() {
    this.particles = []
    const count = this.isMobile ? 10 : this.getParticleCount()

    for (let i = 0; i < count; i++) {
      const z = 0.15 + Math.random() * 0.85
      const isWarmWhite = Math.random() < 0.15
      const baseX = Math.random() * this.width

      this.particles.push({
        x: baseX,
        y: Math.random() * this.height,
        baseX,
        z,
        radius: 1.0 + z * 1.8,
        baseAlpha: isWarmWhite ? 0.20 + z * 0.35 : 0.24 + z * 0.38,
        speed: 8 + z * 17,
        wobbleSpeed: 0.7 + (1 - z) * 1.1,
        wobbleAmp: 10 + z * 16,
        phase: Math.random() * Math.PI * 2,
        isWarmWhite,
        pushX: 0,
        pushY: 0,
        glow: 1,
      })
    }
  }

  private recomputeSize() {
    if (!this.canvas) return
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.isMobile = this.width < 768

    this.canvas.width = Math.round(this.width * this.dpr)
    this.canvas.height = Math.round(this.height * this.dpr)
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`

    if (!this.ctx) {
      this.ctx = this.canvas.getContext('2d', { alpha: true })
    }
    if (this.ctx) {
      this.ctx.resetTransform()
      this.ctx.scale(this.dpr, this.dpr)
    }

    this.cols = Math.ceil(this.width / DOT_SPACING) + 1
    this.rows = Math.ceil(this.height / DOT_SPACING) + 1

    this.dots = []
    this.grid = Array.from({ length: this.cols }, () => [])

    if (this.width >= 1024) {
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          const x = i * DOT_SPACING
          const y = j * DOT_SPACING
          const dot: Dot = {
            col: i,
            row: j,
            x,
            y,
            baseX: x,
            baseY: y,
            vx: 0,
            vy: 0,
            size: 1.1,
          }
          this.dots.push(dot)
          this.grid[i][j] = dot
        }
      }
    }

    this.initParticles()
  }

  private drawSettledField() {
    if (!this.ctx) return
    try {
      this.ctx.clearRect(0, 0, this.width, this.height)

      this.ctx.fillStyle = 'rgba(245, 245, 247, 0.045)'
      this.ctx.beginPath()
      const spacing = this.width < 768 ? 48 : DOT_SPACING
      const staticCols = Math.ceil(this.width / spacing) + 1
      const staticRows = Math.ceil(this.height / spacing) + 1
      for (let i = 0; i < staticCols; i++) {
        for (let j = 0; j < staticRows; j++) {
          this.ctx.rect(i * spacing - 0.75, j * spacing - 0.75, 1.5, 1.5)
        }
      }
      this.ctx.fill()

      for (let pIdx = 0; pIdx < this.particles.length; pIdx++) {
        const p = this.particles[pIdx]
        const sprite = p.isWarmWhite ? this.warmWhiteSprite : this.emberSprite
        if (!sprite) continue
        const r = p.radius
        this.ctx.globalAlpha = p.baseAlpha * 0.7
        this.ctx.drawImage(sprite, p.x - r, p.y - r, r * 2, r * 2)
      }
      this.ctx.globalAlpha = 1
    } catch (e) {
      console.warn('[ParticleCanvas] Error in drawSettledField:', e)
    }
  }

  private loop = (now: number) => {
    if (this.isDestroyed || this.isPaused) {
      this.animId = null
      return
    }

    // Clamp delta time to max 50ms so a long frame or tab switch never causes a jump
    const dt = Math.min((now - this.lastFrameTime) / 1000, 0.05)
    this.lastFrameTime = now
    this.lastFrameDrawnTime = now

    // Measure FPS over 2s and adjust quality level
    this.frameCount++
    if (now - this.fpsTimer >= 2000) {
      const elapsed = (now - this.fpsTimer) / 1000
      const currentFps = this.frameCount / elapsed
      this.frameCount = 0
      this.fpsTimer = now

      // Drop quality if under 40 FPS
      if (currentFps < 40) {
        if (this.quality === 'high') {
          this.quality = 'medium'
          this.initParticles()
        } else if (this.quality === 'medium') {
          this.quality = 'low'
          this.initParticles()
        }
        this.highFpsDuration = 0
      } else if (currentFps >= 55) {
        // Rise one level if above 55 FPS for 5 seconds
        this.highFpsDuration += elapsed
        if (this.highFpsDuration >= 5.0) {
          if (this.quality === 'low') {
            this.quality = 'medium'
            this.initParticles()
          } else if (this.quality === 'medium') {
            this.quality = 'high'
            this.initParticles()
          }
          this.highFpsDuration = 0
        }
      } else {
        this.highFpsDuration = 0
      }
    }

    try {
      this.renderFrame(dt)
    } catch (err) {
      console.error('[ParticleCanvas] Error during renderFrame:', err)
    }

    // Schedule next frame
    this.animId = requestAnimationFrame(this.loop)
  }

  private renderFrame(dt: number) {
    if (!this.canvas) return
    if (!this.ctx) {
      this.ctx = this.canvas.getContext('2d', { alpha: true })
      if (!this.ctx) return
    }

    const ctx = this.ctx
    ctx.clearRect(0, 0, this.width, this.height)

    // Ease section brightness (hero = 1.0, other sections = 0.60)
    this.currentBrightness += (this.targetBrightness - this.currentBrightness) * Math.min(dt * 3.5, 0.25)

    // Parallax interpolation
    const hasCursor =
      this.mouse.x >= -CURSOR_RADIUS &&
      this.mouse.x <= this.width + CURSOR_RADIUS &&
      this.mouse.y >= -CURSOR_RADIUS &&
      this.mouse.y <= this.height + CURSOR_RADIUS
    const targetMx = hasCursor ? (this.mouse.x / this.width - 0.5) * 2 : 0
    const targetMy = hasCursor ? (this.mouse.y / this.height - 0.5) * 2 : 0
    this.smoothMx += (targetMx - this.smoothMx) * 0.08
    this.smoothMy += (targetMy - this.smoothMy) * 0.08

    // ==========================================
    // 1. RENDER DOT FIELD (Desktop only >= 1024px)
    // ==========================================
    if (this.width >= 1024) {
      for (let r = this.ripples.length - 1; r >= 0; r--) {
        const rip = this.ripples[r]
        rip.radius += 6.5
        rip.alpha *= 0.94
        if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) {
          this.ripples.splice(r, 1)
        }
      }

      let minCol = 0
      let maxCol = this.cols - 1
      let minRow = 0
      let maxRow = this.rows - 1

      if (hasCursor) {
        minCol = Math.max(0, Math.floor((this.mouse.x - CURSOR_RADIUS) / DOT_SPACING))
        maxCol = Math.min(this.cols - 1, Math.ceil((this.mouse.x + CURSOR_RADIUS) / DOT_SPACING))
        minRow = Math.max(0, Math.floor((this.mouse.y - CURSOR_RADIUS) / DOT_SPACING))
        maxRow = Math.min(this.rows - 1, Math.ceil((this.mouse.y + CURSOR_RADIUS) / DOT_SPACING))
      }

      const glowingDots: { x: number; y: number; r: number; alpha: number }[] = []
      ctx.beginPath()

      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          const dot = this.grid[i]?.[j]
          if (!dot) continue

          let targetX = dot.baseX
          let targetY = dot.baseY
          let glowIntensity = 0

          if (hasCursor && i >= minCol && i <= maxCol && j >= minRow && j <= maxRow) {
            const dx = dot.x - this.mouse.x
            const dy = dot.y - this.mouse.y
            const distSq = dx * dx + dy * dy

            if (distSq < CURSOR_RADIUS_SQ && distSq > 0) {
              const dist = Math.sqrt(distSq)
              const factor = 1 - dist / CURSOR_RADIUS
              const push = factor * 22
              targetX = dot.baseX + (dx / dist) * push
              targetY = dot.baseY + (dy / dist) * push
              glowIntensity = factor * (0.6 + this.mouse.speed * 0.4)
            }
          }

          for (let r = 0; r < this.ripples.length; r++) {
            const rip = this.ripples[r]
            const rdx = dot.x - rip.x
            const rdy = dot.y - rip.y
            const rdist = Math.hypot(rdx, rdy)
            const waveDist = Math.abs(rdist - rip.radius)
            if (waveDist < 36) {
              const ripFactor = (1 - waveDist / 36) * rip.alpha
              const ripPush = ripFactor * 14
              if (rdist > 0) {
                targetX += (rdx / rdist) * ripPush
                targetY += (rdy / rdist) * ripPush
              }
              glowIntensity = Math.max(glowIntensity, ripFactor * 0.75)
            }
          }

          const diffX = targetX - dot.x
          const diffY = targetY - dot.y

          if (
            Math.abs(diffX) > 0.1 ||
            Math.abs(diffY) > 0.1 ||
            Math.abs(dot.vx) > 0.1 ||
            Math.abs(dot.vy) > 0.1
          ) {
            dot.vx += diffX * 0.14
            dot.vy += diffY * 0.14
            dot.vx *= 0.72
            dot.vy *= 0.72
            dot.x += dot.vx
            dot.y += dot.vy
          } else {
            dot.x = targetX
            dot.y = targetY
            dot.vx = 0
            dot.vy = 0
          }

          if (glowIntensity > 0.05) {
            glowingDots.push({
              x: dot.x,
              y: dot.y,
              r: 1.1 + glowIntensity * 1.4,
              alpha: Math.min(1, 0.2 + glowIntensity * 0.8),
            })
          } else {
            ctx.rect(dot.x - 0.75, dot.y - 0.75, 1.5, 1.5)
          }
        }
      }

      ctx.fillStyle = 'rgba(245, 245, 247, 0.045)'
      ctx.fill()

      for (let g = 0; g < glowingDots.length; g++) {
        const item = glowingDots[g]
        ctx.beginPath()
        ctx.arc(item.x, item.y, item.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 91, 31, ${item.alpha})`
        ctx.fill()
      }
    }

    // ==========================================
    // 2. RENDER EMBER PARTICLES (Never stopped, continuous to footer)
    // ==========================================
    for (let pIdx = 0; pIdx < this.particles.length; pIdx++) {
      const p = this.particles[pIdx]

      p.y -= p.speed * dt
      p.phase += p.wobbleSpeed * dt
      const currentX = p.baseX + Math.sin(p.phase) * p.wobbleAmp

      if (p.y < -15) {
        p.y = this.height + 15 + Math.random() * 20
        p.baseX = Math.random() * this.width
        p.phase = Math.random() * Math.PI * 2
      }

      let edgeFade = 1.0
      if (p.y < 80) {
        edgeFade = Math.max(0, p.y / 80)
      } else if (p.y > this.height - 80) {
        edgeFade = Math.max(0, (this.height - p.y) / 80)
      }

      let targetPushX = 0
      let targetPushY = 0
      let targetGlow = 1.0

      if (hasCursor) {
        const dx = currentX - this.mouse.x
        const dy = p.y - this.mouse.y
        const dSq = dx * dx + dy * dy

        if (dSq < PARTICLE_REPULSION_RADIUS_SQ && dSq > 0) {
          const dist = Math.sqrt(dSq)
          const factor = 1 - dist / PARTICLE_REPULSION_RADIUS
          const push = factor * 22 * p.z
          targetPushX = (dx / dist) * push
          targetPushY = (dy / dist) * push
          targetGlow = 1 + factor * 0.75
        }
      }

      p.pushX += (targetPushX - p.pushX) * 0.16
      p.pushY += (targetPushY - p.pushY) * 0.16
      p.glow += (targetGlow - p.glow) * 0.16

      const parallaxX = this.smoothMx * 14 * p.z
      const parallaxY = this.smoothMy * 14 * p.z

      const drawX = currentX + p.pushX + parallaxX
      const drawY = p.y + p.pushY + parallaxY
      const drawRadius = p.radius * (1 + (p.glow - 1) * 0.35)
      const finalAlpha = Math.min(1, p.baseAlpha * this.currentBrightness * edgeFade * p.glow)

      if (finalAlpha > 0.02) {
        ctx.globalAlpha = finalAlpha
        const sprite = p.isWarmWhite ? this.warmWhiteSprite : this.emberSprite
        if (sprite) {
          ctx.drawImage(
            sprite,
            drawX - drawRadius,
            drawY - drawRadius,
            drawRadius * 2,
            drawRadius * 2
          )
        }
      }
    }

    ctx.globalAlpha = 1.0
  }

  private onPointerMove = (e: PointerEvent) => {
    const dx = e.clientX - this.mouse.prevX
    const dy = e.clientY - this.mouse.prevY
    this.mouse.speed = Math.min(Math.hypot(dx, dy) * 0.12, 1)
    this.mouse.prevX = this.mouse.x
    this.mouse.prevY = this.mouse.y
    this.mouse.x = e.clientX
    this.mouse.y = e.clientY

    this.isMouseMoving = true
    if (this.mouseMoveTimeout) window.clearTimeout(this.mouseMoveTimeout)
    this.mouseMoveTimeout = window.setTimeout(() => {
      this.isMouseMoving = false
    }, 120)

    this.ensureRunning()
  }

  private onPointerLeave = () => {
    this.mouse.x = -1000
    this.mouse.y = -1000
    this.mouse.speed = 0
    this.isMouseMoving = false
  }

  private onClick = (e: MouseEvent) => {
    if (this.width < 1024) return
    this.ripples.push({
      x: e.clientX,
      y: e.clientY,
      radius: 0,
      maxRadius: Math.min(this.width, this.height) * 0.4,
      alpha: 0.75,
    })
    this.ensureRunning()
  }

  private onResize = () => {
    this.recomputeSize()
    if (this.isReduced || this.isMobile) {
      this.stop()
      this.drawSettledField()
    } else {
      this.drawSettledField()
      this.ensureRunning()
    }
  }

  private onVisibilityChange = () => {
    this.isPaused = document.hidden
    if (!this.isPaused) {
      this.lastFrameTime = performance.now()
      this.lastFrameDrawnTime = performance.now()
      this.ensureRunning()
    } else {
      this.stop()
    }
  }

  private onWindowFocus = () => {
    this.isPaused = document.hidden
    if (!this.isPaused) {
      this.lastFrameTime = performance.now()
      this.lastFrameDrawnTime = performance.now()
      this.ensureRunning()
    }
  }

  private onPageShow = () => {
    this.isPaused = document.hidden
    if (!this.isPaused) {
      this.lastFrameTime = performance.now()
      this.lastFrameDrawnTime = performance.now()
      this.ensureRunning()
    }
  }

  private attachEventListeners() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true })
    document.addEventListener('pointerleave', this.onPointerLeave)
    window.addEventListener('click', this.onClick, { passive: true })
    window.addEventListener('resize', this.onResize)
    window.addEventListener('orientationchange', this.onResize)
    document.addEventListener('visibilitychange', this.onVisibilityChange)
    window.addEventListener('focus', this.onWindowFocus)
    window.addEventListener('pageshow', this.onPageShow)
  }

  private removeEventListeners() {
    window.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerleave', this.onPointerLeave)
    window.removeEventListener('click', this.onClick)
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('orientationchange', this.onResize)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
    window.removeEventListener('focus', this.onWindowFocus)
    window.removeEventListener('pageshow', this.onPageShow)
  }
}

// Module-level singleton instance
const controller = new ParticleCanvasController()
if (typeof window !== 'undefined') {
  ;(window as any).__particleCanvasController = controller
}

// ============================================================================
// REACT WRAPPER (Mounts once at root, StrictMode-safe)
// ============================================================================

export default function MouseReactiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const { activeSection } = useNavigation()

  // Sync active section to controller
  useEffect(() => {
    controller.setSection(activeSection)
  }, [activeSection])

  // Mount/unmount controller cleanly (safe with StrictMode double-mount)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    controller.mount(canvas)

    return () => {
      controller.unmount()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 block"
      style={{ width: '100vw', height: '100vh' }}
    />
  )
}
