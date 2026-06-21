export default function HeroSection({ config }: { config?: any }) {
  const LOGO_URL =
    "https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png";

  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-14 text-center"
      style={{
        background: "linear-gradient(165deg, #0C4A6E 0%, #38BDF8 100%)",
      }}
    >
      {/* Halo lumineux */}
      <div
        className="pointer-events-none absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(186,230,253,0.5) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-md">
        {/* Logo blanc, directement sur le fond dégradé */}
        <img
          src={LOGO_URL}
          alt="Caractère"
          className="mx-auto h-24 w-auto object-contain"
        />

        <p className="mt-4 text-sm font-medium" style={{ color: "rgba(255,255,255,0.9)" }}>
          Personnalisation Textile — Alger
        </p>

        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white">
          Habillez votre
          <br />
          équipe.
        </h1>

        <p className="mx-auto mt-4 max-w-xs text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
          Broderie, DTF, uniformes — de 1 à 10 000 pièces. Devis gratuit sous 24h.
        </p>

        {/* Boutons d'origine */}
        <div className="mt-7 flex flex-col gap-3">
          <a
            href="/configurateur"
            className="rounded-full bg-white py-3 text-sm font-semibold transition"
            style={{ color: "#0C4A6E" }}
          >
            Configurer ma commande
          </a>
          <a
            href="/designer"
            className="rounded-full border-2 py-3 text-sm font-semibold text-white backdrop-blur-sm transition"
            style={{
              borderColor: "rgba(255,255,255,0.6)",
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          >
            Open Designer ✏️
          </a>
          <a
            href="/realisations"
            className="rounded-full border-2 py-3 text-sm font-semibold text-white backdrop-blur-sm transition"
            style={{
              borderColor: "rgba(255,255,255,0.35)",
              backgroundColor: "transparent",
            }}
          >
            Voir nos réalisations
          </a>
        </div>

        {/* Stats — fidèles à l'original, 2x2, sans cartes */}
        <div className="mt-10 grid grid-cols-2 gap-y-7">
          <div>
            <p className="text-3xl font-extrabold text-white">297K</p>
            <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
              Abonnés Instagram
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">5+</p>
            <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
              Ans d'activité
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">3-5j</p>
            <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
              Délai production
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-white">1</p>
            <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>
              Pièce minimum
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
