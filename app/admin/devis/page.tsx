"use client";
import { useEffect, useState, useCallback } from "react";
import { adminFetch } from "@/lib/adminFetch";
type Quote = {
  id: string;
  request_id: string;
  nom: string;
  telephone: string;
  status: string;
  created_at: string;
  payload: Record<string, string>;
};
export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]),
    [count, setCount] = useState(0),
    [page, setPage] = useState(0),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState<string | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const r = await adminFetch(`/api/admin/devis?page=${page}`);
      if (!r.ok) throw new Error();
      const d = await r.json();
      setQuotes(d.requests);
      setCount(d.count);
    } catch {
      setError("Impossible de charger les demandes. Réessayez.");
    } finally {
      setLoading(false);
    }
  }, [page]);
  useEffect(() => {
    void load();
  }, [load]);
  async function update(id: string, status: string) {
    setSaving(id);
    setError("");
    try {
      const r = await adminFetch("/api/admin/devis", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!r.ok) throw new Error();
      setQuotes((q) => q.map((x) => (x.id === id ? { ...x, status } : x)));
    } catch {
      setError("La mise à jour n’a pas été enregistrée.");
    } finally {
      setSaving(null);
    }
  }
  return (
    <section className="text-stone-900 max-w-5xl">
      <div className="flex justify-between gap-4 items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Demandes de devis</h1>
          <p className="text-sm text-stone-600 mt-2">
            {count} demandes · Coordonnées, brief et fichiers au même endroit.
          </p>
        </div>
        <button className="border rounded px-4 py-2" onClick={load}>
          Actualiser
        </button>
      </div>
      {error && (
        <p role="alert" className="p-4 bg-red-50 text-red-800 mb-4">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Chargement…</p>
      ) : quotes.length === 0 ? (
        <p className="p-8 bg-white rounded">
          Les nouvelles demandes apparaîtront ici.
        </p>
      ) : (
        <div className="grid gap-4">
          {quotes.map((q) => (
            <article
              key={q.id}
              className="bg-white border border-stone-200 rounded-lg p-5"
            >
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">{q.nom}</h2>
                  <a
                    href={`tel:${q.telephone.replace(/[^+0-9]/g, "")}`}
                    className="text-sm underline"
                  >
                    {q.telephone}
                  </a>
                  <p className="text-xs text-stone-500 mt-2">
                    {new Date(q.created_at).toLocaleString("fr-DZ")} ·{" "}
                    {q.request_id}
                  </p>
                </div>
                <label className="text-xs">
                  Statut
                  <select
                    className="block border rounded p-2 mt-1 text-sm"
                    value={q.status}
                    disabled={saving === q.id}
                    onChange={(e) => update(q.id, e.target.value)}
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="contacte">Contacté</option>
                    <option value="termine">Terminé</option>
                  </select>
                </label>
              </div>
              <dl className="grid grid-cols-2 gap-3 mt-5 text-sm">
                {Object.entries(q.payload)
                  .filter(([k, v]) => v && k !== "logo")
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs uppercase text-stone-500">{k}</dt>
                      <dd className="whitespace-pre-wrap break-words">{v}</dd>
                    </div>
                  ))}
              </dl>
              {q.payload.logo?.startsWith(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/image/logos/`,
              ) && (
                <a
                  className="inline-block mt-4 text-sm underline"
                  href={q.payload.logo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Voir le fichier client ↗
                </a>
              )}
            </article>
          ))}
        </div>
      )}
      <div className="flex gap-4 items-center mt-6">
        <button
          className="border rounded px-4 py-2 disabled:opacity-40"
          disabled={page === 0 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          Précédent
        </button>
        <span className="text-sm">Page {page + 1}</span>
        <button
          className="border rounded px-4 py-2 disabled:opacity-40"
          disabled={(page + 1) * 50 >= count || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          Suivant
        </button>
      </div>
    </section>
  );
}
