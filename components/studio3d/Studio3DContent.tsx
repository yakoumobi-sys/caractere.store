"use client";

import {
  useRef, useState, useEffect, useCallback,
  Component, ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF, Center } from "@react-three/drei";
import { useSearchParams } from "next/navigation";
import * as THREE from "three";

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

type Anim = "aucune"|"rotation"|"flottement"|"marche";
const ANIMS: {id:Anim;label:string;icon:string}[] = [
  {id:"aucune",label:"Aucune",icon:"⏹"},
  {id:"rotation",label:"Rotation",icon:"🔄"},
  {id:"flottement",label:"Flottement",icon:"🌊"},
  {id:"marche",label:"Marche",icon:"🚶"},
];

function SceneBg({ bgColor }: { bgColor: string }) {
  const { scene } = useThree();
  useEffect(() => { scene.background = new THREE.Color(bgColor); }, [bgColor, scene]);
  return null;
}

function Model({ product, color }: { product: string; color: string }) {
  const path = MODELS[product] || MODELS["tshirt"];
  const { scene } = useGLTF(path) as any;
  const tint = PRODUCTS[product]?.tint;
  const tc = useRef(new THREE.Color(color));

  useFrame(() => {
    if (!tint) return;
    tc.current.set(color);
    scene.traverse((o: any) => {
      if (o.isMesh && o.material?.color) o.material.color.lerp(tc.current, 0.15);
    });
  });

  useEffect(() => {
    scene.traverse((o: any) => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
    });
  }, [scene]);

  return (
    <Center position={[0, 0, 0]}>
      <primitive object={scene} />
    </Center>
  );
}

Object.values(MODELS).forEach(m => useGLTF.preload(m));

function Scene({ bgColor, anim, color, product }: { bgColor: string; anim: Anim; color: string; product: string }) {
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
      <group ref={g} position={[0, 0, 0]}><Model product={product} color={color} /></group>
      <ContactShadows position={[0,-1,0]} opacity={0.35} scale={4} blur={2.4} far={2} />
      <OrbitControls enablePan={false} minDistance={1.5} maxDistance={6} minPolarAngle={Math.PI/5} maxPolarAngle={3*Math.PI/4} />
    </>
  );
}

