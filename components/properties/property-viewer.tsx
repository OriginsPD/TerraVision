"use client"

import { useState, Suspense, useRef, useEffect, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stage, useGLTF, Environment, ContactShadows, PointerLockControls, Float, PerspectiveCamera } from "@react-three/drei"
import { XR, createXRStore, XROrigin, TeleportTarget } from "@react-three/xr"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Box, Image as ImageIcon, Maximize2, Move3D, Play, Loader2, ZoomIn, MousePointer2, Smartphone, Minimize2, Sparkles, Cpu, Zap, CheckCircle2, AlertCircle, Glasses } from "lucide-react"
import type { Property } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import nipplejs from "nipplejs"
import { useGenerateModel } from "@/hooks/api/use-properties"
import { toast } from "sonner"

// Initialize XR Store with teleportation
const xrStore = createXRStore({
  controller: { teleportPointer: true },
  hand: { teleportPointer: true },
})

interface PropertyViewerProps {
  property: Property
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      if (mesh.material) {
        ;(mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.5
      }
    }
  })
  return <primitive object={scene} />
}

function Player({ joystickData, active }: { joystickData: { x: number, y: number } | null, active: boolean }) {
  const [moveForward, setMoveForward] = useState(false)
  const [moveBackward, setMoveBackward] = useState(false)
  const [moveLeft, setMoveLeft] = useState(false)
  const [moveRight, setMoveRight] = useState(false)

  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())

  useEffect(() => {
    if (!active) return

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW": setMoveForward(true); break
        case "KeyS": setMoveBackward(true); break
        case "KeyA": setMoveLeft(true); break
        case "KeyD": setMoveRight(true); break
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW": setMoveForward(false); break
        case "KeyS": setMoveBackward(false); break
        case "KeyA": setMoveLeft(false); break
        case "KeyD": setMoveRight(false); break
      }
    }
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [active])

  useFrame((state, delta) => {
    if (!active) return
    const speed = 5
    let forward = Number(moveForward) - Number(moveBackward)
    let side = Number(moveRight) - Number(moveLeft)
    if (joystickData) {
      forward += joystickData.y
      side += joystickData.x
    }
    direction.current.z = forward
    direction.current.x = side
    if (direction.current.length() > 0.1) {
      direction.current.normalize()
      velocity.current.z = direction.current.z * speed * delta
      velocity.current.x = direction.current.x * speed * delta
      state.camera.translateX(velocity.current.x)
      state.camera.translateZ(velocity.current.z)
    }
    state.camera.position.y = 1.7
  })
  return null
}

