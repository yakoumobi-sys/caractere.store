"use client";

import { useRef, useState, useEffect, useCallback, Component, ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF, Center, Decal } from "@react-three/drei";
import { useSearchParams } from "next/navigation";
import * as THREE from "three";

const WHATSAPP = "213557440522";
const MAX_REC = 30;

const MODELS: Record<string, string> = {
  "tshirt": "/models/shirt_tshirt.glb",
  "tshirt_oversized": "/models/shirt_oversized.glb",
  "polo": "/models/shirt_polo.glb",
};

const PRODUCTS: Record<string, { id: string; name: string; emoji: string; tint: boolean }> = {
  "tshirt": { id: "tshirt", name: "T-shirt", emoji: "👕", tint: true },
  "tshirt_oversized": { id: "tshirt_oversized", name: "Oversized Boxy", emoji: "👕", tint: false },
  "polo": { id: "polo", name: "Polo", emoji: "🎾", tint: false },
};

const ALL_COLORS: Record<string, string> = {
  "blanc": "#FFFFFF", "Blanc": "#FFFFFF",
  "noir": "#1A1A1A", "Noir": "#1A1A1A",
  "marine": "#1E3A5F", "Marine": "#1E3A5F",
  "royal": "#2563EB", "Bleu roi": "#2563EB",
  "rouge": "#DC2626", "Rouge": "#DC2626",
  "vert": "#166534", "Vert": "#166534",
  "gris": "#6B7280", "Gris": "#6B7280",
  "beige": "#D6B99A", "Beige": "#D6B99A",
  "bordeaux": "#7F1D1D", "Bordeaux": "#7F1D1D",
};

const BGS = [
  { name: "Bleu", hex: "#667eea" },
  { name: "Rose", hex: "#f5576c" },
  { name: "Cyan", hex: "#4facfe" },
  { name: "Noir", hex: "#0a0a0a" },
  { name: "Blanc", hex: "#f5f5f5" },
];

const PLACEMENT_ZONES = [
  { id: "chest", label: "Poitrine", position: [0, 0.1, 0.2] as [number, number, number], scale: 0.15 },
  { id: "back", label: "Dos", position: [0, 0.1, -0.2] as [number, number, number], scale: 0.15 },
  { id: "sleeve-left", label: "Manche gauche", position: [-0.25, 0, 0] as [number, number, number], scale: 0.08 },
  { id: "sleeve-right", label: "Manche droite", position: [0.25, 0, 0] as [number, number, number], scale: 0.08 },
];

type Anim = "aucune"|"rotation"|"flottement"|"marche";
const ANIMS: {id:Anim;label:string;icon:string}[] = [
  {id:"aucune",label:"Aucune",icon:"⏹"},
  {id:"rotation",label:"Rotation",icon:"🔄"},
  {id:"flottement",label:"Flottement",icon:"🌊"},
  {id:"marche",label:"Marche",icon:"🚶"},
];

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { error: null }; }
  componentDidCatch(error: Error) { this.setState({ error: error.message }); }
  render() {
    if (this.state.error) return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6 text-[#0a1f2e]">
        <div className="max-w-sm rounded-2xl border border-red-300 bg-red-50 p-6 text-center">
          <p className="mb-2 text-sm font-semibold text-red-600">Erreur</p>
          <p className="text-xs text-red-700">{this.state.error}</p>
        </div>
      </div>
    );
    return this.props.children;
  }
}

function SceneBg({ bgColor }: { bgColor: string }) {
  const { scene } = useThree();
  useEffect(() => { scene.background = new THREE.Color(bgColor); }, [bgColor, scene]);
  return null;
}

interface LogoDecal {
  id: string;
  src: string;
  zone: string;
  scale: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

function ModelWithDecals({
  product,
  color,
  logos
}: {
  product: string;
  color: string;
  logos: LogoDecal[];
}) {
  const path = MODELS[product] || MODELS["tshirt"];
  const { scene } = useGLTF(path) as any;
  const tint = PRODUCTS[product]?.tint;
  const tc = useRef(new THREE.Color(color));
  const meshRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!tint || !meshRef.current) return;
    tc.current.set(color);
    meshRef.current.traverse((o: any) => {
      if (o.isMesh && o.material?.color) o.material.color.lerp(tc.current, 0.15);
    });
  });

  useEffect(() => {
    scene.traverse((o: any) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    <Center position={[0, 0, 0]}>
      <group ref={meshRef}>
        <primitive object={scene} />

        {/* Applique les logos comme décals sur le modèle */}
        {logos.map(logo => (
          <LogoDecal key={logo.id} logo={logo} />
        ))}
      </group>
    </Center>
  );
}

function LogoDecal({ logo }: { logo: LogoDecal }) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const zone = PLACEMENT_ZONES.find(z => z.id === logo.zone);
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!logo.src) return;
    const loader = new THREE.TextureLoader();
    loader.load(logo.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
  }, [logo.src]);

  if (!zone || !texture) return null;

  return (
    <mesh ref={meshRef} position={zone.position}>
      <Decal
        position={[0, 0, 0]}
        rotation={[0, 0, logo.rotation]}
        scale={zone.scale * logo.scale}
        map={texture}
      />
    </mesh>
  );
}

