"use client";

import {
  Suspense, useRef, useState, useEffect, useCallback,
  Component, ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
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

const PRODUCTS: Record<string, { id: string; name: string; emoji: string; colors: string[] }> = {
  "tshirt": { id: "tshirt", name: "T-shirt", emoji: "👕", colors: ["blanc", "noir", "marine", "royal", "rouge", "vert", "gris", "beige", "bordeaux"] },
  "tshirt_oversized": { id: "tshirt_oversized", name: "Oversized Boxy", emoji: "👕", colors: ["blanc", "noir", "marine", "royal", "rouge", "vert", "gris", "beige", "bordeaux"] },
  "polo": { id: "polo", name: "Polo", emoji: "🎾", colors: ["blanc", "noir", "marine", "royal", "rouge", "vert", "gris", "beige", "bordeaux"] },
  "hoodie": { id: "hoodie", name: "Hoodie", emoji: "🧥", colors: ["blanc", "noir", "marine", "royal", "rouge", "vert", "gris", "beige", "bordeaux"] },
};

const ALL_COLORS: Record<string, string> = {
  "blanc": "#FFFFFF",
  "noir": "#1A1A1A",
  "marine": "#1E3A5F",
  "royal": "#2563EB",
  "rouge": "#DC2626",
  "vert": "#166534",
  "gris": "#6B7280",
  "beige": "#D6B99A",
  "bordeaux": "#7F1D1D",
};

const BGS = [
  { name: "Dégradé bleu", hex: "#667eea" },
  { name: "Dégradé rose", hex: "#f093fb" },
  { name: "Dégradé vert", hex: "#4facfe" },
  { name: "Noir mat", hex: "#0a0a0a" },
  { name: "Blanc pur", hex: "#f5f5f5" },
];

type Anim = "aucune"|"rotation"|"flottement"|"marche";
const ANIMS: {id:Anim;label:string;icon:string}[] = [
  {id:"aucune",label:"Aucune",icon:"⏹"},
  {id:"rotation",label:"Rotation",icon:"🔄"},
  {id:"flottement",label:"Flottement",icon:"🌊"},
  {id:"marche",label:"Marche",icon:"🚶"},
];

function createTShirtGeometry() {
  const group = new THREE.Group();
  const bodyGeom = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const body = new THREE.Mesh(bodyGeom);
  body.position.z = 0;
  body.position.y = 0.1;
  group.add(body);

  const leftSleeveGeom = new THREE.BoxGeometry(0.35, 0.4, 0.15);
  const leftSleeve = new THREE.Mesh(leftSleeveGeom);
  leftSleeve.position.x = -0.5;
  leftSleeve.position.y = 0.2;
  leftSleeve.rotation.z = 0.3;
  group.add(leftSleeve);

  const rightSleeveGeom = new THREE.BoxGeometry(0.35, 0.4, 0.15);
  const rightSleeve = new THREE.Mesh(rightSleeveGeom);
  rightSleeve.position.x = 0.5;
  rightSleeve.position.y = 0.2;
  rightSleeve.rotation.z = -0.3;
  group.add(rightSleeve);

  const collarGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.08, 32);
  const collar = new THREE.Mesh(collarGeom);
  collar.position.y = 0.55;
  collar.position.z = 0.08;
  group.add(collar);

  return { group, meshes: [body, leftSleeve, rightSleeve, collar] };
}

function createOversizedBoxyGeometry() {
  const group = new THREE.Group();
  const bodyGeom = new THREE.BoxGeometry(0.85, 0.95, 0.25);
  const body = new THREE.Mesh(bodyGeom);
  body.position.z = 0;
  body.position.y = 0.05;
  group.add(body);

  const leftSleeveGeom = new THREE.BoxGeometry(0.5, 0.5, 0.18);
  const leftSleeve = new THREE.Mesh(leftSleeveGeom);
  leftSleeve.position.x = -0.65;
  leftSleeve.position.y = 0.15;
  leftSleeve.rotation.z = 0.15;
  group.add(leftSleeve);

  const rightSleeveGeom = new THREE.BoxGeometry(0.5, 0.5, 0.18);
  const rightSleeve = new THREE.Mesh(rightSleeveGeom);
  rightSleeve.position.x = 0.65;
  rightSleeve.position.y = 0.15;
  rightSleeve.rotation.z = -0.15;
  group.add(rightSleeve);

  const collarGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
  const collar = new THREE.Mesh(collarGeom);
  collar.position.y = 0.6;
  collar.position.z = 0.1;
  group.add(collar);

  return { group, meshes: [body, leftSleeve, rightSleeve, collar] };
}

