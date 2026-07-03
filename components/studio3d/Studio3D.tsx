// components/studio3d/Studio3D.tsx
"use client";

import {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  Component,
  ErrorInfo,
  ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Decal,
  useGLTF,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────
// Error Boundary
// ─────────────────────────────────────────────

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error: `${error.message}` });
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#0d2d45] p-6 text-white">
          <div className="max-w-sm rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="mb-2 text-sm font-semibold text-red-400">Erreur</p>
            <p className="text-xs text-red-300">{this.state.error}</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const MODEL_PATH = "/models/shirt_baked.glb";
const WHATSAPP = "213557440522";
const MAX_RECORD_SECONDS = 30;

const COLORS = [
  { name: "Blanc", hex: "#f2f0eb" },
  { name: "Noir", hex: "#1c1c1e" },
  { name: "Beige", hex: "#d6c6a8" },
  { name: "Marine", hex: "#1f2a44" },
  { name: "Bordeaux", hex: "#6e1423" },
  { name: "Vert forêt", hex: "#2d4a3a" },
  { name: "Gris chiné", hex: "#9a9a9a" },
  { name: "Caramel", hex: "#b0713a" },
];

type BgPreset = {
  name: string;
  kind: "color" | "gradient";
  value: string;
  stops?: [string, string];
};

const BG_PRESETS: BgPreset[] = [
  { name: "Caractère Blue", kind: "gradient", value: "blue", stops: ["#0a1f2e", "#1a5f8a"] },
  { name: "Studio sombre", kind: "color", value: "#0b0b0d" },
  { name: "Blanc pur", kind: "color", value: "#f5f5f2" },
  { name: "Crème", kind: "color", value: "#e9e2d4" },
  { name: "Dégradé or", kind: "gradient", value: "gold", stops: ["#2a1f0e", "#c9a84c"] },
  { name: "Dégradé nuit", kind: "gradient", value: "night", stops: ["#0b0b0d", "#1f2a44"] },
];

type AnimationMode = "aucune" | "rotation" | "flottement" | "marche" | "formation";

const ANIMATIONS: { id: AnimationMode; label: string; icon: string }[] = [
  { id: "aucune", label: "Aucune", icon: "⏹" },
  { id: "rotation", label: "Rotation", icon: "🔄" },
  { id: "flottement", label: "Flottement", icon: "🌊" },
  { id: "marche", label: "Marche", icon: "🚶" },
  { id: "formation", label: "Tissage", icon: "🧵" },
];

const CLIP_MIN = -0.42;
const CLIP_MAX = 0.46;
const FORMATION_DURATION = 4.5;
const FORMATION_HOLD = 2.0;

// ─────────────────────────────────────────────
// Logo Caractère SVG (extrait de la capture)
// ─────────────────────────────────────────────

function CaractereLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="18,2 34,10 26,26 10,18" fill="white" />
      <text x="10" y="22" fontSize="14" fontWeight="bold" fill="#1a5f8a" textAnchor="middle" dominantBaseline="middle" dy="2">C</text>
      <text x="65" y="20" fontSize="15" fontWeight="700" fill="white" textAnchor="middle" dominantBaseline="middle" letterSpacing="1">Caractère</text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Utilitaires texture
// ─────────────────────────────────────────────

