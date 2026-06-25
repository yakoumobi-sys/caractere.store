"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const STATUS_CONFIG = {
  nouveau:  { label: "Nouveau",  color: "#3B82F6", bg: "#EFF6FF" },
  en_cours: { label: "En cours", color: "#F97316", bg: "#FFF7ED" },
  termine:  { label: "Terminé",  color: "#10B981", bg: "#ECFDF5" },
  annule:   { label: "Annulé",   color: "#EF4444", bg: "#FEF2F2" },
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-DZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function buildText(o) {
  const tailles = Array.isArray(o.tailles) && o.tailles.length > 0
    ? o.tailles.join(", ")
    : (o.tailles || "—");

  const lines = [
    `📦 ${o.reference || o.id}`,
    `👤 ${o.nom_client || "—"}`,
    `📞 ${o.telephone || "—"}`,
    `🛍️ ${o.produit || "—"}`,
    `📐 Taille : ${tailles}`,
    `🔢 Quantité : ${o.quantite || 1}`,
    `🎨 Couleur : ${o.couleur || "—"}`,
  ];
  if (o.technique) lines.push(`⚙️ Technique : ${o.technique}`);
  if (o.position)  lines.push(`📍 Position : ${o.position}`);
  if (o.notes && o.notes !== "EMPTY") lines.push(`📝 Notes : ${o.notes}`);
  lines.push(`📅 ${formatDate(o.created_at)}`);
  return lines.join("\n");
}

function CopyBtn({ text }) {
  const [done, setDone] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    });
  };
  return (
    <button onClick={copy} style={{
      padding: "6px 14px", borderRadius: 8, border: "none",
      background: done ? "#10B981" : "#1E293B",
      color: "#fff", fontSize: 12, fontWeight: 600,
      cursor: "pointer", transition: "background .2s", whiteSpace: "nowrap",
    }}>
      {done ? "✓ Copié !" : "📋 Copier"}
    </button>
  );
}

function OrderCard({ o }) {
  const s = STATUS_CONFIG[o.statut] || STATUS_CONFIG.nouveau;
  const text = buildText(o);
  const tailles = Array.isArray(o.tailles) && o.tailles.length > 0
    ? o.tailles.join(", ")
    : (o.tailles || "—");

  return (
    <div style={{
      background: "#fff", borderRadius: 14, padding: "14px 16px",
      marginBottom: 10, borderLeft: `4px solid ${s.color}`,
      boxShadow: "0 1px 4px rgba(0,0,0,.07)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }}>
          {o.reference || o.id?.slice(0, 8)}
          {o.urgent && <span style={{ marginLeft: 6, color: "#EF4444" }}>⚡ URGENT</span>}
        </span>
        <span style={{
          background: s.bg, color: s.color,
          padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
        }}>{s.label}</span>
      </div>

      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.8 }}>
        <div>👤 <b>{o.nom_client || "—"}</b></div>
        <div>📞 {o.telephone || "—"}</div>
        <div>🛍️ {o.produit || "—"}</div>
        <div>📐 <b>{tailles}</b> &nbsp;|&nbsp; x{o.quantite || 1} &nbsp;|&nbsp; {o.couleur || "—"}</div>
        {o.technique && <div>⚙️ {o.technique}</div>}
        {o.notes && o.notes !== "EMPTY" && <div>📝 {o.notes}</div>}
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>📅 {formatDate(o.created_at)}</div>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", marginTop: 10 }}>
        <pre style={{
          flex: 1, background: "#F8FAFC", borderRadius: 8,
          padding: "8px 10px", fontSize: 11, color: "#475569",
          margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word",
          border: "1px solid #E2E8F0",
        }}>{text}</pre>
        <CopyBtn text={text} />
      </div>
    </div>
  );
}

export default function ResumeCommandes() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [copyAll, setCopyAll] = useState(false);

  useEffect(() => {
    supabase
      .from("commandes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) setOrders(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = orders.filter(o => {
    const matchStatus = filter === "tous" || o.statut === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (o.reference || "").toLowerCase().includes(q) ||
      (o.nom_client || "").toLowerCase().includes(q) ||
      (o.telephone || "").includes(q) ||
      (o.produit || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const allText = filtered.map(buildText).join("\n\n──────────────\n\n");

  const TABS = [
    { key: "tous",     label: "Tous" },
    { key: "nouveau",  label: "Nouveaux" },
    { key: "en_cours", label: "En cours" },
    { key: "termine",  label: "Terminés" },
    { key: "annule",   label: "Annulés" },
  ];

  const count = (k) => k === "tous"
    ? orders.length
    : orders.filter(o => o.statut === k).length;

  const doCopyAll = () => {
    navigator.clipboard.writeText(allText).then(() => {
      setCopyAll(true);
      setTimeout(() => setCopyAll(false), 2500);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ background: "#1E293B", padding: "18px 16px 14px", color: "#fff" }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.3 }}>📋 Résumé Commandes</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
          Caractère Store · {orders.length} commandes
        </div>
      </div>

      <div style={{ padding: "14px 12px" }}>
        <input
          placeholder="🔍 Nom, référence, téléphone, article..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 14px", borderRadius: 12,
            border: "1px solid #E2E8F0", fontSize: 13,
            outline: "none", background: "#fff", marginBottom: 10,
          }}
        />

        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key)} style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              background: filter === t.key ? "#1E293B" : "#fff",
              color: filter === t.key ? "#fff" : "#475569",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap", boxShadow: "0 1px 3px rgba(0,0,0,.08)",
            }}>
              {t.label} ({count(t.key)})
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <button onClick={doCopyAll} style={{
            width: "100%", padding: "11px", borderRadius: 12, border: "none",
            background: copyAll ? "#10B981" : "#3B82F6",
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", marginBottom: 12, transition: "background .2s",
          }}>
            {copyAll
              ? `✓ ${filtered.length} commandes copiées !`
              : `📋 Tout copier (${filtered.length} commandes)`}
          </button>
        )}

        {loading && (
          <div style={{ textAlign: "center", color: "#9CA3AF", padding: 40 }}>Chargement...</div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", color: "#9CA3AF", padding: 40 }}>Aucune commande trouvée</div>
        )}

        {filtered.map(o => <OrderCard key={o.id} o={o} />)}
      </div>
    </div>
  );
}
