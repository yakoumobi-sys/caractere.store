"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

const MODEL = "/models/shirt_tshirt.glb";

const COLORS = [
  { name: "Blanc", hex: "#FFFFFF" },
  { name: "Noir", hex: "#1A1A1A" },
  { name: "Rouge", hex: "#DC2626" },
  { name: "Marine", hex: "#1E3A5F" },
  { name: "Vert", hex: "#166534" },
];

function Shirt({ color }: { color: string }) {
  const { scene } = useGLTF(MODEL) as any;
  const tc = useRef(new THREE.Color(color));
  const g = useRef<THREE.Group>(null);

  useFrame(() => {
    tc.current.set(color);
    scene.traverse((o: any) => {
      if (o.isMesh && o.material?.color) o.material.color.lerp(tc.current, 0.12);
    });
    if (g.current) g.current.rotation.y += 0.006;
  });

  useEffect(() => {
    scene.traverse((o: any) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  }, [scene]);

  return (
    <group ref={g}>
      <Center><primitive object={scene} /></Center>
    </group>
  );
}

useGLTF.preload(MODEL);

export default function Studio3DPreview() {
  const [color, setColor] = useState("#FFFFFF");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#f8fafc]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Canvas 3D */}
          <div className="relative aspect-square rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0C4A6E] to-[#38BDF8]">
            {mounted && (
              <Canvas camera={{ position: [0, 0.5, 4], fov: 30 }} gl={{ antialias: true }} shadows>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.9} />
                  <directionalLight position={[3, 4, 5]} intensity={1.3} castShadow />
                  <directionalLight position={[-4, 2, -3]} intensity={0.5} />
                  <Shirt color={color} />
                  <ContactShadows position={[0, -1, 0]} opacity={0.3} scale={4} blur={2.4} far={2} />
                </Suspense>
              </Canvas>
            )}
            <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur px-3 py-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0C4A6E]">Studio 3D</span>
            </div>
          </div>

          {/* Texte + CTA */}
          <div>
            <p className="text-[11px] font-bold tracking-widest uppercase text-brand-gray mb-2">Nouveau</p>
            <h2 className="text-[28px] md:text-[40px] font-bold tracking-tight text-brand-dark leading-tight mb-4">
              Visualisez votre design<br />en 3D, en temps réel.
            </h2>
            <p className="text-[15px] text-brand-gray leading-relaxed mb-6">
              Choisissez votre produit, votre couleur, ajoutez votre logo — et voyez le résultat tourner sous tous les angles avant de commander.
            </p>

            <div className="mb-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-gray mb-3">Essayez une couleur</p>
              <div className="flex gap-2.5">
                {COLORS.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${color === c.hex ? "border-brand-dark scale-110 shadow-md" : "border-black/15 hover:scale-105"}`}
                    style={{ backgroundColor: c.hex, boxShadow: c.hex === "#FFFFFF" ? "inset 0 0 0 1px #ddd" : undefined }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/studio-3d" className="flex-1 text-center bg-[#0C4A6E] hover:bg-[#083550] text-white px-7 py-3.5 rounded-full text-[15px] font-bold transition-colors">
                Ouvrir le Studio 3D →
              </a>
              <a href="/designer" className="flex-1 text-center border-2 border-black/12 hover:border-brand-dark text-brand-dark px-7 py-3.5 rounded-full text-[15px] font-medium transition-colors">
                Aller au Designer
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
