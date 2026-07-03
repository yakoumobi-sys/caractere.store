// components/studio3d/Studio3D.tsx
"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

const MODEL_PATH = "/models/shirt_baked.glb";

function Shirt({ color }: { color: number }) {
  const gltf = useGLTF(MODEL_PATH) as any;
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && gltf.materials?.lambert1) {
      const mat = gltf.materials.lambert1 as THREE.MeshPhongMaterial;
      mat.color.setHex(color);
    }
  });

  return (
    <Center>
      <mesh
        ref={meshRef}
        geometry={gltf.nodes.T_Shirt_male.geometry}
        material={gltf.materials.lambert1}
      />
    </Center>
  );
}

useGLTF.preload(MODEL_PATH);

function Scene({ color }: { color: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <group ref={groupRef}>
        <Shirt color={color} />
      </group>
      <OrbitControls />
    </>
  );
}

export default function Studio3D() {
  const [color, setColor] = useState(0x1c1c1e);

  return (
    <div className="min-h-screen bg-[#0b0b0d]">
      <header className="border-b border-[#1e1e22] px-5 py-4 text-white">
        <h1 className="text-lg font-semibold">Studio 3D — Test</h1>
        <p className="text-xs text-gray-400">Si tu vois le t-shirt tourner, ça marche !</p>
      </header>

      <div className="flex flex-col lg:flex-row">
        <div className="h-[60vh] flex-1 lg:h-[calc(100vh-73px)]">
          <Canvas camera={{ position: [0, 0, 2.2], fov: 25 }}>
            <Suspense fallback={null}>
              <Scene color={color} />
            </Suspense>
          </Canvas>
        </div>

        <aside className="w-full border-t border-[#1e1e22] bg-[#101013] p-5 text-white lg:w-64 lg:border-l lg:border-t-0">
          <h2 className="mb-4 text-sm font-semibold">Couleur</h2>
          <input
            type="color"
            value={`#${color.toString(16).padStart(6, "0")}`}
            onChange={(e) => setColor(parseInt(e.target.value.slice(1), 16))}
            className="h-12 w-full rounded"
          />
          <p className="mt-6 text-xs text-gray-400">Teste d'abord avec cette version minimale. Si ça marche, on rajoute les animations.</p>
        </aside>
      </div>
    </div>
  );
}
