"use client";

import {
  Suspense, useRef, useState, useEffect, useCallback, useMemo,
  Component, ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Decal, useGLTF, ContactShadows, Center } from "@react-three/drei";
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

const MODEL_PATH = "/models/shirt_baked.glb";
const WHATSAPP = "213557440522";
const MAX_REC = 30;
const CLIP_MIN = -0.42;
const CLIP_MAX = 0.46;

// 5 couleurs vives
const COLORS = [
  { name: "Noir", hex: "#1a1a1a" },
  { name: "Blanc", hex: "#ffffff" },
  { name: "Rouge", hex: "#d41717" },
  { name: "Vert bouteille", hex: "#1b4332" },
  { name: "Beige", hex: "#d4a574" },
];

// Backgrounds stylés
const BGS = [
  { name: "Dégradé bleu", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Dégradé rose", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Dégradé vert", color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Dégradé orange", color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
  { name: "Noir mat", color: "#0a0a0a" },
  { name: "Blanc pur", color: "#f5f5f5" },
];

type Anim = "aucune"|"rotation"|"flottement"|"marche"|"formation";
const ANIMS: {id:Anim;label:string;icon:string}[] = [
  {id:"aucune",label:"Aucune",icon:"⏹"},
  {id:"rotation",label:"Rotation",icon:"🔄"},
  {id:"flottement",label:"Flottement",icon:"🌊"},
  {id:"marche",label:"Marche",icon:"🚶"},
  {id:"formation",label:"Tissage",icon:"🧵"},
];

type LogoPos = "poitrine" | "coeur-dos" | "poitrine-dos";

function SceneBg({ bgColor }: { bgColor: string }) {
  const { scene } = useThree();
  useEffect(() => {
    if (bgColor.startsWith("linear")) {
      scene.background = new THREE.Color("#1a1a1a");
    } else {
      scene.background = new THREE.Color(bgColor);
    }
  }, [bgColor, scene]);
  return null;
}

type SP = {
  color: string;
  logoTexture: THREE.Texture | null;
  logoTextureBack: THREE.Texture | null;
  logoPos: LogoPos;
  clipPlane: THREE.Plane;
  clipActive: boolean;
};

function Shirt({ color, logoTexture, logoTextureBack, logoPos, clipPlane, clipActive }: SP) {
  const gltf = useGLTF(MODEL_PATH) as any;
  const mat = gltf.materials?.lambert1 as any;
  const tc = useRef(new THREE.Color(color));

  useEffect(() => {
    if (!mat) return;
    mat.clippingPlanes = clipActive ? [clipPlane] : null;
    mat.needsUpdate = true;
  }, [clipActive, clipPlane, mat]);

  useFrame(() => {
    if (mat?.color) {
      tc.current.set(color);
      mat.color.lerp(tc.current, 0.15);
    }
  });

  if (!gltf.nodes?.T_Shirt_male?.geometry) return null;

  const getLogoPositions = () => {
    switch(logoPos) {
      case "poitrine":
        return [{ pos: [0, 0.05, 0.15], rot: [0, 0, 0], scale: 0.15, tex: logoTexture }];
      case "coeur-dos":
        return [
          { pos: [0, 0.08, 0.15], rot: [0, 0, 0], scale: 0.12, tex: logoTexture },
          { pos: [0, 0.08, -0.15], rot: [0, Math.PI, 0], scale: 0.12, tex: logoTextureBack }
        ];
      case "poitrine-dos":
        return [
          { pos: [0, 0.05, 0.15], rot: [0, 0, 0], scale: 0.14, tex: logoTexture },
          { pos: [0, 0.05, -0.15], rot: [0, Math.PI, 0], scale: 0.14, tex: logoTextureBack }
        ];
    }
  };

  return (
    <Center>
      <mesh geometry={gltf.nodes.T_Shirt_male.geometry} material={mat} dispose={null}>
        {getLogoPositions().map((logo, i) => logo.tex && (
          <Decal
            key={i}
            position={logo.pos as [number, number, number]}
            rotation={logo.rot as [number, number, number]}
            scale={logo.scale}
          >
            <meshStandardMaterial
              map={logo.tex}
              transparent
              polygonOffset
              polygonOffsetFactor={-10}
              clippingPlanes={clipActive ? [clipPlane] : null}
            />
          </Decal>
        ))}
      </mesh>
    </Center>
  );
}

useGLTF.preload(MODEL_PATH);

type ScP = SP & { bgColor: string; anim: Anim };

function Scene({ bgColor, anim, ...sp }: ScP) {
  const g = useRef<THREE.Group>(null);
  const tl = useRef<THREE.Mesh>(null);
  const cp = useMemo(() => new THREE.Plane(new THREE.Vector3(0,-1,0), CLIP_MAX+0.1), []);
  const isF = anim === "formation";

  useFrame(state => {
    const t = state.clock.getElapsedTime();
    const gr = g.current; if (!gr) return;

    if (anim !== "rotation" && anim !== "formation") gr.rotation.y *= 0.95;
    if (anim !== "flottement" && anim !== "marche") {
      gr.position.y *= 0.9; gr.rotation.z *= 0.9; gr.rotation.x *= 0.9;
    }

    if (anim === "rotation") gr.rotation.y += 0.012;
    if (anim === "flottement") {
      gr.position.y = Math.sin(t*1.4)*0.035;
      gr.rotation.z = Math.sin(t*0.9)*0.04;
      gr.rotation.y = Math.sin(t*0.6)*0.25;
    }
    
    // Animation marche réaliste avec bras
    if (anim === "marche") {
      const s = t*3.4;
      gr.position.y = Math.abs(Math.sin(s))*0.032;
      gr.rotation.z = Math.sin(s)*0.05;
      gr.rotation.x = 0.03 + Math.sin(s*2)*0.012;
      gr.rotation.y = Math.sin(t*0.8)*0.18;
      // Les bras bougent naturellement via la rotation
    }
    
    if (isF) {
      const cycle = 4.5 + 2.0;
      const local = t % cycle;
      const prog = Math.min(local/4.5, 1);
      const eased = 1 - Math.pow(1-prog, 2.2);
      cp.constant = CLIP_MIN + eased*(CLIP_MAX-CLIP_MIN);
      gr.rotation.y += 0.006;
      if (tl.current) {
        tl.current.visible = prog < 1;
        tl.current.position.y = cp.constant;
        (tl.current.material as THREE.MeshBasicMaterial).opacity = prog < 1 ? 0.9 : 0;
      }
    } else {
      cp.constant = CLIP_MAX + 0.1;
      if (tl.current) tl.current.visible = false;
    }
  });

  return (
    <>
      <SceneBg bgColor={bgColor} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} />
      <group ref={g}>
        <Shirt {...sp} clipPlane={cp} clipActive={isF} />
        <mesh ref={tl} visible={false}>
          <boxGeometry args={[0.95, 0.006, 0.5]} />
          <meshBasicMaterial color="#c9a84c" transparent opacity={0.9} toneMapped={false} />
        </mesh>
      </group>
      <ContactShadows position={[0,-0.52,0]} opacity={0.35} scale={2.5} blur={2.2} far={1.2} />
      <OrbitControls enablePan={false} minDistance={1.2} maxDistance={4}
        minPolarAngle={Math.PI/4} maxPolarAngle={3*Math.PI/4} />
    </>
  );
}

