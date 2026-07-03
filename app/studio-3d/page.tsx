// app/studio-3d/page.tsx
import type { Metadata } from "next";
import Studio3DClient from "@/components/studio3d/Studio3DClient";

export const metadata: Metadata = {
  title: "Studio 3D — Caractère Store",
  description:
    "Visualisez votre logo sur un t-shirt en 3D temps réel. Changez la couleur, positionnez votre design et commandez directement.",
};

export default function Studio3DPage() {
  return <Studio3DClient />;
}
