// app/produits/page.tsx
// Page produits mycaractere.xyz — données extraites de caracterestore.com (Shopify)

"use client";

import { useState } from "react";
import Image from "next/image";

// ── DONNÉES SHOPIFY EXTRAITES ─────────────────────────────────
const PRODUITS = [
  // ── STREETWEAR ──
  {
    id: "black-regular-tee",
    nom: "BLACK REGULAR TEE 210GSM",
    prix: 1000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/CFE2A2DA-BA00-4B18-B6F9-9975D4FBC581.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Noir"],
    description: "T-shirt coton premium 210gsm. Coupe Regular.",
  },
  {
    id: "white-regular-tee",
    nom: "WHITE REGULAR TEE 250GSM",
    prix: 1000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/4FC9A90A-56B6-4321-861C-8A25489163D6.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Blanc"],
    description: "T-shirt coton premium 250gsm. Coupe Regular.",
  },
  {
    id: "white-oversized-tee",
    nom: "WHITE OVERSIZED TEE 250GSM",
    prix: 1300,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/76CA8FA6-887F-4184-A691-1A188FF315A9.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Blanc"],
    description: "T-shirt oversized coton épais 250gsm.",
  },
  {
    id: "black-oversized-tee",
    nom: "BLACK OVERSIZED TEE 250GSM",
    prix: 1300,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D8BCF35-BF82-47A6-9A20-1E64D94EABEE.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Noir"],
    description: "T-shirt oversized coton épais 250gsm.",
  },
  {
    id: "short-caractere",
    nom: "SHORT CARACTERE",
    prix: 1200,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-8887.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Blanc","Noir","Gris","Rose","Marine"],
    description: "Short premium. Coupe moderne, tissu respirant.",
  },
  {
    id: "baggy-jogger",
    nom: "BAGGY JOGGER",
    prix: 1500,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/D0319F16-6189-4EC1-8F32-A0C9EF3BA832.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    couleurs: ["Noir","Gris"],
    description: "Jogger baggy confort ultime. Coupe ample.",
  },
  {
    id: "oversized-jogger",
    nom: "OVERSIZED JOGGER",
    prix: 1500,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/7027F65B-78FA-4D0E-8B0D-0C50240AACA0.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    couleurs: ["Noir","Gris","Blanc"],
    description: "Jogger surdimensionné tissu doux et extensible.",
  },
  {
    id: "premium-baggy-joggers",
    nom: "PREMIUM BAGGY JOGGERS",
    prix: 2000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/B08118E1-A004-4F3A-B2E3-676CE6E75870.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    couleurs: ["Disponible"],
    description: "Baggy jogger premium.",
  },
  {
    id: "hoodie-medium",
    nom: "HOODIE MEDIUM",
    prix: 1500,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/7668ABF0-890B-48D4-A05D-22D3E8090A7A.jpg",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    couleurs: ["Noir","Gris"],
    description: "Hoodie polyvalent et confortable. Capuche et manches longues.",
  },
  {
    id: "premium-hoodie",
    nom: "PREMIUM HOODIE",
    prix: 2000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/0D2EF14B-6EF7-4CCF-AFAF-0A7B02A3B304.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Noir","Blanc","Rouge","Marine","Bleu"],
    description: "Sweat-shirt premium confort incomparable.",
  },
  {
    id: "hoodie-premium-500gsm",
    nom: "HOODIE PREMIUM 500GSM",
    prix: 2500,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/058ECD43-1772-45BA-AE92-6DAF6F6CCCB2.jpg",
    categorie: "Streetwear",
    tailles: ["Disponible"],
    couleurs: ["Disponible"],
    description: "Le hoodie ultime 500gsm. Tissu lourd, coupe parfaite.",
    badge: "Premium",
  },
  {
    id: "zipper-hoodie",
    nom: "ZIPPER HOODIE",
    prix: 1800,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/610D63C2-C065-4AEE-9444-6E9929D307D1.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Blanc","Noir","Gris"],
    description: "Sweat à capuche zippé. Design pratique et élégant.",
  },
  {
    id: "pull-caractere",
    nom: "PULL CARACTERE",
    prix: 1500,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-1210.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Blanc","Noir","Gris"],
    description: "Pull incontournable. Tissu doux, idéal saison froide.",
  },
  {
    id: "veste-ninja",
    nom: "VESTE NINJA CARACTERE",
    prix: 2400,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-1535.webp",
    categorie: "Streetwear",
    tailles: ["Disponible"],
    couleurs: ["Disponible"],
    description: "Veste technique au style unique. Coupe ninja ajustée.",
    badge: "Nouveau",
  },
  {
    id: "chrome-one",
    nom: "CHROME ONE",
    prix: 4900,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/1621F031-176E-4755-B2A4-A7585A2F9031.png",
    categorie: "Streetwear",
    tailles: ["S","M","L","XL"],
    couleurs: ["Gris","Noir"],
    description: "Tissu bouclette (serbita). Pièce signature.",
    badge: "Exclusif",
  },

  // ── ENSEMBLES ──
  {
    id: "ensemble-blanc",
    nom: "ENSEMBLE BLANC (HOODIE + JOGGER)",
    prix: 3000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/8FA331B2-CB03-421D-B7A6-C71A77EB48A3.jpg",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Blanc"],
    description: "Ensemble hoodie + jogger assorti.",
  },
  {
    id: "ensemble-noir",
    nom: "ENSEMBLE HOODIE + JOGGER – NOIR",
    prix: 3000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/DC846844-3B4B-4123-BF75-707B645CCF84.png",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Noir"],
    description: "Ensemble hoodie + jogger noir.",
  },
  {
    id: "ensemble-gris",
    nom: "ENSEMBLE HOODIE + JOGGER – GRIS",
    prix: 3000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/A221C04C-1598-4ACD-BD22-51B4D9351944.png",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Gris"],
    description: "Ensemble hoodie + jogger gris.",
  },
  {
    id: "ensemble-zipper-baggy",
    nom: "ENSEMBLE ZIPPER + BAGGY",
    prix: 4000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/1C56C89E-1127-4FA1-8A27-7AF7C757619C.jpg",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Disponible"],
    description: "Ensemble veste zippée + pantalon ample.",
  },
  {
    id: "ensemble-veste-baggy",
    nom: "VESTE + BAGGY ELASTIQUE",
    prix: 5000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/38B475A2-3673-4DFD-9980-EBF27E2FE871.jpg",
    categorie: "Ensembles",
    tailles: ["Disponible"],
    couleurs: ["Disponible"],
    description: "Ensemble veste + baggy élastique.",
  },
  {
    id: "ensemble-3-pieces",
    nom: "ENSEMBLE 3 PIÈCES",
    prix: 6000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/BF32F9EB-46BA-42AD-AC98-D86BA988FB4A.png",
    categorie: "Ensembles",
    tailles: ["S","M","L","XL"],
    couleurs: ["Noir","Gris"],
    description: "Ensemble 3 pièces complet.",
    badge: "Premium",
  },

  // ── B2B / PERSONNALISATION ──
  {
    id: "polo-personnalise",
    nom: "POLO PERSONNALISÉ",
    prix: 0,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/506E8F49-8A75-4785-AA5C-B15E9BDD4667.webp",
    categorie: "B2B",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Gris","Noir","Blanc","Rouge","Bleu"],
    description: "Polo personnalisé DTF ou broderie pour entreprises.",
    badge: "Devis gratuit",
  },
  {
    id: "polo-pro",
    nom: "POLO CARACTERE",
    prix: 1400,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/30D38768-C5B4-475D-8387-B77C07BE3EC6.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Gris","Noir","Blanc","Rouge","Bleu"],
    description: "Polo demi-manche professionnel. Confort et élégance.",
  },
  {
    id: "tshirt-personnalise",
    nom: "T-SHIRTS PERSONNALISÉS",
    prix: 0,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D3096AD-C813-4B16-B8C8-AFE451835942.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Marine","Ciel","Bleu","Rouge","Blanc","Noir"],
    description: "T-shirts personnalisés +15 couleurs. DTF ou broderie.",
    badge: "Devis gratuit",
  },
  {
    id: "gilet-travail",
    nom: "GILET DE TRAVAIL",
    prix: 2000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/F096140F-DEDA-4418-81D7-B3C688C02B4F.jpg",
    categorie: "B2B",
    tailles: ["S","M","L","XL"],
    couleurs: ["Marine","Noir","Rouge","Beige"],
    description: "Gilet de travail sans manches. Liberté de mouvement.",
  },
  {
    id: "gilet-col-haut",
    nom: "GILET COL HAUT + POCHE",
    prix: 0,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/5717612A-4250-4225-B79E-72B0941C4DCA.jpg",
    categorie: "B2B",
    tailles: ["Disponible"],
    couleurs: ["Disponible"],
    description: "Gilet col haut multipoches. Fonctionnel et confortable.",
    badge: "Devis gratuit",
  },
  {
    id: "gilet-personnalise",
    nom: "GILET PERSONNALISÉ COL ROND",
    prix: 0,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/2ABA5114-8B2D-481B-800C-B24FA51CD855.webp",
    categorie: "B2B",
    tailles: ["S","M","L","XL","XXL"],
    couleurs: ["Disponible"],
    description: "Gilet col rond personnalisé. Simulation gratuite.",
    badge: "Devis gratuit",
  },
  {
    id: "tote-bag",
    nom: "TOTE BAG PERSONNALISÉ",
    prix: 0,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-3828.webp",
    categorie: "B2B",
    tailles: ["Unique"],
    couleurs: ["Noir","Beige","Blanc"],
    description: "Tote bag coton naturel + impression DTF. Devis gratuit.",
    badge: "Devis gratuit",
  },
  {
    id: "tablier",
    nom: "TABLIER DE CUISINE PERSONNALISÉ",
    prix: 0,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/IMG-3999.jpg",
    categorie: "B2B",
    tailles: ["Unique"],
    couleurs: ["Disponible"],
    description: "Tablier personnalisé durable. Idéal restauration.",
    badge: "Devis gratuit",
  },
  {
    id: "casquette",
    nom: "CASQUETTE PERSONNALISÉE",
    prix: 0,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/FFFDE421-D0F4-4B34-9096-BF52C840793D.webp",
    categorie: "B2B",
    tailles: ["Unique"],
    couleurs: ["Disponible"],
    description: "Casquette basique personnalisée broderie ou DTF.",
    badge: "Devis gratuit",
  },
  // Packs B2B
  {
    id: "pack-tshirt-b2b",
    nom: "T-SHIRT ENTREPRISE – PACK B2B",
    prix: 8000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/3D3096AD-C813-4B16-B8C8-AFE451835942.jpg",
    categorie: "B2B",
    tailles: ["S/M/L/XL"],
    couleurs: ["Blanc","Noir","Couleur sur demande"],
    description: "Pack 10 t-shirts entreprise personnalisés DTF.",
    badge: "Pack B2B",
  },
  {
    id: "pack-polo-b2b",
    nom: "POLO PROFESSIONNEL BRODÉ – PACK B2B",
    prix: 10000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/506E8F49-8A75-4785-AA5C-B15E9BDD4667.webp",
    categorie: "B2B",
    tailles: ["S/M/L/XL"],
    couleurs: ["Blanc","Noir","Marine","Couleur perso"],
    description: "Pack polo professionnel brodé pour entreprises.",
    badge: "Pack B2B",
  },
  {
    id: "pack-veste-b2b",
    nom: "VESTE DE TRAVAIL – PACK B2B",
    prix: 15000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/F096140F-DEDA-4418-81D7-B3C688C02B4F.jpg",
    categorie: "B2B",
    tailles: ["S/M/L/XL"],
    couleurs: ["Marine","Noir","Rouge","Couleur perso"],
    description: "Pack veste de travail personnalisée BTP/logistique.",
    badge: "Pack B2B",
  },
  {
    id: "pack-uniforme-complet",
    nom: "PACK UNIFORME COMPLET – CLÉ EN MAIN",
    prix: 20000,
    image: "https://cdn.shopify.com/s/files/1/0668/1418/1491/files/30D38768-C5B4-475D-8387-B77C07BE3EC6.jpg",
    categorie: "B2B",
    tailles: ["Sur mesure"],
    couleurs: ["Sur mesure"],
    description: "Solution clé en main. Polo+Pantalon, T-shirt+Veste, Hoodie+Jogger ou formule sur mesure.",
    badge: "Clé en main",
  },
];