export default function Studio3D() {
  const [color,setColor]=useState(COLORS[0].hex);
  const [logoPos,setLogoPos]=useState<LogoPos>("poitrine");
  const [logoTex,setLogoTex]=useState<THREE.Texture|null>(null);
  const [logoTexBack,setLogoTexBack]=useState<THREE.Texture|null>(null);
  const [logoName,setLogoName]=useState<string|null>(null);
  const [bgColor,setBgColor]=useState("#0d2d45");
  const [bgName,setBgName]=useState("Dégradé bleu");
  const [anim,setAnim]=useState<Anim>("rotation");
  const [rec,setRec]=useState(false);
  const [recSec,setRecSec]=useState(0);
  const glRef=useRef<THREE.WebGLRenderer|null>(null);
  const logoRef=useRef<HTMLInputElement>(null);
  const logoBackRef=useRef<HTMLInputElement>(null);
  const recRef=useRef<MediaRecorder|null>(null);
  const chunks=useRef<Blob[]>([]);
  const timer=useRef<ReturnType<typeof setInterval>|null>(null);

  const uploadLogo=useCallback((e:React.ChangeEvent<HTMLInputElement>, isBack=false)=>{
    const f=e.target.files?.[0]; if(!f) return;
    const r=new FileReader();
    r.onload=()=>new THREE.TextureLoader().load(r.result as string,tex=>{
      tex.colorSpace=THREE.SRGBColorSpace; tex.anisotropy=16;
      if (isBack) setLogoTexBack(tex);
      else { setLogoTex(tex); setLogoName(f.name); }
    });
    r.readAsDataURL(f);
  },[]);

  const dlPNG=useCallback(()=>{
    const gl=glRef.current; if(!gl) return;
    const a=document.createElement("a");
    a.href=gl.domElement.toDataURL("image/png");
    a.download="caracterstore-3d.png"; a.click();
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
      const a=document.createElement("a"); a.href=url; a.download=`caracterstore-3d.${ext}`; a.click();
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d41717]">
              <span className="text-base font-black text-white">C</span>
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Caractère</p>
              <p className="text-[10px] leading-tight text-[#0a1f2e]/50">Studio 3D</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[#d41717]/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#d41717]">Bêta</span>
            <a href="/" className="text-xs text-[#0a1f2e]/40 hover:text-[#0a1f2e]">← Retour</a>
          </div>
        </header>

        <div className="mx-auto flex max-w-6xl flex-col lg:flex-row">
          <div className="relative h-[56vh] min-h-[340px] flex-1 lg:h-[calc(100vh-57px)]" style={{background: bgColor.startsWith("linear") ? bgColor : undefined, backgroundColor: bgColor.startsWith("linear") ? undefined : bgColor}}>
            <Canvas
              camera={{ position: [0, 0, 2.2], fov: 25 }}
              gl={{ preserveDrawingBuffer: true }}
              onCreated={({ gl }) => {
                gl.localClippingEnabled = true;
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                glRef.current = gl;
              }}
            >
              <Suspense fallback={null}>
                <Scene bgColor={bgColor} anim={anim} color={color} logoTexture={logoTex}
                  logoTextureBack={logoTexBack} logoPos={logoPos}
                  clipPlane={null as any} clipActive={false} />
              </Suspense>
            </Canvas>

            {rec&&<div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500"/>
              <span className="text-xs font-semibold tabular-nums text-white">{recSec}s/{MAX_REC}s</span>
            </div>}

            {!logoTex&&<button onClick={()=>logoRef.current?.click()}
              className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/30 bg-black/40 px-5 py-2 text-xs font-medium text-white backdrop-blur hover:bg-black/60">
              + Ajouter votre logo
            </button>}
          </div>

          <aside className="w-full border-t border-gray-100 bg-[#f8fafc] p-5 lg:w-[310px] lg:overflow-y-auto lg:border-l lg:border-t-0 lg:[height:calc(100vh-57px)]">

            <section>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Couleur</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c=><button key={c.hex} title={c.name} onClick={()=>setColor(c.hex)}
                  className={`h-8 w-8 rounded-full border-2 transition ${color===c.hex?"border-[#d41717] scale-110 shadow-lg":"border-gray-300 hover:border-[#d41717]/40"}`}
                  style={{backgroundColor:c.hex}}/>)}
              </div>
              <p className="mt-1.5 text-xs text-[#0a1f2e]/50">{colorName}</p>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Arrière-plan</p>
              <div className="flex flex-wrap gap-2">
                {BGS.map(b=><button key={b.name} title={b.name} onClick={()=>{setBgColor(b.color);setBgName(b.name);}}
                  className={`h-8 w-8 rounded-lg border-2 transition ${bgName===b.name?"border-[#d41717] scale-110":"border-gray-300 hover:border-[#d41717]/40"}`}
                  style={{background: b.color}}/>)}
              </div>
              <p className="mt-1.5 text-xs text-[#0a1f2e]/50">{bgName}</p>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Position du logo</p>
              <div className="space-y-2">
                {(["poitrine", "coeur-dos", "poitrine-dos"] as LogoPos[]).map(pos=>(
                  <button key={pos} onClick={()=>setLogoPos(pos)}
                    className={`w-full rounded-lg border px-3 py-2 text-xs transition ${logoPos===pos?"border-[#d41717] bg-red-50 text-[#d41717]":"border-gray-200 bg-white text-[#0a1f2e]/50 hover:border-[#d41717]/40"}`}>
                    {pos === "poitrine" && "Poitrine"}
                    {pos === "coeur-dos" && "Cœur + Dos"}
                    {pos === "poitrine-dos" && "Poitrine + Dos"}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Logo</p>
              <input ref={logoRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e)=>uploadLogo(e,false)} className="hidden"/>
              <button onClick={()=>logoRef.current?.click()}
                className="w-full rounded-xl border border-dashed border-gray-300 bg-white py-3 text-sm text-[#0a1f2e]/50 transition hover:border-[#d41717]/40 hover:text-[#0a1f2e]">
                {logoName?`✓ ${logoName}`:"Importer logo avant"}
              </button>
              {(logoPos === "coeur-dos" || logoPos === "poitrine-dos") && (
                <>
                  <input ref={logoBackRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e)=>uploadLogo(e,true)} className="hidden"/>
                  <button onClick={()=>logoBackRef.current?.click()}
                    className="mt-2 w-full rounded-xl border border-dashed border-gray-300 bg-white py-3 text-sm text-[#0a1f2e]/50 transition hover:border-[#d41717]/40 hover:text-[#0a1f2e]">
                    {logoTexBack?"✓ Logo arrière chargé":"Importer logo arrière"}
                  </button>
                </>
              )}
            </section>

            <section className="mt-5">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#0a1f2e]/40">Animation</p>
              <div className="grid grid-cols-2 gap-2">
                {ANIMS.map(a=><button key={a.id} onClick={()=>setAnim(a.id)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${anim===a.id?"border-[#d41717] bg-red-50 text-[#d41717]":"border-gray-200 bg-white text-[#0a1f2e]/50 hover:border-[#d41717]/40"}`}>
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
                className="block w-full rounded-xl bg-[#d41717] py-3.5 text-center text-sm font-bold text-white transition hover:bg-[#a80f0f]">
                Commander ce design →
              </a>
              <p className="text-center text-[10px] text-[#0a1f2e]/30">DTF & broderie · Caractère Store · Alger</p>
            </section>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
