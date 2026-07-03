// components/studio3d/Studio3D.tsx
"use client";

import {
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
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
  { name: "Studio sombre", kind: "color", value: "#0b0b0d" },
  { name: "Blanc pur", kind: "color", value: "#f5f5f2" },
  { name: "Crème", kind: "color", value: "#e9e2d4" },
  { name: "Gris studio", kind: "color", value: "#3a3a40" },
  {
    name: "Dégradé or",
    kind: "gradient",
    value: "gold",
    stops: ["#2a1f0e", "#d4a94e"],
  },
  {
    name: "Dégradé nuit",
    kind: "gradient",
    value: "night",
    stops: ["#0b0b0d", "#1f2a44"],
  },
];

type AnimationMode = "aucune" | "rotation" | "flottement" | "formation";

const ANIMATIONS: { id: AnimationMode; label: string }[] = [
  { id: "aucune", label: "Aucune" },
  { id: "rotation", label: "Rotation 360°" },
  { id: "flottement", label: "Flottement" },
  { id: "formation", label: "Formation fil par fil" },
];

// Limites verticales du t-shirt (une fois centré) pour l'effet formation
const SHIRT_MIN_Y = -0.42;
const SHIRT_MAX_Y = 0.46;
const FORMATION_DURATION = 4.5; // secondes pour se tisser
const FORMATION_HOLD = 2.0; // secondes t-shirt complet avant de reboucler

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

// ─────────────────────────────────────────────
// 3D — Arrière-plan de la scène
// ─────────────────────────────────────────────

type BgState =
  | { type: "color"; value: string }
  | { type: "texture"; texture: THREE.Texture };

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
// 3D — T-shirt avec logo (Decal) + clipping
// ─────────────────────────────────────────────

type ShirtProps = {
  color: string;
  logoTexture: THREE.Texture | null;
  logoScale: number;
  logoY: number;
  clipPlane: THREE.Plane;
  clipActive: boolean;
};

