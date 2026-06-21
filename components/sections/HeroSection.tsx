export default function HeroSection({ config }) {
  const cream = "#FFFFFF";
  const muted = "rgba(255,255,255,0.85)";
  const darkText = "#3A0E14"; // bordeaux très foncé, pour texte sur fond blanc

  return (
    <section
      className="relative overflow-hidden px-6 pb-20 pt-16 text-center"
      style={{
        background: "linear-gradient(165deg, #0C4A6E 0%, #38BDF8 100%)",
      }}
    >
      {/* Halo lumineux derrière le titre, plus clair que le fond */}
      <div
        className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(186,230,253,0.5) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-md">
        {/* Badge */}
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium backdrop-blur-sm"
          style={{
            borderColor: "rgba(255,255,255,0.3)",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: cream,
          }}
        >
          ✦ Personnalisation textile — Alger
        </span>

        {/* Titre */}
        <h1 className="mt-6 text-4xl font-extrabold leading-tight" style={{ color: cream }}>
          {config?.heroTitle || "Imprimez Votre"}
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #FFD27A, #FFB67A)",
            }}
          >
            {config?.heroAccent || "Identité de Marque"}
          </span>
        </h1>

        {/* Sous-titre */}
        <p className="mx-auto mt-4 max-w-xs text-sm" style={{ color: muted }}>
          {config?.heroSubtitle ||
            "DTF, broderie et personnalisation textile premium pour entreprises et particuliers. Une impression qui dure."}
        </p>

        {/* CTAs */}
        <div className="mt-7 flex flex-col gap-3">
          <a
            href="/configurateur"
            className="rounded-full py-3 text-sm font-semibold transition"
            style={{ backgroundColor: cream, color: darkText }}
          >
            Devis gratuit ✦
          </a>
          <a
            href="/designer"
            className="rounded-full border-2 py-3 text-sm font-semibold backdrop-blur-sm transition"
            style={{
              borderColor: "rgba(255,255,255,0.5)",
              backgroundColor: "rgba(255,255,255,0.08)",
              color: cream,
            }}
          >
            Voir nos produits
          </a>
        </div>

        {/* Réassurance */}
        <div
          className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs"
          style={{ color: muted }}
        >
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#7CFFB2" }}>✓</span> Qualité Premium
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#7CFFB2" }}>✓</span> Livraison Rapide
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ color: "#7CFFB2" }}>✓</span> Prix Compétitifs
          </span>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { value: "292K+", label: "Followers" },
            { value: "20+", label: "Employés" },
            { value: "3-7j", label: "Délai livraison" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border py-4 backdrop-blur-sm"
              style={{
                borderColor: "rgba(255,255,255,0.25)",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            >
              <p className="text-xl font-bold" style={{ color: cream }}>
                {stat.value}
              </p>
              <p className="mt-0.5 text-[11px]" style={{ color: muted }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