function createPoloGeometry() {
  const group = new THREE.Group();
  const bodyGeom = new THREE.BoxGeometry(0.6, 0.75, 0.2);
  const body = new THREE.Mesh(bodyGeom);
  body.position.z = 0;
  body.position.y = 0.12;
  group.add(body);

  const leftSleeveGeom = new THREE.BoxGeometry(0.3, 0.35, 0.15);
  const leftSleeve = new THREE.Mesh(leftSleeveGeom);
  leftSleeve.position.x = -0.45;
  leftSleeve.position.y = 0.25;
  leftSleeve.rotation.z = 0.25;
  group.add(leftSleeve);

  const rightSleeveGeom = new THREE.BoxGeometry(0.3, 0.35, 0.15);
  const rightSleeve = new THREE.Mesh(rightSleeveGeom);
  rightSleeve.position.x = 0.45;
  rightSleeve.position.y = 0.25;
  rightSleeve.rotation.z = -0.25;
  group.add(rightSleeve);

  const collarGeom = new THREE.BoxGeometry(0.35, 0.15, 0.12);
  const collar = new THREE.Mesh(collarGeom);
  collar.position.y = 0.52;
  collar.position.z = 0.1;
  group.add(collar);

  const buttonGeom = new THREE.SphereGeometry(0.05, 16, 16);
  const button = new THREE.Mesh(buttonGeom);
  button.position.y = 0.4;
  button.position.z = 0.12;
  group.add(button);

  return { group, meshes: [body, leftSleeve, rightSleeve, collar, button] };
}

function createHoodieGeometry() {
  const group = new THREE.Group();
  
  const bodyGeom = new THREE.BoxGeometry(0.65, 0.85, 0.22);
  const body = new THREE.Mesh(bodyGeom);
  body.position.z = 0;
  body.position.y = 0.08;
  group.add(body);

  const leftSleeveGeom = new THREE.BoxGeometry(0.4, 0.45, 0.16);
  const leftSleeve = new THREE.Mesh(leftSleeveGeom);
  leftSleeve.position.x = -0.52;
  leftSleeve.position.y = 0.18;
  leftSleeve.rotation.z = 0.2;
  group.add(leftSleeve);

  const rightSleeveGeom = new THREE.BoxGeometry(0.4, 0.45, 0.16);
  const rightSleeve = new THREE.Mesh(rightSleeveGeom);
  rightSleeve.position.x = 0.52;
  rightSleeve.position.y = 0.18;
  rightSleeve.rotation.z = -0.2;
  group.add(rightSleeve);

  const hoodGeom = new THREE.SphereGeometry(0.25, 32, 16);
  const hood = new THREE.Mesh(hoodGeom);
  hood.position.y = 0.62;
  hood.position.z = 0.05;
  hood.scale.set(1, 0.8, 0.9);
  group.add(hood);

  const cordGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.25, 16);
  const leftCord = new THREE.Mesh(cordGeom);
  leftCord.position.set(-0.08, 0.35, 0.08);
  leftCord.rotation.z = 0.3;
  group.add(leftCord);

  const rightCord = new THREE.Mesh(cordGeom);
  rightCord.position.set(0.08, 0.35, 0.08);
  rightCord.rotation.z = -0.3;
  group.add(rightCord);

  return { group, meshes: [body, leftSleeve, rightSleeve, hood, leftCord, rightCord] };
}

function SceneBg({ bgColor }: { bgColor: string }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(bgColor);
  }, [bgColor, scene]);
  return null;
}

function TShirt3D({ color, product }: { color: string; product: string }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (!groupRef.current) {
      let result = createTShirtGeometry();
      
      if (product === "tshirt_oversized") {
        result = createOversizedBoxyGeometry();
      } else if (product === "polo") {
        result = createPoloGeometry();
      } else if (product === "hoodie") {
        result = createHoodieGeometry();
      }
      
      const { group, meshes } = result;
      groupRef.current = group;
      meshesRef.current = meshes;

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.1,
        roughness: 0.8,
      });
      materialRef.current = material;

      meshes.forEach(mesh => {
        mesh.material = material;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      });
    }
  }, [product]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(color);
    }
  }, [color]);

  if (!groupRef.current) return null;
  return <primitive object={groupRef.current} />;
}

