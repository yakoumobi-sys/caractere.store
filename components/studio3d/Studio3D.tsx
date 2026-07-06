"use client";

import { Suspense } from "react";
import Studio3DContent from "./Studio3DContent";

export default function Studio3D() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-white"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#d41717]" /></div>}>
      <Studio3DContent />
    </Suspense>
  );
}