const CATEGORIES = ["Tous", "Streetwear", "Ensembles", "B2B"];

const BADGE_COLORS: Record<string, string> = {
  "Premium": "bg-yellow-400 text-black",
  "Nouveau": "bg-blue-500 text-white",
  "Exclusif": "bg-purple-600 text-white",
  "Devis gratuit": "bg-green-600 text-white",
  "Pack B2B": "bg-sky-600 text-white",
  "Clé en main": "bg-orange-500 text-white",
};

function formatPrix(prix: number) {
  if (prix === 0) return "Devis gratuit";
  return `${prix.toLocaleString("fr-DZ")} DA`;
}

function CarteProduct({ p }: { p: typeof PRODUITS[0] }) {
  return (
    <a
      href={`https://wa.me/213557440522?text=Bonjour, je suis intéressé(e) par le produit : ${encodeURIComponent(p.nom)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl overflow-hidden border border-[#e5e5ea] hover:border-[#0a0a0a] hover:shadow-lg transition-all duration-200 bg-white"
    >
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-[#f2f2f7]">
        <img
          src={p.image}
          alt={p.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {p.badge && (
          <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-700 ${BADGE_COLORS[p.badge] ?? "bg-black text-white"}`}>
            {p.badge}
          </span>
        )}
      </div>

      {/* INFOS */}
      <div className="p-4">
        <h3 className="text-sm font-700 text-[#0a0a0a] leading-tight mb-1 line-clamp-2">
          {p.nom}
        </h3>
        <p className="text-xs text-[#636366] mb-3 line-clamp-2">{p.description}</p>

        {/* TAILLES */}
        {p.tailles.length > 0 && p.tailles[0] !== "Disponible" && p.tailles[0] !== "Sur mesure" && (
          <div className="flex gap-1 flex-wrap mb-3">
            {p.tailles.map((t) => (
              <span key={t} className="text-xs border border-[#e5e5ea] rounded px-1.5 py-0.5 text-[#636366]">
                {t}
              </span>
            ))}
          </div>
        )}

        {/* PRIX + CTA */}
        <div className="flex items-center justify-between">
          <span className={`text-sm font-800 ${p.prix === 0 ? "text-green-600" : "text-[#0a0a0a]"}`}>
            {formatPrix(p.prix)}
          </span>
          <span className="text-xs bg-[#0a0a0a] text-white px-3 py-1.5 rounded-full group-hover:bg-[#333] transition-colors">
            Commander →
          </span>
        </div>
      </div>
    </a>
  );
}