function Shirt({
  color,
  logoTexture,
  logoScale,
  logoY,
  clipPlane,
  clipActive,
}: ShirtProps) {
  const { nodes, materials } = useGLTF(MODEL_PATH) as any;
  const targetColor = useRef(new THREE.Color(color));

  useEffect(() => {
    materials.lambert1.clippingPlanes = clipActive ? [clipPlane] : null;
    materials.lambert1.clipShadows = true;
    materials.lambert1.needsUpdate = true;
  }, [clipActive, clipPlane, materials]);

  useFrame(() => {
    targetColor.current.set(color);
    materials.lambert1.color.lerp(targetColor.current, 0.25);
  });

  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={1}
      dispose={null}
    >
      {logoTexture && (
        <Decal
          position={[0, logoY, 0.15]}
          rotation={[0, 0, 0]}
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
  );
}

useGLTF.preload(MODEL_PATH);

// ─────────────────────────────────────────────
// 3D — Scène animée
// ─────────────────────────────────────────────

type SceneProps = {
  color: string;
  logoTexture: THREE.Texture | null;
  logoScale: number;
  logoY: number;
  bg: BgState;
  animation: AnimationMode;
};

function Scene({ color, logoTexture, logoScale, logoY, bg, animation }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const threadLine = useRef<THREE.Mesh>(null);
  const clipPlane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, -1, 0), SHIRT_MAX_Y + 0.1),
    []
  );
  const formation = animation === "formation";

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const g = group.current;
    if (!g) return;

    // Reset doux
    if (animation !== "rotation") g.rotation.y *= 0.95;
    if (animation !== "flottement") {
      g.position.y *= 0.9;
      g.rotation.z *= 0.9;
    }

    if (animation === "rotation") {
      g.rotation.y += 0.012;
    }

    if (animation === "flottement") {
      g.position.y = Math.sin(t * 1.4) * 0.035;
      g.rotation.z = Math.sin(t * 0.9) * 0.04;
      g.rotation.y = Math.sin(t * 0.6) * 0.25;
    }

    if (formation) {
      const cycle = FORMATION_DURATION + FORMATION_HOLD;
      const local = t % cycle;
      const progress = Math.min(local / FORMATION_DURATION, 1);
      // easing douce
      const eased = 1 - Math.pow(1 - progress, 2.2);
      const y = SHIRT_MIN_Y + eased * (SHIRT_MAX_Y - SHIRT_MIN_Y);
      clipPlane.constant = y;
      // rotation lente pendant le tissage
      g.rotation.y += 0.006;
      // ligne dorée de "tissage"
      if (threadLine.current) {
        threadLine.current.visible = progress < 1;
        threadLine.current.position.y = y;
        const mat = threadLine.current.material as THREE.MeshBasicMaterial;
        mat.opacity = progress < 1 ? 0.9 : 0;
      }
    } else {
      clipPlane.constant = SHIRT_MAX_Y + 0.1;
      if (threadLine.current) threadLine.current.visible = false;
    }
  });

  return (
    <>
      <SceneBackground bg={bg} />
      <ambientLight intensity={0.4} />
      <Environment preset="city" />
      <group ref={group}>
        <Center>
          <Shirt
            color={color}
            logoTexture={logoTexture}
            logoScale={logoScale}
            logoY={logoY}
            clipPlane={clipPlane}
            clipActive={formation}
          />
        </Center>
        {/* Ligne dorée de tissage (formation fil par fil) */}
        <mesh ref={threadLine} visible={false}>
          <boxGeometry args={[0.95, 0.006, 0.4]} />
          <meshBasicMaterial
            color="#d4a94e"
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>
      </group>
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.55}
        scale={2.5}
        blur={2.2}
        far={1.2}
      />
      <OrbitControls
        enablePan={false}
        minDistance={1.2}
        maxDistance={4}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
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
  const [bg, setBg] = useState<BgState>({ type: "color", value: "#0b0b0d" });
  const [bgSelected, setBgSelected] = useState("Studio sombre");
  const [animation, setAnimation] = useState<AnimationMode>("rotation");
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Upload logo
  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  // ── Background
  const selectBgPreset = useCallback((p: BgPreset) => {
    setBgSelected(p.name);
    if (p.kind === "color") {
      setBg({ type: "color", value: p.value });
    } else if (p.stops) {
      setBg({ type: "texture", texture: makeGradientTexture(p.stops) });
    }
  }, []);

  const handleBgUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        new THREE.TextureLoader().load(reader.result as string, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          setBg({ type: "texture", texture: tex });
          setBgSelected("Image personnalisée");
        });
      };
      reader.readAsDataURL(file);
    },
    []
  );

  // ── Export PNG
  const downloadPNG = useCallback(() => {
    const gl = glRef.current;
    if (!gl) return;
    const url = gl.domElement.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "caractere-mockup-3d.png";
    a.click();
  }, []);

  // ── Enregistrement vidéo
  const stopRecording = useCallback(() => {
    recorderRef.current?.stop();
  }, []);

  const startRecording = useCallback(() => {
    const gl = glRef.current;
    if (!gl || recording) return;

    const stream = gl.domElement.captureStream(30);
    const candidates = [
      "video/mp4;codecs=avc1",
      "video/mp4",
      "video/webm;codecs=vp9",
      "video/webm",
    ];
    const mimeType = candidates.find((m) =>
      typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)
    );
    if (!mimeType) {
      alert("L'enregistrement vidéo n'est pas supporté par ce navigateur.");
      return;
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8_000_000,
    });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const ext = mimeType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `caractere-animation-3d.${ext}`;
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
        if (s + 1 >= MAX_RECORD_SECONDS) {
          recorder.stop();
          return s + 1;
        }
        return s + 1;
      });
    }, 1000);
  }, [recording]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const colorName = COLORS.find((c) => c.hex === color)?.name ?? color;
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Bonjour Caractère Store 👋\nJe viens du Studio 3D. Je veux commander un t-shirt ${colorName} avec mon logo${
      logoName ? ` (${logoName})` : ""
    }.`
  )}`;

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-[#f2f2f2]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#1e1e22] px-5 py-4">
        <div>
          <h1 className="text-base font-semibold tracking-tight">
            Studio 3D
            <span className="ml-2 rounded-full border border-[#d4a94e]/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-[#d4a94e]">
              Bêta
            </span>
          </h1>
          <p className="mt-0.5 text-xs text-[#8b8b93]">
            Votre logo en 3D — animez, filmez, commandez.
          </p>
        </div>
        <a href="/" className="text-xs text-[#8b8b93] hover:text-white">
          ← Boutique
        </a>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
        {/* Viewport 3D */}
        <div className="relative h-[55vh] min-h-[380px] flex-1 lg:h-[calc(100vh-73px)]">
          <Canvas
            shadows
            camera={{ position: [0, 0, 2.2], fov: 25 }}
            gl={{ preserveDrawingBuffer: true }}
            onCreated={({ gl }) => {
              gl.localClippingEnabled = true;
              glRef.current = gl;
            }}
          >
            <Suspense fallback={null}>
              <Scene
                color={color}
                logoTexture={logoTexture}
                logoScale={logoScale}
                logoY={logoY}
                bg={bg}
                animation={animation}
              />
            </Suspense>
          </Canvas>

          {/* Badge enregistrement */}
          {recording && (
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-medium tabular-nums">
                {recordSeconds}s / {MAX_RECORD_SECONDS}s
              </span>
            </div>
          )}

          {!logoTexture && (
            <button
              onClick={() => logoInputRef.current?.click()}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[#26262b] bg-[#141417]/90 px-4 py-2 text-xs text-[#c9c9cf] backdrop-blur transition hover:border-[#d4a94e]/50 hover:text-white"
            >
              + Ajouter votre logo
            </button>
          )}
        </div>

        {/* Panneau de contrôle */}
        <aside className="w-full border-t border-[#1e1e22] bg-[#101013] p-5 lg:w-[340px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:[height:calc(100vh-73px)]">
          {/* Couleur */}
          <section>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[#8b8b93]">
              Couleur du vêtement
            </p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => setColor(c.hex)}
                  className={`h-9 w-9 rounded-full border transition ${
                    color === c.hex
                      ? "border-[#d4a94e] ring-2 ring-[#d4a94e]/30"
                      : "border-[#26262b] hover:border-[#4a4a52]"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-[#8b8b93]">{colorName}</p>
          </section>

          {/* Arrière-plan */}
          <section className="mt-6">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[#8b8b93]">
              Arrière-plan
            </p>
            <div className="flex flex-wrap gap-2">
              {BG_PRESETS.map((p) => (
                <button
                  key={p.name}
                  title={p.name}
                  onClick={() => selectBgPreset(p)}
                  className={`h-9 w-9 rounded-lg border transition ${
                    bgSelected === p.name
                      ? "border-[#d4a94e] ring-2 ring-[#d4a94e]/30"
                      : "border-[#26262b] hover:border-[#4a4a52]"
                  }`}
                  style={{
                    background:
                      p.kind === "color"
                        ? p.value
                        : `linear-gradient(to top, ${p.stops![0]}, ${p.stops![1]})`,
                  }}
                  aria-label={p.name}
                />
              ))}
              <input
                ref={bgInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleBgUpload}
                className="hidden"
              />
              <button
                onClick={() => bgInputRef.current?.click()}
                title="Importer une image"
                className={`flex h-9 w-9 items-center justify-center rounded-lg border text-lg leading-none transition ${
                  bgSelected === "Image personnalisée"
                    ? "border-[#d4a94e] text-[#d4a94e] ring-2 ring-[#d4a94e]/30"
                    : "border-dashed border-[#33333a] text-[#8b8b93] hover:border-[#d4a94e]/50"
                }`}
              >
                +
              </button>
            </div>
            <p className="mt-2 text-xs text-[#8b8b93]">{bgSelected}</p>
          </section>

          {/* Logo */}
          <section className="mt-6">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[#8b8b93]">
              Votre design
            </p>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <button
              onClick={() => logoInputRef.current?.click()}
              className="w-full rounded-lg border border-dashed border-[#33333a] bg-[#141417] px-4 py-3 text-sm text-[#c9c9cf] transition hover:border-[#d4a94e]/50"
            >
              {logoName ? `✓ ${logoName} — changer` : "Importer un logo (PNG conseillé)"}
            </button>

            {logoTexture && (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-xs text-[#8b8b93]">Taille du logo</span>
                  <input
                    type="range"
                    min={0.05}
                    max={0.35}
                    step={0.005}
                    value={logoScale}
                    onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                    className="mt-1 w-full accent-[#d4a94e]"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-[#8b8b93]">Position (haut / bas)</span>
                  <input
                    type="range"
                    min={-0.12}
                    max={0.18}
                    step={0.005}
                    value={logoY}
                    onChange={(e) => setLogoY(parseFloat(e.target.value))}
                    className="mt-1 w-full accent-[#d4a94e]"
                  />
                </label>
              </div>
            )}
          </section>

          {/* Animation */}
          <section className="mt-6">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[#8b8b93]">
              Animation
            </p>
            <div className="grid grid-cols-2 gap-2">
              {ANIMATIONS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAnimation(a.id)}
                  className={`rounded-lg border px-3 py-2 text-xs transition ${
                    animation === a.id
                      ? "border-[#d4a94e] bg-[#d4a94e]/10 text-[#d4a94e]"
                      : "border-[#26262b] bg-[#141417] text-[#c9c9cf] hover:border-[#4a4a52]"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </section>

          {/* Vidéo */}
          <section className="mt-6">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-[#8b8b93]">
              Vidéo
            </p>
            {!recording ? (
              <button
                onClick={startRecording}
                className="w-full rounded-lg border border-[#26262b] bg-[#141417] py-3 text-sm font-medium text-white transition hover:border-red-500/60"
              >
                ● Enregistrer une vidéo
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-full rounded-lg border border-red-500/60 bg-red-500/10 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
              >
                ■ Arrêter et télécharger ({recordSeconds}s)
              </button>
            )}
            <p className="mt-2 text-[11px] text-[#5f5f66]">
              Lancez une animation puis enregistrez (max {MAX_RECORD_SECONDS}s).
              Export MP4 sur iPhone/Safari, WebM sur Chrome.
            </p>
          </section>

          {/* Actions */}
          <section className="mt-8 space-y-3">
            <button
              onClick={downloadPNG}
              className="w-full rounded-lg border border-[#26262b] bg-[#141417] py-3 text-sm font-medium text-white transition hover:border-[#4a4a52]"
            >
              Télécharger l'image PNG
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-[#d4a94e] py-3 text-center text-sm font-semibold text-[#0b0b0d] transition hover:bg-[#e0b95e]"
            >
              Commander ce design via WhatsApp
            </a>
            <p className="text-center text-[11px] text-[#5f5f66]">
              Production DTF & broderie — Caractère Store, Alger
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