function Scene({
  bgColor,
  anim,
  color,
  product,
  logos,
}: {
  bgColor: string;
  anim: Anim;
  color: string;
  product: string;
  logos: LogoDecal[];
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(state => {
    const t = state.clock.getElapsedTime();
    const gr = g.current; if (!gr) return;
    if (anim !== "rotation") gr.rotation.y *= 0.95;
    if (anim !== "flottement" && anim !== "marche") { gr.position.y *= 0.9; gr.rotation.z *= 0.9; gr.rotation.x *= 0.9; }
    if (anim === "rotation") gr.rotation.y += 0.012;
    if (anim === "flottement") { gr.position.y = Math.sin(t*1.4)*0.05; gr.rotation.z = Math.sin(t*0.9)*0.04; gr.rotation.y = Math.sin(t*0.6)*0.25; }
    if (anim === "marche") { const s = t*3.4; gr.position.y = Math.abs(Math.sin(s))*0.05; gr.rotation.z = Math.sin(s)*0.05; gr.rotation.x = 0.03 + Math.sin(s*2)*0.012; gr.rotation.y = Math.sin(t*0.8)*0.18; }
  });
  return (
    <>
      <SceneBg bgColor={bgColor} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} />
      <group ref={g} position={[0, 0, 0]}>
        <ModelWithDecals product={product} color={color} logos={logos} />
      </group>
      <ContactShadows position={[0,-1,0]} opacity={0.35} scale={4} blur={2.4} far={2} />
      <OrbitControls enablePan={false} minDistance={0.8} maxDistance={4} minPolarAngle={Math.PI/5} maxPolarAngle={3*Math.PI/4} />
    </>
  );
}

Object.values(MODELS).forEach(m => useGLTF.preload(m));