function makeGradientTexture(stops: [string, string]): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 2;
  c.height = 1024;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, c.height, 0, 0);
  g.addColorStop(0, stops[0]);
  g.addColorStop(1, stops[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, c.width, c.height);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

type BgState =
  | { type: "color"; value: string }
  | { type: "texture"; texture: THREE.Texture };

// ─────────────────────────────────────────────
// Scene Background
// ─────────────────────────────────────────────

function SceneBackground({ bg }: { bg: BgState }) {
  const { scene } = useThree();
  useEffect(() => {
    if (bg.type === "color") {
      scene.background = new THREE.Color(bg.value);
    } else {
      scene.background = bg.texture;
    }
  }, [bg, scene]);
  return null;
}

// ─────────────────────────────────────────────
// T-shirt
// ─────────────────────────────────────────────

type ShirtProps = {
  color: string;
  logoTexture: THREE.Texture | null;
  logoScale: number;
  logoY: number;
  logoBack: boolean;
  clipPlane: THREE.Plane;
  clipActive: boolean;
};

function Shirt({ color, logoTexture, logoScale, logoY, logoBack, clipPlane, clipActive }: ShirtProps) {
  const gltf = useGLTF(MODEL_PATH) as any;
  const mat = gltf.materials?.lambert1 as THREE.MeshStandardMaterial;
  const targetColor = useRef(new THREE.Color(color));

  useEffect(() => {
    if (!mat) return;
    mat.clippingPlanes = clipActive ? [clipPlane] : null;
    mat.clipShadows = true;
    mat.needsUpdate = true;
  }, [clipActive, clipPlane, mat]);

  useFrame(() => {
    if (!mat) return;
    targetColor.current.set(color);
    mat.color.lerp(targetColor.current, 0.25);
  });

  if (!gltf.nodes?.T_Shirt_male?.geometry) return null;

  return (
    <Center>
      <mesh castShadow geometry={gltf.nodes.T_Shirt_male.geometry} material={mat} dispose={null}>
        {logoTexture && (
          <Decal
            position={[0, logoY, logoBack ? -0.15 : 0.15]}
            rotation={[0, logoBack ? Math.PI : 0, 0]}
            scale={logoScale}
          >
            <meshStandardMaterial
              map={logoTexture}
              transparent
              polygonOffset
              polygonOffsetFactor={-10}
              clippingPlanes={clipActive ? [clipPlane] : null}
            />
          </Decal>
        )}
      </mesh>
    </Center>
  );
}

useGLTF.preload(MODEL_PATH);

// ─────────────────────────────────────────────
// Scene
// ─────────────────────────────────────────────

type SceneProps = ShirtProps & { bg: BgState; animation: AnimationMode };

function Scene({ bg, animation, color, logoTexture, logoScale, logoY, logoBack }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const threadLine = useRef<THREE.Mesh>(null);
  const clipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, -1, 0), CLIP_MAX + 0.1),
    []
  );
  const formation = animation === "formation";

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const g = group.current;
    if (!g) return;

    if (animation !== "rotation" && animation !== "formation") g.rotation.y *= 0.95;
    if (animation !== "flottement" && animation !== "marche") {
      g.position.y *= 0.9;
      g.rotation.z *= 0.9;
      g.rotation.x *= 0.9;
    }

    if (animation === "rotation") g.rotation.y += 0.012;

    if (animation === "flottement") {
      g.position.y = Math.sin(t * 1.4) * 0.035;
      g.rotation.z = Math.sin(t * 0.9) * 0.04;
      g.rotation.y = Math.sin(t * 0.6) * 0.25;
    }

    if (animation === "marche") {
      const step = t * 3.4;
      g.position.y = Math.abs(Math.sin(step)) * 0.032;
      g.rotation.z = Math.sin(step) * 0.05;
      g.rotation.x = 0.03 + Math.sin(step * 2) * 0.012;
      g.rotation.y = Math.sin(t * 0.8) * 0.18;
    }

    if (formation) {
      const cycle = FORMATION_DURATION + FORMATION_HOLD;
      const local = t % cycle;
      const progress = Math.min(local / FORMATION_DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 2.2);
      const y = CLIP_MIN + eased * (CLIP_MAX - CLIP_MIN);
      clipPlane.constant = y;
      g.rotation.y += 0.006;
      if (threadLine.current) {
        threadLine.current.visible = progress < 1;
        threadLine.current.position.y = y;
        (threadLine.current.material as THREE.MeshBasicMaterial).opacity = progress < 1 ? 0.9 : 0;
      }
    } else {
      clipPlane.constant = CLIP_MAX + 0.1;
      if (threadLine.current) threadLine.current.visible = false;
    }
  });

  return (
    <>
      <SceneBackground bg={bg} />
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <group ref={group}>
        <Shirt
          color={color}
          logoTexture={logoTexture}
          logoScale={logoScale}
          logoY={logoY}
          logoBack={logoBack}
          clipPlane={clipPlane}
          clipActive={formation}
        />
        <mesh ref={threadLine} visible={false}>
          <boxGeometry args={[0.95, 0.006, 0.5]} />
          <meshBasicMaterial color="#c9a84c" transparent opacity={0.9} toneMapped={false} />
        </mesh>
      </group>
      <ContactShadows position={[0, -0.52, 0]} opacity={0.4} scale={2.5} blur={2.2} far={1.2} />
      <OrbitControls enablePan={false} minDistance={1.2} maxDistance={4} minPolarAngle={Math.PI / 4} maxPolarAngle={(3 * Math.PI) / 4} />
    </>
  );
}