function Scene({ bgColor, anim, color, product }: { bgColor: string; anim: Anim; color: string; product: string }) {
  const g = useRef<THREE.Group>(null);

  useFrame(state => {
    const t = state.clock.getElapsedTime();
    const gr = g.current; if (!gr) return;

    if (anim !== "rotation") gr.rotation.y *= 0.95;
    if (anim !== "flottement" && anim !== "marche") {
      gr.position.y *= 0.9; gr.rotation.z *= 0.9; gr.rotation.x *= 0.9;
    }

    if (anim === "rotation") gr.rotation.y += 0.012;
    if (anim === "flottement") {
      gr.position.y = Math.sin(t*1.4)*0.035;
      gr.rotation.z = Math.sin(t*0.9)*0.04;
      gr.rotation.y = Math.sin(t*0.6)*0.25;
    }
    if (anim === "marche") {
      const s = t*3.4;
      gr.position.y = Math.abs(Math.sin(s))*0.032;
      gr.rotation.z = Math.sin(s)*0.05;
      gr.rotation.x = 0.03 + Math.sin(s*2)*0.012;
      gr.rotation.y = Math.sin(t*0.8)*0.18;
    }
  });

  return (
    <>
      <SceneBg bgColor={bgColor} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} />
      <group ref={g}>
        <TShirt3D color={color} product={product} />
      </group>
      <ContactShadows position={[0,-0.8,0]} opacity={0.35} scale={3} blur={2.2} far={1.5} />
      <OrbitControls enablePan={false} minDistance={1.2} maxDistance={4}
        minPolarAngle={Math.PI/4} maxPolarAngle={3*Math.PI/4} />
    </>
  );
}

export default function Studio3D() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("produit") || "tshirt";
  const colorParam = searchParams.get("couleur") || "blanc";
  
  const product = PRODUCTS[productParam] || PRODUCTS["tshirt"];
  const [selectedProduct, setSelectedProduct] = useState(product.id);
  const [color, setColor] = useState(ALL_COLORS["blanc"]);
  const [bgColor, setBgColor] = useState("#667eea");
  const [bgName, setBgName] = useState("Dégradé bleu");
  const [anim, setAnim] = useState<Anim>("rotation");
  const [rec, setRec] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const waUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Bonjour Caractère Store 👋\nJe viens du Studio 3D. ${PRODUCTS[selectedProduct]?.name || "Produit"} ${colorParam}.`)}`;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white text-[#0a1f2e]">
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d41717]">
              <span className="text-base font-black text-white">C</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Caractère</p>
              <p className="text-[10px] leading-tight text-[#0a1f2e]/50">Studio 3D</p>
            </div>
          </div>
          <a href="/designer" className="text-xs text-[#0a1f2e]/40 hover:text-[#0a1f2e]">← Designer</a>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
          <div className="relative h-[56vh] min-h-[340px] flex-1 lg:h-[calc(100vh-57px)]" style={{ backgroundColor: bgColor }}>
            <Canvas camera={{ position: [0, 0, 2.5], fov: 25 }} gl={{ preserveDrawingBuffer: true, antialias: true }}
              onCreated={({ gl }) => { gl.setPixelRatio(Math.min(window.devicePixelRatio, 2)); glRef.current = gl; }} shadows>
              <Suspense fallback={null}>
                <Scene bgColor={bgColor} anim={anim} color={color} product={selectedProduct} />
              </Suspense>
            </Canvas>

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
                  <button
                    key={key}
                    onClick={() => setSelectedProduct(key)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs transition ${
                      selectedProduct === key
                        ? "border-[#d41717] bg-red-50 text-[#d41717]"
                        : "border-gray-200 bg-white text-[#0a1f2e]/50"
                    }`}
                  >
                    {prod.emoji} {prod.name}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase text-[#0a1f2e]/40">Couleur</p>
              <p className="text-xs font-semibold text-[#0a1f2e]">{colorParam}</p>
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

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase text-[#0a1f2e]/40">Exporter</p>
              <div className="space-y-2">
                <button onClick={dlPNG} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-medium text-[#0a1f2e]/60">📷 PNG</button>
                {!rec ? <button onClick={startRec} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-medium text-[#0a1f2e]/60">● Vidéo</button>
                  : <button onClick={stopRec} className="w-full rounded-xl border border-red-300 bg-red-50 py-2.5 text-xs font-semibold text-red-600">■ Arrêter</button>}
              </div>
            </section>

            <section className="mt-6">
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full rounded-xl bg-[#d41717] py-3.5 text-center text-sm font-bold text-white">
                Commander →
              </a>
            </section>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
