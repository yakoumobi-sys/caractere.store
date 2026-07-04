"use client";

import {
  useRef, useState, useEffect, useCallback,
  Component, ErrorInfo, ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  constructor(props: { children: ReactNode }) { super(props); this.state = { error: null }; }
  componentDidCatch(error: Error) { this.setState({ error: error.message }); }
  render() {
    if (this.state.error) return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6 text-[#0a1f2e]">
        <div className="max-w-sm rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
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

const COLORS = [
  { name: "Blanc", hex: "#f2f0eb" }, { name: "Noir", hex: "#1c1c1e" },
  { name: "Beige", hex: "#d6c6a8" }, { name: "Marine", hex: "#1f2a44" },
  { name: "Bordeaux", hex: "#6e1423" }, { name: "Vert", hex: "#2d4a3a" },
  { name: "Gris", hex: "#9a9a9a" }, { name: "Caramel", hex: "#b0713a" },
];

const BGS = [
  { name: "Caractère Blue", color: "#0d2d45" },
  { name: "Studio sombre",  color: "#0b0b0d" },
  { name: "Blanc",          color: "#f5f5f2" },
  { name: "Crème",          color: "#e9e2d4" },
  { name: "Gris studio",    color: "#3a3a40" },
  { name: "Marine",         color: "#1f2a44" },
];

type Anim = "aucune"|"rotation"|"flottement"|"marche"|"formation";
const ANIMS: {id:Anim;label:string;icon:string}[] = [
  {id:"aucune",label:"Aucune",icon:"⏹"},
  {id:"rotation",label:"Rotation",icon:"🔄"},
  {id:"flottement",label:"Flottement",icon:"🌊"},
  {id:"marche",label:"Marche",icon:"🚶"},
  {id:"formation",label:"Tissage",icon:"🧵"},
];

function SceneBg({ color }: { color: string }) {
  const { scene } = useThree();
  useEffect(() => { scene.background = new THREE.Color(color); }, [color, scene]);
  return null;
}

function Shirt({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.setHex(parseInt(color.replace("#", ""), 16));
      meshRef.current.rotation.y += 0.004;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[0.2, 0.3, 0.15]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Scene({ bgColor, color, anim }: { bgColor: string; color: string; anim: Anim }) {
  const g = useRef<THREE.Group>(null);
  
  useFrame(state => {
    const t = state.clock.getElapsedTime();
    const gr = g.current; if (!gr) return;
    
    if (anim === "rotation") gr.rotation.y += 0.012;
    else if (anim === "flottement") {
      gr.position.y = Math.sin(t*1.4)*0.035;
      gr.rotation.z = Math.sin(t*0.9)*0.04;
      gr.rotation.y = Math.sin(t*0.6)*0.25;
    }
    else if (anim === "marche") {
      const s=t*3.4;
      gr.position.y=Math.abs(Math.sin(s))*0.032;
      gr.rotation.z=Math.sin(s)*0.05;
      gr.rotation.x=0.03+Math.sin(s*2)*0.012;
      gr.rotation.y=Math.sin(t*0.8)*0.18;
    }
    else {
      gr.rotation.y *= 0.95;
      gr.position.y *= 0.9;
      gr.rotation.z *= 0.9;
      gr.rotation.x *= 0.9;
    }
  });

  return (
    <>
      <SceneBg color={bgColor} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5,5,5]} intensity={0.8} />
      <Environment preset="city" />
      <group ref={g}>
        <Shirt color={color} />
      </group>
      <ContactShadows position={[0,-0.52,0]} opacity={0.4} scale={2.5} blur={2.2} far={1.2}/>
      <OrbitControls enablePan={false} minDistance={1.2} maxDistance={4} minPolarAngle={Math.PI/4} maxPolarAngle={3*Math.PI/4}/>
    </>
  );
}

export default function Studio3D() {
  const [color,setColor]=useState(COLORS[1].hex);
  const [logoTex,setLogoTex]=useState<THREE.Texture|null>(null);
  const [logoName,setLogoName]=useState<string|null>(null);
  const [bgColor,setBgColor]=useState("#0d2d45");
  const [bgName,setBgName]=useState("Caractère Blue");
  const [anim,setAnim]=useState<Anim>("rotation");
  const [rec,setRec]=useState(false);
  const [recSec,setRecSec]=useState(0);
  const glRef=useRef<THREE.WebGLRenderer|null>(null);
  const logoRef=useRef<HTMLInputElement>(null);
  const recRef=useRef<MediaRecorder|null>(null);
  const chunks=useRef<Blob[]>([]);
  const timer=useRef<ReturnType<typeof setInterval>|null>(null);

  const uploadLogo=useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=()=>new THREE.TextureLoader().load(r.result as string,tex=>{
      tex.colorSpace=THREE.SRGBColorSpace; tex.anisotropy=16;
      setLogoTex(tex); setLogoName(f.name);
    });
    r.readAsDataURL(f);
  },[]);

  const dlPNG=useCallback(()=>{
    const gl=glRef.current; if(!gl) return;
    const a=document.createElement("a"); a.href=gl.domElement.toDataURL("image/png");
    a.download="caractere-3d.png"; a.click();
  },[]);

  const stopRec=useCallback(()=>recRef.current?.stop(),[]);
  const startRec=useCallback(()=>{
    const gl=glRef.current; if(!gl||rec) return;
    const stream=gl.domElement.captureStream(30);
    const mt=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"].find(m=>typeof MediaRecorder!=="undefined"&&MediaRecorder.isTypeSupported(m));
    if(!mt){alert("Non supporté."); return;}
    const recorder=new MediaRecorder(stream,{mimeType:mt,videoBitsPerSecond:8_000_000});
    chunks.current=[];
    recorder.ondataavailable=e=>{if(e.data.size>0)chunks.current.push(e.data);};
    recorder.onstop=()=>{
      const ext=mt.includes("mp4")?"mp4":"webm";
      const blob=new Blob(chunks.current,{type:mt});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a"); a.href=url; a.download=`caractere-3d.${ext}`; a.click();
      setTimeout(()=>URL.revokeObjectURL(url),5000);
      setRec(false); setRecSec(0); if(timer.current)clearInterval(timer.current);
    };
    recRef.current=recorder; recorder.start(); setRec(true); setRecSec(0);
    timer.current=setInterval(()=>setRecSec(s=>{if(s+1>=MAX_REC){recorder.stop();return s+1;}return s+1;}),1000);
  },[rec]);

  useEffect(()=>()=>{if(timer.current)clearInterval(timer.current);},[]);
  const colorName=COLORS.find(c=>c.hex===color)?.name??"";
  const waUrl=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Bonjour Caractère Store 👋\nJe viens du Studio 3D. T-shirt ${colorName}${logoName?` avec logo (${logoName})`:""}.`)}`;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white text-[#0a1f2e]">
        <header className="flex items-center justify-between border-b border-gray-100 bg-white px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1a5f8a]">
              <span className="text-base font-black text-white">C</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Caractère</p>
              <p className="text-[10px] leading-tight text-[#0a1f2e]/50">Studio 3D</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#c9a84c]/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#c9a84c]">Bêta</span>
            <a href="/" className="text-xs text-[#0a1f2e]/40 hover:text-[#0a1f2e]">← Retour</a>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
          <div className="relative h-[56vh] min-h-[340px] flex-1 bg-gradient-to-br from-blue-50 to-blue-100 lg:h-[calc(100vh-57px)]">
            <Canvas shadows camera={{position:[0,0,2.5],fov:25}} gl={{preserveDrawingBuffer:true,antialias:false,powerPreference:"low-power"}}
              onCreated={({gl})=>{gl.setPixelRatio(Math.min(window.devicePixelRatio,2));glRef.current=gl;}}>
              <Scene bgColor={bgColor} color={color} anim={anim} />
            </Canvas>
            {rec&&<div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500"/><span className="text-xs font-semibold tabular-nums text-white">{recSec}s/{MAX_REC}s</span>
            </div>}
            {!logoTex&&<button onClick={()=>logoRef.current?.click()}
              className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#0a1f2e]/20 bg-white/80 px-5 py-2 text-xs font-medium text-[#0a1f2e] backdrop-blur hover:bg-white">
              + Ajouter votre logo
            </button>}
          </div>

          <aside className="w-full border-t border-gray-100 bg-[#f8fafc] p-5 lg:w-[310px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:[height:calc(100vh-57px)]">

            <section>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Couleur</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c=><button key={c.hex} title={c.name} onClick={()=>setColor(c.hex)}
                  className={`h-8 w-8 rounded-full border-2 transition ${color===c.hex?"border-[#1a5f8a] scale-110 shadow-lg":"border-gray-300 hover:border-[#1a5f8a]/40"}`}
                  style={{backgroundColor:c.hex}}/>)}
              </div>
              <p className="mt-1.5 text-xs text-[#0a1f2e]/50">{colorName}</p>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Arrière-plan</p>
              <div className="flex flex-wrap gap-2">
                {BGS.map(b=><button key={b.name} title={b.name} onClick={()=>{setBgColor(b.color);setBgName(b.name);}}
                  className={`h-8 w-8 rounded-lg border-2 transition ${bgName===b.name?"border-[#1a5f8a] scale-110":"border-gray-300 hover:border-[#1a5f8a]/40"}`}
                  style={{backgroundColor:b.color}}/>)}
              </div>
              <p className="mt-1.5 text-xs text-[#0a1f2e]/50">{bgName}</p>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Design</p>
              <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadLogo} className="hidden"/>
              <button onClick={()=>logoRef.current?.click()}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 text-sm text-[#0a1f2e]/50 transition hover:border-[#1a5f8a]/40 hover:text-[#0a1f2e]">
                {logoName?`✓ ${logoName}`:"Importer un logo (PNG)"}
              </button>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Animation</p>
              <div className="grid grid-cols-2 gap-2">
                {ANIMS.map(a=><button key={a.id} onClick={()=>setAnim(a.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${anim===a.id?"border-[#1a5f8a] bg-blue-50 text-[#1a5f8a]":"border-gray-200 bg-white text-[#0a1f2e]/50 hover:border-[#1a5f8a]/40"}`}>
                  <span>{a.icon}</span><span>{a.label}</span>
                </button>)}
              </div>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Exporter</p>
              <div className="space-y-2">
                <button onClick={dlPNG} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-medium text-[#0a1f2e]/60 transition hover:bg-gray-50">
                  📷 Télécharger PNG
                </button>
                {!rec
                  ?<button onClick={startRec} className="w-full rounded-xl border border-gray-200 bg-white py-2.5 text-xs font-medium text-[#0a1f2e]/60 transition hover:border-red-400/40 hover:text-red-600">
                    ● Enregistrer vidéo (max {MAX_REC}s)
                  </button>
                  :<button onClick={stopRec} className="w-full rounded-xl border border-red-300 bg-red-50 py-2.5 text-xs font-semibold text-red-600">
                    ■ Arrêter — {recSec}s / {MAX_REC}s
                  </button>}
              </div>
            </section>

            <section className="mt-6 space-y-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full rounded-xl bg-[#1a5f8a] py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#0f3d5c]">
                Commander ce design →
              </a>
              <p className="text-center text-[10px] text-[#0a1f2e]/20">DTF & broderie · Caractère Store · Alger</p>
            </section>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
