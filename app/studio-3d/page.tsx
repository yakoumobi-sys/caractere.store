import type { Metadata } from "next";
import Studio3D from "@/components/studio3d/Studio3D";

export const metadata: Metadata = {
  title: "Studio 3D — Aperçu de votre vêtement personnalisé",
  description:
    "Visualisez votre visuel sur un vêtement en trois dimensions avant de commander. Impression DTF et broderie, atelier à Alger.",
  alternates: { canonical: "/studio-3d" },
};

export default function Page() {
  return (
    <>
      {/* Le rendu 3D n'expose aucun texte : sans ce titre, la page n'a ni
          H1 ni sujet annoncé. Hors écran pour ne pas gêner le canvas. */}
      <h1 className="sr-only">Studio 3D — aperçu de votre vêtement personnalisé</h1>
      <Studio3D />
    </>
  );
}
