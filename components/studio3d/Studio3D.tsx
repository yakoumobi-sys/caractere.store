"use client";

import { Suspense } from "react";
import Studio3DContent from "./Studio3DContent";

export default function Studio3D() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Chargement...</div>}>
      <Studio3DContent />
    </Suspense>
  );
}
