"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";

const COLORS = [
  { name: "Noir", hex: "#1a1a1a" },
  { name: "Blanc", hex: "#ffffff" },
  { name: "Rouge", hex: "#d41717" },
  { name: "Vert bouteille", hex: "#1b4332" },
  { name: "Beige", hex: "#d4a574" },
];

type LogoPos = "poitrine" | "coeur-dos" | "poitrine-dos";

export default function Designer() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState(COLORS[0].hex);
  const [logoPos, setLogoPos] = useState<LogoPos>("poitrine");
  const [logoTexture, setLogoTexture] = useState<string | null>(null);
  const [logoTextureBack, setLogoTextureBack] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const logoBackRef = useRef<HTMLInputElement>(null);

  // Dessiner le t-shirt avec logo
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fond
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // T-shirt simple (formes géométriques)
    ctx.fillStyle = color;
    // Corps
    ctx.fillRect(100, 80, 200, 250);
    // Manches
    ctx.fillRect(30, 90, 70, 120);
    ctx.fillRect(300, 90, 70, 120);
    // Col
    ctx.beginPath();
    ctx.arc(200, 80, 30, 0, Math.PI, true);
    ctx.fill();

    // Ajouter des ombres subtiles
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(100, 80, 200, 250);

    // Afficher le logo s'il existe
    if (logoTexture) {
      const logoImg = new Image();
      logoImg.onload = () => {
        if (logoPos === "poitrine" || logoPos === "poitrine-dos") {
          ctx.drawImage(logoImg, 150, 150, 100, 100);
        }
        if (logoPos === "coeur-dos" || logoPos === "poitrine-dos") {
          ctx.drawImage(logoImg, 150, 120, 80, 80);
        }
      };
      logoImg.src = logoTexture;
    }

    // Texte informatif
    ctx.fillStyle = "#666";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(COLORS.find(c => c.hex === color)?.name || "Couleur", 200, 350);
  }, [color, logoTexture, logoPos]);

  const uploadLogo = (e: React.ChangeEvent<HTMLInputElement>, isBack = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (isBack) setLogoTextureBack(reader.result as string);
      else {
        setLogoTexture(reader.result as string);
        setLogoName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const goToStudio3D = () => {
    const designData = {
      color,
      logoPos,
      logoTexture,
      logoTextureBack,
      logoName,
    };
    localStorage.setItem("designData", JSON.stringify(designData));
    router.push("/studio-3d");
  };

  return (
    <div className="min-h-screen bg-white text-[#0a1f2e]">
      <header className="border-b border-gray-100 bg-white px-5 py-3">
        <p className="text-sm font-bold">Caractère — Designer</p>
      </header>

      <div className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-8 p-8">
        {/* Preview */}
        <div className="flex-1">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="w-full border border-gray-200 rounded-lg bg-gray-50"
          />
        </div>

        {/* Contrôles */}
        <div className="flex-1 space-y-6">
          {/* Couleur */}
          <section>
            <p className="mb-3 text-sm font-bold uppercase text-[#0a1f2e]/40">Couleur</p>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`h-10 w-10 rounded-full border-2 transition ${
                    color === c.hex ? "border-[#d41717] scale-110 shadow-lg" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-[#0a1f2e]/50">
              {COLORS.find(c => c.hex === color)?.name}
            </p>
          </section>

          {/* Position logo */}
          <section>
            <p className="mb-3 text-sm font-bold uppercase text-[#0a1f2e]/40">Position logo</p>
            <div className="space-y-2">
              {(["poitrine", "coeur-dos", "poitrine-dos"] as LogoPos[]).map(pos => (
                <button
                  key={pos}
                  onClick={() => setLogoPos(pos)}
                  className={`w-full rounded-lg border px-3 py-2 text-xs transition ${
                    logoPos === pos
                      ? "border-[#d41717] bg-red-50 text-[#d41717]"
                      : "border-gray-200 bg-white text-[#0a1f2e]/50"
                  }`}
                >
                  {pos === "poitrine" && "Poitrine"}
                  {pos === "coeur-dos" && "Cœur + Dos"}
                  {pos === "poitrine-dos" && "Poitrine + Dos"}
                </button>
              ))}
            </div>
          </section>

          {/* Logo */}
          <section>
            <p className="mb-3 text-sm font-bold uppercase text-[#0a1f2e]/40">Logo</p>
            <input
              ref={logoRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={e => uploadLogo(e, false)}
              className="hidden"
            />
            <button
              onClick={() => logoRef.current?.click()}
              className="w-full rounded-xl border border-dashed border-gray-300 bg-white py-3 text-sm text-[#0a1f2e]/50 transition hover:border-[#d41717]/40"
            >
              {logoName ? `✓ ${logoName}` : "Importer logo avant"}
            </button>

            {(logoPos === "coeur-dos" || logoPos === "poitrine-dos") && (
              <>
                <input
                  ref={logoBackRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={e => uploadLogo(e, true)}
                  className="hidden"
                />
                <button
                  onClick={() => logoBackRef.current?.click()}
                  className="mt-2 w-full rounded-xl border border-dashed border-gray-300 bg-white py-3 text-sm text-[#0a1f2e]/50 transition hover:border-[#d41717]/40"
                >
                  {logoTextureBack ? "✓ Logo arrière" : "Importer logo arrière"}
                </button>
              </>
            )}
          </section>

          {/* CTA */}
          <button
            onClick={goToStudio3D}
            className="w-full rounded-xl bg-[#d41717] py-3 text-sm font-bold text-white transition hover:bg-[#a80f0f]"
          >
            Aller au Studio 3D →
          </button>
        </div>
      </div>
    </div>
  );
}
