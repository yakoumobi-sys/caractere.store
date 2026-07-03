// components/studio3d/Studio3DClient.tsx
"use client";

import dynamic from "next/dynamic";

const Studio3D = dynamic(() => import("./Studio3D"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0d]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#26262b] border-t-[#d4a94e]" />
        <p className="text-sm text-[#8b8b93]">Chargement du studio 3D…</p>
      </div>
    </div>
  ),
});

export default function Studio3DClient() {
  return <Studio3D />;
}