// ─────────────────────────────────────────────
// Studio
// ─────────────────────────────────────────────

export default function Studio3D() {
  const [color, setColor] = useState(COLORS[1].hex);
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(0.14);
  const [logoY, setLogoY] = useState(0.04);
  const [logoBack, setLogoBack] = useState(false);
  const [bg, setBg] = useState<BgState>({ type: "texture", texture: typeof window !== "undefined" ? makeGradientTexture(["#0a1f2e", "#1a5f8a"]) : (null as any) });
  const [bgSelected, setBgSelected] = useState("Caractère Blue");
  const [animation, setAnimation] = useState<AnimationMode>("rotation");
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      new THREE.TextureLoader().load(reader.result as string, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 16;
        setLogoTexture(tex);
        setLogoName(file.name);
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const selectBgPreset = useCallback((p: BgPreset) => {
    setBgSelected(p.name);
    if (p.kind === "color") {
      setBg({ type: "color", value: p.value });
    } else if (p.stops) {
      setBg({ type: "texture", texture: makeGradientTexture(p.stops) });
    }
  }, []);

  const handleBgUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      new THREE.TextureLoader().load(reader.result as string, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setBg({ type: "texture", texture: tex });
        setBgSelected("Image perso");
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const downloadPNG = useCallback(() => {
    const gl = glRef.current;
    if (!gl) return;
    const url = gl.domElement.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "caractere-mockup-3d.png";
    a.click();
  }, []);

  const stopRecording = useCallback(() => recorderRef.current?.stop(), []);

  const startRecording = useCallback(() => {
    const gl = glRef.current;
    if (!gl || recording) return;
    const stream = gl.domElement.captureStream(30);
    const candidates = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"];
    const mimeType = candidates.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m));
    if (!mimeType) { alert("Enregistrement non supporté sur ce navigateur."); return; }
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
    recorder.onstop = () => {
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `caractere-3d.${ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setRecording(false);
      setRecordSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
    setRecordSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordSeconds((s) => {
        if (s + 1 >= MAX_RECORD_SECONDS) { recorder.stop(); return s + 1; }
        return s + 1;
      });
    }, 1000);
  }, [recording]);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const colorName = COLORS.find((c) => c.hex === color)?.name ?? color;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Bonjour Caractère Store 👋\nJe viens du Studio 3D. Je veux commander un t-shirt ${colorName} avec mon logo${logoName ? ` (${logoName})` : ""}.`
  )}`;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0a1f2e] text-white">

        {/* Header Caractère */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#0a1f2e]/95 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-3">
            {/* Logo C */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
              <span className="text-lg font-black text-[#1a5f8a]">C</span>
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide">Caractère</p>
              <p className="text-[10px] text-white/50">Studio 3D</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#c9a84c]/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#c9a84c]">
              Bêta
            </span>
            <a href="/" className="text-xs text-white/40 hover:text-white">← Retour</a>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
          {/* Canvas 3D */}
          <div className="relative h-[55vh] min-h-[360px] flex-1 lg:h-[calc(100vh-57px)]">
            {/* Grille décorative (style site) */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            <Canvas
              shadows
              camera={{ position: [0, 0, 2.2], fov: 25 }}
              gl={{ preserveDrawingBuffer: true }}
              onCreated={({ gl }) => {
                gl.localClippingEnabled = true;
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                glRef.current = gl;
              }}
            >
              <Suspense fallback={null}>
                <Scene
                  color={color}
                  logoTexture={logoTexture}
                  logoScale={logoScale}
                  logoY={logoY}
                  logoBack={logoBack}
                  bg={bg}
                  animation={animation}
                  clipPlane={null as any}
                  clipActive={false}
                />
              </Suspense>
            </Canvas>

            {/* Badge REC */}
            {recording && (
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-xs font-semibold tabular-nums">{recordSeconds}s</span>
              </div>
            )}

            {/* CTA upload si pas de logo */}
            {!logoTexture && (
              <button
                onClick={() => logoInputRef.current?.click()}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium backdrop-blur transition hover:bg-white/20"
              >
                + Ajouter votre logo
              </button>
            )}
          </div>

          {/* Panneau */}
          <aside className="w-full border-t border-white/10 bg-[#071828] p-5 lg:w-[320px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:[height:calc(100vh-57px)]">

            {/* Couleur */}
            <section>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Couleur du vêtement
              </p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    title={c.name}
                    onClick={() => setColor(c.hex)}
                    className={`h-8 w-8 rounded-full border-2 transition ${
                      color === c.hex ? "border-[#c9a84c] scale-110" : "border-white/20 hover:border-white/50"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-white/50">{colorName}</p>
            </section>

            {/* Background */}
            <section className="mt-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Arrière-plan
              </p>
              <div className="flex flex-wrap gap-2">
                {BG_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    title={p.name}
                    onClick={() => selectBgPreset(p)}
                    className={`h-8 w-8 rounded-lg border-2 transition ${
                      bgSelected === p.name ? "border-[#c9a84c] scale-110" : "border-white/20 hover:border-white/50"
                    }`}
                    style={{
                      background: p.kind === "color" ? p.value : `linear-gradient(to top, ${p.stops![0]}, ${p.stops![1]})`,
                    }}
                  />
                ))}
                <input ref={bgInputRef} type="file" accept="image/*" onChange={handleBgUpload} className="hidden" />
                <button
                  onClick={() => bgInputRef.current?.click()}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 text-sm transition ${
                    bgSelected === "Image perso" ? "border-[#c9a84c] text-[#c9a84c]" : "border-dashed border-white/30 text-white/40 hover:border-white/60"
                  }`}
                >
                  +
                </button>
              </div>
              <p className="mt-2 text-xs text-white/50">{bgSelected}</p>
            </section>

            {/* Logo */}
            <section className="mt-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Votre design
              </p>
              <input ref={logoInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoUpload} className="hidden" />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-white/20 bg-white/5 py-3 text-sm text-white/60 transition hover:border-[#c9a84c]/50 hover:text-white"
              >
                {logoName ? `✓ ${logoName}` : "Importer un logo (PNG)"}
              </button>

              {logoTexture && (
                <div className="mt-4 space-y-3">
                  <label className="block">
                    <span className="text-xs text-white/40">Taille</span>
                    <input type="range" min={0.05} max={0.35} step={0.005} value={logoScale}
                      onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                      className="mt-1 w-full accent-[#c9a84c]" />
                  </label>
                  <label className="block">
                    <span className="text-xs text-white/40">Position verticale</span>
                    <input type="range" min={-0.15} max={0.22} step={0.005} value={logoY}
                      onChange={(e) => setLogoY(parseFloat(e.target.value))}
                      className="mt-1 w-full accent-[#c9a84c]" />
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">Logo dans le dos</span>
                    <button
                      onClick={() => setLogoBack((v) => !v)}
                      className={`relative h-6 w-11 rounded-full transition-colors ${logoBack ? "bg-[#c9a84c]" : "bg-white/20"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${logoBack ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Animation */}
            <section className="mt-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Animation
              </p>
              <div className="grid grid-cols-2 gap-2">
                {ANIMATIONS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setAnimation(a.id)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                      animation === a.id
                        ? "border-[#c9a84c] bg-[#c9a84c]/15 text-[#c9a84c]"
                        : "border-white/10 bg-white/5 text-white/60 hover:border-white/30"
                    }`}
                  >
                    <span>{a.icon}</span>
                    <span>{a.label}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Vidéo */}
            <section className="mt-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                Exporter
              </p>
              <div className="space-y-2">
                <button
                  onClick={downloadPNG}
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-medium text-white/70 transition hover:bg-white/10"
                >
                  📷 Télécharger PNG
                </button>
                {!recording ? (
                  <button
                    onClick={startRecording}
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-medium text-white/70 transition hover:border-red-400/50 hover:text-red-400"
                  >
                    ● Enregistrer vidéo (max {MAX_RECORD_SECONDS}s)
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-full rounded-xl border border-red-500/40 bg-red-500/10 py-2.5 text-xs font-semibold text-red-400"
                  >
                    ■ Arrêter — {recordSeconds}s / {MAX_RECORD_SECONDS}s
                  </button>
                )}
              </div>
            </section>

            {/* CTA Commander */}
            <section className="mt-6 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-white py-3.5 text-center text-sm font-bold text-[#0a1f2e] transition hover:bg-white/90"
              >
                Commander ce design →
              </a>
              <p className="text-center text-[10px] text-white/25">
                DTF & broderie · Caractère Store · Alger
              </p>
            </section>

          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
