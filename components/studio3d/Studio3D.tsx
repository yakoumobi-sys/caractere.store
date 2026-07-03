// components/studio3d/Studio3D.tsx
"use client";

import { Suspense, useRef, useState, Component, ErrorInfo, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

// ── Error Boundary pour afficher l'erreur exacte
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: string | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error: `${error.message}\n\n${info.componentStack}` });
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-black p-6 text-white">
          <h1 className="mb-4 text-lg font-bold text-red-400">Erreur détectée</h1>
          <pre className="overflow-auto rounded bg-gray-900 p-4 text-xs text-red-300">
            {this.state.error}
          </pre>
          <p className="mt-4 text-sm text-gray-400">
            Fais une capture d'écran et envoie-la à Claude pour qu'il corrige.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

const MODEL_PATH = "/models/shirt_baked.glb";

function Shirt({ color }: { color: number }) {
  const gltf = useGLTF(MODEL_PATH) as any;
  const mat = gltf.materials?.lambert1 as THREE.MeshStandardMaterial | undefined;

  useFrame(() => {
    if (mat) mat.color.setHex(color);
  });

  if (!gltf.nodes?.T_Shirt_male?.geometry) {
    return null;
  }

  return (
    <Center>
      <mesh
        geometry={gltf.nodes.T_Shirt_male.geometry}
        material={mat}
      />
    </Center>
  );
}

useGLTF.preload(MODEL_PATH);

function Scene({ color }: { color: number }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.01;
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
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0b0b0d]">
        <header className="border-b border-[#1e1e22] px-5 py-4 text-white">
          <h1 className="text-lg font-semibold">Studio 3D — Test</h1>
        </header>

        <div className="flex flex-col lg:flex-row">
          <div className="h-[60vh] flex-1 lg:h-[calc(100vh-65px)]">
            <Canvas
              camera={{ position: [0, 0, 2.2], fov: 25 }}
              onCreated={({ gl }) => {
                gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              }}
            >
              <Suspense fallback={null}>
                <Scene color={color} />
              </Suspense>
            </Canvas>
          </div>

          <aside className="w-full border-t border-[#1e1e22] bg-[#101013] p-5 text-white lg:w-64 lg:border-l lg:border-t-0">
            <h2 className="mb-3 text-sm font-semibold">Couleur</h2>
            <input
              type="color"
              value={`#${color.toString(16).padStart(6, "0")}`}
              onChange={(e) =>
                setColor(parseInt(e.target.value.slice(1), 16))
              }
              className="h-12 w-full rounded"
            />
            <p className="mt-4 text-xs text-gray-400">
              Si tu vois une erreur rouge → fais une capture et envoie à Claude.
            </p>
          </aside>
        </div>
      </div>
    </ErrorBoundary>
  );
}