export default function ProduitsPage() {
  const [categorie, setCategorie] = useState("Tous");
  const [recherche, setRecherche] = useState("");

  const filtres = PRODUITS.filter((p) => {
    const matchCat = categorie === "Tous" || p.categorie === categorie;
    const matchSearch =
      recherche === "" ||
      p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      p.description.toLowerCase().includes(recherche.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="min-h-screen bg-white">
      {/* HEADER */}
      <div
        className="relative px-6 py-16 text-center text-white"
        style={{ background: "linear-gradient(165deg, #0C4A6E 0%, #38BDF8 100%)" }}
      >
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Nos Produits</h1>
        <p className="text-sm opacity-75 max-w-md mx-auto">
          {PRODUITS.length} produits disponibles — T-shirts, ensembles, uniformes B2B
        </p>

        {/* BARRE DE RECHERCHE */}
        <div className="mt-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full px-5 py-3 rounded-full text-sm text-[#0a0a0a] outline-none shadow-lg"
          />
        </div>
      </div>

      {/* FILTRES */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#e5e5ea] px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorie(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-600 transition-all ${
                categorie === cat
                  ? "bg-[#0a0a0a] text-white"
                  : "bg-[#f2f2f7] text-[#636366] hover:bg-[#e5e5ea]"
              }`}
            >
              {cat}
              {cat !== "Tous" && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({PRODUITS.filter((p) => p.categorie === cat).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* GRILLE */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {filtres.length === 0 ? (
          <div className="text-center py-20 text-[#636366]">
            <p className="text-lg">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtres.map((p) => (
              <CarteProduct key={p.id} p={p} />
            ))}
          </div>
        )}
      </div>

      {/* CTA B2B */}
      <div className="bg-[#0a0a0a] text-white text-center py-16 px-6">
        <h2 className="text-2xl font-800 mb-3">Commande personnalisée ?</h2>
        <p className="text-sm opacity-60 mb-8 max-w-sm mx-auto">
          Broderie, DTF, uniformes B2B. Devis gratuit en moins de 2h.
        </p>
        <a
          href="https://wa.me/213557440522"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-[#0a0a0a] font-800 px-8 py-3 rounded-full text-sm hover:bg-gray-100 transition-colors"
        >
          Contacter sur WhatsApp →
        </a>
      </div>
    </main>
  );
}