function AIGenerationOverlay({ property }: { property: Property }) {
  const { mutate: generate, isPending } = useGenerateModel()
  const status = property.generationStatus || "none"

  const handleGenerate = () => {
    generate(property.id, {
      onSuccess: () => toast.success("AI Generation started! This usually takes 30-60 seconds."),
      onError: (err: any) => toast.error(err.message || "Failed to start AI generation")
    })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute h-96 w-96 rounded-full bg-primary/20 blur-[100px]"
      />
      <div className="relative z-10 max-w-md w-full glass p-10 rounded-[3rem] border border-white/20 shadow-2xl text-center">
        {status === "none" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/30 shadow-lg">
              <Cpu className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 font-serif">Generate 3D Model</h3>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              Our advanced AI can transform your property images into a high-fidelity 3D immersive experience.
            </p>
            <Button onClick={handleGenerate} disabled={isPending} variant="glossy" className="w-full py-8 text-lg font-bold rounded-2xl gap-3 shadow-xl shadow-primary/30">
              {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Zap className="h-6 w-6 fill-white" />}
              Start AI Generation
            </Button>
          </motion.div>
        )}
        {status === "pending" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative mx-auto h-24 w-24 mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-4 rounded-full border-4 border-accent/20 border-b-accent animate-spin-reverse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="h-8 w-8 text-primary animate-pulse" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2 font-serif">Processing Model</h3>
            <p className="text-primary font-bold text-sm uppercase tracking-[0.2em] mb-6 animate-pulse">AI is building your world</p>
            <div className="space-y-4 text-left bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /><span className="text-xs font-bold text-white/80">Analyzing terrain data</span></div>
              <div className="flex items-center gap-3"><div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" /><span className="text-xs font-bold text-primary">Generating mesh geometry</span></div>
              <div className="flex items-center gap-3 opacity-40"><div className="h-4 w-4 rounded-full border-2 border-white/20" /><span className="text-xs font-bold text-white/60">Applying realistic textures</span></div>
            </div>
            <p className="mt-8 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Estimated time remaining: 45 seconds</p>
          </motion.div>
        )}
        {status === "failed" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mx-auto h-20 w-20 rounded-3xl bg-destructive/20 flex items-center justify-center mb-6 border border-destructive/30 shadow-lg">
              <AlertCircle className="h-10 w-10 text-destructive" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 font-serif">Generation Failed</h3>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">We encountered an issue while generating the 3D model. Ensure your images are clear.</p>
            <Button onClick={handleGenerate} variant="outline" className="w-full py-8 text-lg font-bold rounded-2xl gap-3 border-destructive/30 hover:bg-destructive/10">
              <Zap className="h-6 w-6" /> Retry Generation
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function PropertyViewer({ property }: PropertyViewerProps) {
  const [activeTab, setActiveTab] = useState<"3d" | "photos">(property.has3D ? "3d" : "photos")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isWalkthrough, setIsWalkthrough] = useState(false)
  const [joystickData, setJoystickData] = useState<{ x: number, y: number } | null>(null)
  const [showControlsHint, setShowControlsHint] = useState(true)
  const [xrPlayerPos, setXRPlayerPos] = useState(new THREE.Vector3(0, 0, 0))
  const joystickRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isWalkthrough && joystickRef.current) {
      const manager = nipplejs.create({
        zone: joystickRef.current,
        mode: 'static',
        position: { left: '80px', bottom: '80px' },
        color: 'white',
        size: 100
      })
      manager.on('move', (evt, data) => {
        const x = data.vector.x
        const y = -data.vector.y
        setJoystickData({ x, y })
      })
      manager.on('end', () => setJoystickData(null))
      return () => manager.destroy()
    }
  }, [isWalkthrough])

  const modelUrl = property.model3DUrl?.startsWith('http') || property.model3DUrl?.startsWith('/')
    ? property.model3DUrl 
    : `http://localhost:8000${property.model3DUrl}`;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className={cn(
      "relative transition-all duration-500",
      isFullscreen ? "fixed inset-0 z-[100] bg-background" : "mx-auto max-w-7xl px-4 lg:px-8 mt-8"
    )}>
      {/* Viewer Container */}
      <div className={cn(
        "relative overflow-hidden border-4 border-white/20 bg-card shadow-2xl transition-all duration-500",
        isFullscreen ? "h-screen w-screen rounded-none border-none" : "aspect-[16/9] rounded-[3rem] lg:aspect-[21/9]"
      )}>
        {/* Top Controls Overlay */}
        <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="glass px-1 py-1 rounded-2xl flex items-center gap-1">
              <Button variant={activeTab === "3d" ? "glossy" : "ghost"} size="sm" onClick={() => setActiveTab("3d")} className="rounded-xl px-4">
                <Box className="h-4 w-4 mr-2" /> 3D Experience
              </Button>
              <Button variant={activeTab === "photos" ? "glossy" : "ghost"} size="sm" onClick={() => setActiveTab("photos")} className="rounded-xl px-4">
                <ImageIcon className="h-4 w-4 mr-2" /> Gallery
              </Button>
            </div>
            {property.has3D && activeTab === "3d" && (
              <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-md px-4 py-2 rounded-xl flex gap-2">
                <Sparkles className="h-4 w-4" /><span className="font-bold uppercase tracking-widest text-[10px]">AI Immersive Model</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 pointer-events-auto">
            <button onClick={toggleFullscreen} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-white backdrop-blur-md hover:bg-white/20 transition-all shadow-xl">
              {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {activeTab === "3d" ? (
          property.has3D ? (
            <div className="h-full w-full relative group/canvas">
              <Suspense fallback={
                <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-gradient-to-br from-background via-card to-background">
                  <div className="relative"><div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" /><Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" /></div>
                  <div className="text-center"><p className="text-xl font-bold text-foreground">Loading Immersive Scene</p><p className="text-sm text-muted-foreground">Preparing high-fidelity 3D assets...</p></div>
                </div>
              }>
                <Canvas shadows gl={{ antialias: true, logarithmicDepthBuffer: true }}>
                  <XR store={xrStore}>
                    <PerspectiveCamera makeDefault position={isWalkthrough ? [0, 1.7, 0] : [10, 8, 10]} fov={isWalkthrough ? 75 : 45} />
                    <color attach="background" args={["#0a0a0b"]} />
                    <Environment preset="night" />
                    <ambientLight intensity={0.2} />
                    <spotLight position={[20, 20, 20]} angle={0.15} penumbra={1} intensity={2} castShadow />
                    <XROrigin position={xrPlayerPos} />
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} enabled={!isWalkthrough}>
                      <TeleportTarget onTeleport={setXRPlayerPos}>
                        <Model url={modelUrl!} />
                      </TeleportTarget>
                    </Float>
                    {isWalkthrough ? (
                      <>
                        <PointerLockControls />
                        <Player joystickData={joystickData} active={isWalkthrough} />
                      </>
                    ) : (
                      <>
                        <OrbitControls makeDefault enableDamping dampingFactor={0.05} minDistance={5} maxDistance={30} />
                        <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={40} blur={2.5} far={10} color="#000000" />
                      </>
                    )}
                  </XR>
                </Canvas>
              </Suspense>

              <AnimatePresence>
                {isWalkthrough && showControlsHint && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                    <div className="glass p-10 rounded-[3rem] text-center border-4 border-primary/30 max-w-lg pointer-events-auto">
                      <div className="flex justify-center mb-6"><div className="h-20 w-20 rounded-3xl bg-primary/20 flex items-center justify-center"><Move3D className="h-10 w-10 text-primary" /></div></div>
                      <h3 className="text-3xl font-bold mb-4">Walk-through Mode</h3>
                      <div className="grid grid-cols-2 gap-8 mb-8 text-left">
                        <div className="flex items-center gap-4"><div className="flex flex-col gap-1"><div className="flex gap-1"><kbd className="px-2 py-1 rounded bg-white/20 border border-white/30 text-xs">W</kbd><kbd className="px-2 py-1 rounded bg-white/20 border border-white/30 text-xs">A</kbd><kbd className="px-2 py-1 rounded bg-white/20 border border-white/30 text-xs">S</kbd><kbd className="px-2 py-1 rounded bg-white/20 border border-white/30 text-xs">D</kbd></div><span className="text-xs font-bold text-muted-foreground uppercase">Movement</span></div></div>
                        <div className="flex items-center gap-4"><MousePointer2 className="h-6 w-6 text-primary" /><div className="flex flex-col"><span className="font-bold">Click to Look</span><span className="text-xs text-muted-foreground">Capture mouse for 360 view</span></div></div>
                        <div className="flex items-center gap-4"><Smartphone className="h-6 w-6 text-accent" /><div className="flex flex-col"><span className="font-bold">Virtual Joystick</span><span className="text-xs text-muted-foreground">Available on touch devices</span></div></div>
                        <div className="flex items-center gap-4"><div className="px-2 py-1 rounded bg-white/20 border border-white/30 text-xs font-bold">ESC</div><div className="flex flex-col"><span className="font-bold">Exit Mode</span><span className="text-xs text-muted-foreground">Release mouse or exit</span></div></div>
                      </div>
                      <Button variant="glossy" className="w-full py-7 text-lg rounded-2xl" onClick={() => setShowControlsHint(false)}>I'm Ready to Explore</Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {isWalkthrough && (<div ref={joystickRef} className="absolute bottom-10 left-10 h-48 w-48 touch-none z-30" />)}

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-wrap justify-center items-center gap-4 p-2 glass rounded-[2.5rem] border border-white/20 shadow-2xl transition-all hover:scale-105">
                {isWalkthrough ? (
                  <div className="flex items-center gap-2 pl-4">
                    <span className="text-sm font-bold text-white/80 pr-4 border-r border-white/10">Active Walkthrough</span>
                    <Button variant="destructive" size="sm" className="rounded-full px-6 py-5 font-bold" onClick={() => setIsWalkthrough(false)}>Exit Navigation</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-6 px-4">
                      <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><Move3D className="h-4 w-4 text-primary" /></div><span className="text-xs font-bold text-white/70 uppercase">Orbit</span></div>
                      <div className="flex items-center gap-2"><div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"><ZoomIn className="h-4 w-4 text-accent" /></div><span className="text-xs font-bold text-white/70 uppercase">Zoom</span></div>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <Button variant="glossy" className="rounded-full px-8 py-6 font-bold flex gap-3 shadow-xl shadow-primary/30" onClick={() => setIsWalkthrough(true)}>
                      <Play className="h-5 w-5 fill-white" /> Enter Immersive Walk-through
                    </Button>
                    <Button variant="outline" className="rounded-full px-8 py-6 font-bold flex gap-3 border-accent/30 bg-accent/10 hover:bg-accent/20 shadow-xl" onClick={() => xrStore.enterVR()}>
                      <Glasses className="h-5 w-5" /> VR Mode
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <AIGenerationOverlay property={property} />
          )
        ) : (
          <div className="h-full w-full bg-muted relative group">
             <div className="grid h-full grid-cols-4 grid-rows-2 gap-3 p-4">
                <div className="col-span-3 row-span-2 overflow-hidden rounded-[2rem] relative group/main">
                  <img src={property.images[0]?.startsWith('http') || property.images[0]?.startsWith('/') ? property.images[0] : `http://localhost:8000${property.images[0]}`} className="h-full w-full object-cover transition-transform duration-700 group-hover/main:scale-105" alt={property.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
                {property.images.slice(1, 3).map((img, i) => (
                  <div key={i} className="overflow-hidden rounded-[1.5rem] relative group/sub">
                    <img src={img.startsWith('http') || img.startsWith('/') ? img : `http://localhost:8000${img}`} className="h-full w-full object-cover transition-transform duration-700 group-hover/sub:scale-110" alt={`${property.title} ${i + 2}`} />
                  </div>
                ))}
                {property.images.length > 3 ? (
                  <div className="relative overflow-hidden rounded-[1.5rem] bg-card/50 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center group/more cursor-pointer">
                    <img src={property.images[3].startsWith('http') || property.images[3].startsWith('/') ? property.images[3] : `http://localhost:8000${property.images[3]}`} className="absolute inset-0 h-full w-full object-cover opacity-20 blur-sm group-hover/more:scale-110 transition-transform duration-700" alt="More photos" />
                    <span className="relative z-10 text-2xl font-bold text-white">+{property.images.length - 3}</span>
                    <span className="relative z-10 text-xs font-bold text-white/60 uppercase tracking-widest mt-1">More Photos</span>
                  </div>
                ) : (
                   <div className="rounded-[1.5rem] bg-white/5 border border-white/10 border-dashed flex items-center justify-center"><ImageIcon className="h-8 w-8 text-white/20" /></div>
                )}
              </div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-4xl mt-6 px-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
          <button onClick={() => setActiveTab("3d")} className={cn("flex h-20 w-28 shrink-0 flex-col items-center justify-center rounded-2xl border transition-all duration-300 relative overflow-hidden group", activeTab === "3d" ? "border-primary bg-primary/20 ring-4 ring-primary/20 shadow-lg" : "border-white/10 bg-white/5 hover:bg-white/10")}>
            <Box className={cn("h-7 w-7 mb-1 transition-colors", activeTab === "3d" ? "text-primary" : "text-white/40 group-hover:text-white")} />
            <span className={cn("text-[10px] font-bold uppercase tracking-widest", activeTab === "3d" ? "text-primary" : "text-white/30")}>3D Experience</span>
            {activeTab === "3d" && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
          </button>
          {property.images.map((img, i) => (
            <button key={i} onClick={() => setActiveTab("photos")} className={cn("group relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border transition-all duration-300", activeTab === "photos" ? "border-primary ring-4 ring-primary/20 shadow-lg" : "border-white/10 hover:border-white/30")}>
              <img src={img.startsWith('http') || img.startsWith('/') ? img : `http://localhost:8000${img}`} className={cn("h-full w-full object-cover transition-opacity duration-300", activeTab === "photos" ? "opacity-100" : "opacity-40 group-hover:opacity-100")} alt={`Thumbnail ${i + 1}`} />
              {activeTab === "photos" && i === 0 && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