export default function Studio3DAdvanced() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product") || "tshirt";
  const colorParam = searchParams.get("couleur") || "Blanc";
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[productParam] ? productParam : "tshirt");
  const [color, setColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#667eea");
  const [bgName, setBgName] = useState("Bleu");
  const [anim, setAnim] = useState<Anim>("rotation");
  const [rec, setRec] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState("chest");
  const [logoScale, setLogoScale] = useState(1);
  const [logoRotation, setLogoRotation] = useState(0);
  const [logos, setLogos] = useState<LogoDecal[]>([]);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const c = ALL_COLORS[colorParam];
    if (c) setColor(c);
  }, [colorParam]);

  // Charge les données du designer
  useEffect(() => {
    try {
      const designerDataStr = sessionStorage.getItem('designer_data');
      if (designerDataStr) {
        const designerData = JSON.parse(designerDataStr);
        if (designerData.color) setColor(designerData.color);

        if (designerData.layers && designerData.layers.length > 0) {
          const logoLayer = designerData.layers.find((l: any) => l.type === 'image' && l.src);
          if (logoLayer) {
            const newLogo: LogoDecal = {
              id: Date.now().toString(),
              src: logoLayer.src,
              zone: "chest",
              scale: logoLayer.scale || 1,
              rotation: logoLayer.rotation || 0,
              offsetX: 0,
              offsetY: 0,
            };
            setLogos([newLogo]);
          }
        }
        sessionStorage.removeItem('designer_data');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du design:', error);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLogo = () => {
    if (!uploadedLogo) return;
    const newLogo: LogoDecal = {
      id: Date.now().toString(),
      src: uploadedLogo,
      zone: selectedZone,
      scale: logoScale,
      rotation: logoRotation,
      offsetX: 0,
      offsetY: 0,
    };
    setLogos([...logos, newLogo]);
    setUploadedLogo(null);
    setLogoScale(1);
    setLogoRotation(0);
  };

  const updateLogo = (id: string, updates: Partial<LogoDecal>) => {
    setLogos(logos.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const removeLogo = (id: string) => {
    setLogos(logos.filter(l => l.id !== id));
  };

  const dlPNG = useCallback(() => {
    const gl = glRef.current; if (!gl) return;
    const a = document.createElement("a");
    a.href = gl.domElement.toDataURL("image/png");
    a.download = "caracterstore-3d.png"; a.click();
  }, []);

  const stopRec = useCallback(() => recRef.current?.stop(), []);
  const startRec = useCallback(() => {
    const gl = glRef.current; if (!gl || rec) return;
    const stream = gl.domElement.captureStream(30);
    const mt = ["video/mp4;codecs=avc1", "video/mp4", "video/webm;codecs=vp9", "video/webm"].find(m => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m));
    if (!mt) { alert("Non supporté."); return; }
    const recorder = new MediaRecorder(stream, { mimeType: mt, videoBitsPerSecond: 8_000_000 });
    chunks.current = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.current.push(e.data); };
    recorder.onstop = () => {
      const ext = mt.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(chunks.current, { type: mt });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `caracterstore-3d.${ext}`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setRec(false); setRecSec(0); if (timer.current) clearInterval(timer.current);
    };
    recRef.current = recorder; recorder.start(); setRec(true); setRecSec(0);
    timer.current = setInterval(() => setRecSec(s => { if (s + 1 >= MAX_REC) { recorder.stop(); return s + 1; } return s + 1; }), 1000);
  }, [rec]);

  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);

  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Bonjour Caractère Store 👋\nJe viens du Studio 3D. ${PRODUCTS[selectedProduct]?.name} ${colorParam}.`)}`;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white text-[#0a1f2e]">
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3">
          <div className="flex items-center gap-3">
            <img src="https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png" alt="Caractère" className="h-9 w-auto" />
            <div>
              <p className="text-sm font-bold leading-tight">Caractère</p>
              <p className="text-[10px] leading-tight text-[#0a1f2e]/50">Studio 3D Professionnel</p>
            </div>
          </div>
          <a href="/designer" className="text-xs text-[#0a1f2e]/40 hover:text-[#0a1f2e]">← Designer</a>
        </header>

        <div className="mx-auto flex max-w-7xl flex-col lg:flex-row gap-4 p-4">
          {/* Canvas 3D */}
          <div className="relative flex-1 rounded-2xl overflow-hidden" style={{ minHeight: "600px", backgroundColor: bgColor }}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 30 }}
              gl={{ preserveDrawingBuffer: true, antialias: true, alpha: false }}
              onCreated={({ gl }) => {
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                glRef.current = gl;
              }}
              shadows
            >
              <Scene bgColor={bgColor} anim={anim} color={color} product={selectedProduct} logos={logos} />
            </Canvas>

            {rec && (
              <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-white">{recSec}s/{MAX_REC}s</span>
              </div>
            )}
          </div>

          {/* Panneau de contrôle */}
          <aside className="w-full lg:w-[380px] space-y-4 overflow-y-auto max-h-[800px]">
            {/* Produit */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Produit</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PRODUCTS).map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                      selectedProduct === p.id
                        ? 'bg-[#0C4A6E] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p.emoji} {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Couleur */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Couleur</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ALL_COLORS).map(([key, hex]) => {
                  if (key.length > 5 || hex === color) return null;
                  return (
                    <button
                      key={key}
                      onClick={() => setColor(hex)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === hex ? 'border-[#0C4A6E] scale-110' : 'border-gray-300'
                      }`}
                      style={{
                        background: hex,
                        boxShadow: hex === '#FFFFFF' ? 'inset 0 0 0 1px #ddd' : undefined,
                      }}
                      title={key}
                    />
                  );
                })}
              </div>
            </div>

            {/* Zones de placement */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Zones</h3>
              <div className="grid grid-cols-2 gap-2">
                {PLACEMENT_ZONES.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                      selectedZone === zone.id
                        ? 'bg-[#0C4A6E] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {zone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload et ajout de logo */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Logo</h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full text-xs mb-3"
              />
              {uploadedLogo && (
                <>
                  <div className="mb-3 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={uploadedLogo} alt="preview" className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-2 mb-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Échelle: {logoScale.toFixed(2)}</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={logoScale}
                        onChange={e => setLogoScale(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600">Rotation: {logoRotation}°</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="15"
                        value={logoRotation}
                        onChange={e => setLogoRotation(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <button
                    onClick={addLogo}
                    className="w-full bg-[#0C4A6E] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#1E6FA8] transition-all"
                  >
                    Ajouter sur le t-shirt
                  </button>
                </>
              )}
            </div>

            {/* Logos ajoutés */}
            {logos.length > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Logos ({logos.length})</h3>
                <div className="space-y-2">
                  {logos.map(logo => (
                    <div key={logo.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                      <div className="text-xs">
                        <p className="font-semibold">{PLACEMENT_ZONES.find(z => z.id === logo.zone)?.label}</p>
                        <p className="text-gray-600">Échelle: {logo.scale.toFixed(1)}</p>
                      </div>
                      <button
                        onClick={() => removeLogo(logo.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Animation */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Animation</h3>
              <div className="grid grid-cols-2 gap-2">
                {ANIMS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAnim(a.id)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                      anim === a.id
                        ? 'bg-[#0C4A6E] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Fond */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Fond</h3>
              <div className="grid grid-cols-3 gap-2">
                {BGS.map(bg => (
                  <button
                    key={bg.name}
                    onClick={() => { setBgColor(bg.hex); setBgName(bg.name); }}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                      bgName === bg.name
                        ? 'border-[#0C4A6E]'
                        : 'border-transparent'
                    }`}
                    style={{ background: bg.hex, color: bg.hex === '#f5f5f5' ? '#000' : '#fff' }}
                  >
                    {bg.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 space-y-2">
              <button
                onClick={dlPNG}
                className="w-full bg-[#0C4A6E] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#1E6FA8] transition-all"
              >
                📸 Télécharger l'image
              </button>
              <button
                onClick={rec ? stopRec : startRec}
                className={`w-full py-2 rounded-lg font-semibold text-sm transition-all ${
                  rec
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {rec ? '⏹ Arrêter la vidéo' : '🎥 Enregistrer'}
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#25D366] text-white py-2 rounded-lg font-semibold text-sm hover:bg-[#1fa84c] transition-all text-center"
              >
                💬 WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