export default function Studio3DContent() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("produit") || "tshirt";
  const colorParam = searchParams.get("couleur") || "Blanc";
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[productParam] ? productParam : "tshirt");
  const [color, setColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#667eea");
  const [bgName, setBgName] = useState("Bleu");
  const [anim, setAnim] = useState<Anim>("rotation");
  const [rec, setRec] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(1);
  const [logoX, setLogoX] = useState(0);
  const [logoY, setLogoY] = useState(0);
  const [logoRotate, setLogoRotate] = useState(0);
  const [logos, setLogos] = useState<Array<{id:string; src:string; scale:number; x:number; y:number; rotate:number}>>([]);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { const c = ALL_COLORS[colorParam]; if (c) setColor(c); }, [colorParam]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedLogo(event.target?.result as string);
        setLogoScale(1);
        setLogoX(0);
        setLogoY(0);
        setLogoRotate(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const addLogo = () => {
    if (!uploadedLogo) return;
    const newLogo = {
      id: Date.now().toString(),
      src: uploadedLogo,
      scale: logoScale,
      x: logoX,
      y: logoY,
      rotate: logoRotate,
    };
    setLogos([...logos, newLogo]);
    setUploadedLogo(null);
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
  const canTint = PRODUCTS[selectedProduct]?.tint;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white text-[#0a1f2e]">
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3">
          <div className="flex items-center gap-3">
            <img src="https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png" alt="Caractère" className="h-9 w-auto" />
            <div>
              <p className="text-sm font-bold leading-tight">Caractère</p>
              <p className="text-[10px] leading-tight text-[#0a1f2e]/50">Studio 3D</p>
            </div>
          </div>
          <a href="/designer" className="text-xs text-[#0a1f2e]/40 hover:text-[#0a1f2e]">← Designer</a>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
          <div className="relative h-[56vh] min-h-[340px] flex-1 lg:h-[calc(100vh-57px)]" style={{ backgroundColor: bgColor }}>
            <Canvas camera={{ position: [0, 0, 4], fov: 30 }} gl={{ preserveDrawingBuffer: true, antialias: true }}
              onCreated={({ gl }) => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); glRef.current = gl; }} shadows>
              <Scene bgColor={bgColor} anim={anim} color={color} product={selectedProduct} />
            </Canvas>
            
            {/* Logos Overlay */}
            {logos.map(logo => (
              <div key={logo.id} className="absolute" style={{
                left: `calc(50% + ${logo.x}px)`,
                top: `calc(50% + ${logo.y}px)`,
                transform: `translate(-50%, -50%) scale(${logo.scale}) rotate(${logo.rotate}deg)`,
                zIndex: 10,
                pointerEvents: 'none'
              }}>
                <div className="relative">
                  <img src={logo.src} alt="logo" className="max-w-[150px] drop-shadow-lg" style={{pointerEvents:'none'}} />
                  <button onClick={() => removeLogo(logo.id)} style={{pointerEvents:'auto'}} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold hover:bg-red-700">✕</button>
                </div>
              </div>
            ))}

            {rec && <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span className="text-xs font-semibold text-white">{recSec}s/{MAX_REC}s</span>
            </div>}
          </div>

          <aside className="w-full border-t border-gray-100 bg-[#f8fafc] p-5 lg:w-[310px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:[height:calc(100vh-57px)]">
            <section>
              <p className="mb-2 text-[10px] font-bold uppercase text-[#0a1f2e]/40">Produit</p>
              <div className="space-y-2">
                {Object.entries(PRODUCTS).map(([key, prod]) => (
                  <button key={key} onClick={() => setSelectedProduct(key)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs transition ${selectedProduct === key ? "border-[#d41717] bg-red-50 text-[#d41717]" : "border-gray-200 bg-white text-[#0a1f2e]/50"}`}>
                    {prod.emoji} {prod.name}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase text-[#0a1f2e]/40">Couleur</p>
              <p className="text-xs font-semibold text-[#0a1f2e]">{colorParam}</p>
              {!canTint && <p className="mt-1 text-[10px] text-[#0a1f2e]/40">Ce modèle garde sa texture d'origine</p>}
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase text-[#0a1f2e]/40">Arrière-plan</p>
              <div className="flex flex-wrap gap-2">
                {BGS.map(b => <button key={b.name} title={b.name} onClick={() => { setBgColor(b.hex); setBgName(b.name); }}
                  className={`h-8 w-8 rounded-lg border-2 transition ${bgName === b.name ? "border-[#d41717] scale-110" : "border-gray-300"}`}
                  style={{ backgroundColor: b.hex }} />)}
              </div>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase text-[#0a1f2e]/40">Animation</p>
              <div className="grid grid-cols-2 gap-2">
                {ANIMS.map(a => <button key={a.id} onClick={() => setAnim(a.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${anim === a.id ? "border-[#d41717] bg-red-50 text-[#d41717]" : "border-gray-200 bg-white"}`}>
                  <span>{a.icon}</span><span className="text-[11px]">{a.label}</span>
                </button>)}
              </div>
            </section>

            {/* Logo Upload Section */}
            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase text-[#0a1f2e]/40">Votre Logo</p>
              <label className={`block w-full rounded-xl border-2 border-dashed p-3 text-center cursor-pointer transition ${uploadedLogo ? "border-[#d41717] bg-red-50" : "border-gray-300 bg-white"}`}>
                <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
                <p className="text-2xl mb-1">📤</p>
                <p className="text-xs font-semibold text-[#0a1f2e]">{uploadedLogo ? "✓ Logo uploadé" : "Uploader un logo"}</p>
              </label>
              
              {uploadedLogo && (
                <div className="mt-3 space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                  <div className="text-xs font-semibold">Taille: 
                    <input type="range" min="0.5" max="3" step="0.1" value={logoScale} onChange={(e) => setLogoScale(parseFloat(e.target.value))} className="w-full" />
                    <span className="text-[10px] text-gray-500">{logoScale.toFixed(1)}x</span>
                  </div>
                  <div className="text-xs font-semibold">Position X: 
                    <input type="range" min="-200" max="200" value={logoX} onChange={(e) => setLogoX(parseInt(e.target.value))} className="w-full" />
                  </div>
                  <div className="text-xs font-semibold">Position Y: 
                    <input type="range" min="-200" max="200" value={logoY} onChange={(e) => setLogoY(parseInt(e.target.value))} className="w-full" />
                  </div>
                  <div className="text-xs font-semibold">Rotation: 
                    <input type="range" min="0" max="360" value={logoRotate} onChange={(e) => setLogoRotate(parseInt(e.target.value))} className="w-full" />
                    <span className="text-[10px] text-gray-500">{logoRotate}°</span>
                  </div>
                  <button onClick={addLogo} className="w-full bg-[#d41717] text-white py-2 rounded-lg text-xs font-bold">➕ Ajouter le logo</button>
                </div>
              )}

              {logos.length > 0 && (
                <div className="mt-3 text-xs font-semibold text-[#0a1f2e]">
                  {logos.length} logo{logos.length > 1 ? 's' : ''} ajouté{logos.length > 1 ? 's' : ''}
                </div>
              )}
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase text-[#0a1f2e]/40">Exporter</p>
              <div className="space-y-2">
                <button onClick={dlPNG} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-medium text-[#0a1f2e]/60">📷 PNG</button>
                {!rec ? <button onClick={startRec} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-medium text-[#0a1f2e]/60">● Vidéo</button>
                  : <button onClick={stopRec} className="w-full rounded-xl border border-red-300 bg-red-50 py-2.5 text-xs font-semibold text-red-600">■ Arrêter</button>}
              </div>
            </section>

            <section className="mt-6">
              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="block w-full rounded-xl bg-[#d41717] py-3.5 text-center text-sm font-bold text-white">Commander →</a>
            </section>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
