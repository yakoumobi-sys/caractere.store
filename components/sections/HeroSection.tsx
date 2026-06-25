export default function HeroSection({ config }: { config?: any }) {
  const LOGO_URL =
    "https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png";

  return (
    <section
      className="relative overflow-hidden px-6 pb-16 pt-14 text-center"
      style={{ background: "linear-gradient(165deg, #0C4A6E 0%, #38BDF8 100%)" }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(186,230,253,0.5) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-md">
        <img
          src={LOGO_URL}
          alt="Caractere"
          className="mx-auto mb-6 h-16 w-auto object-contain"
        />

        <p className="text-sm font-medium mb-3" style={{ color: "rgba(255,255,255,0.9)" }}>
          Personnalisation Textile — Alger
        </p>

        <h1 className="text-4xl font-extrabold leading-tight text-white mb-4">
          Habillez votre
          <br />
          équipe.
        </h1>

        <p className="mx-auto max-w-xs text-sm mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
          Broderie, DTF, uniformes — de 1 à 10 000 pièces. Devis gratuit sous 24h.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="/configurateur"
            className="rounded-full bg-white py-3 text-sm font-semibold no-underline transition"
            style={{ color: "#0C4A6E" }}
          >
            Configurer ma commande
          </a>

          <a
            href="/entreprises"
            className="rounded-full py-3 text-sm font-semibold no-underline border-2 backdrop-blur-sm transition"
            style={{
              borderColor: "rgba(255,255,255,0.6)",
              backgroundColor: "rgba(255,255,255,0.15)",
              color: "#fff",
            }}
          >
            Packs entreprise ✦
          </a>

          <a
            href="/designer"
            className="rounded-full border-2 py-3 text-sm font-semibold text-white no-underline backdrop-blur-sm transition"
            style={{
              borderColor: "rgba(255,255,255,0.4)",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            Open Designer ✏️
          <a
            href="/catalogue"
            target="_blank"
            className="rounded-full border-2 py-3 text-sm font-semibold no-underline backdrop-blur-sm transition"
            style={{
              borderColor: "rgba(255,255,255,0.4)",
              backgroundColor: "rgba(255,255,255,0.05)",
              color: "#fff",
            }}
          >
            📘 Catalogue 2025–2026
          </a>

          </a>

          <a
            href="/auth/login"
            className="rounded-full border-2 py-3 text-sm font-semibold no-underline"
            style={{
              borderColor: "rgba(255,255,255,0.25)",
              backgroundColor: "transparent",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Se connecter
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-7">
          {[
            { value: "297K", label: "Abonnés Instagram" },
            { value: "5+", label: "Ans d'activité" },
            { value: "3-5j", label: "Délai production" },
            { value: "1", label: "Pièce minimum" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.8)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
