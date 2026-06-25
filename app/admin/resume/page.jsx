import { useState, useEffect } from "react";

const SUPABASE_URL = "https://your-project.supabase.co"; // à remplacer
const SUPABASE_ANON_KEY = "your-anon-key"; // à remplacer

// ── Mock data (remplace par ton vrai fetch Supabase) ──────────────────────────
const MOCK_ORDERS = [
  {
    id: "CAR-MQT002XA",
    status: "en_cours",
    created_at: "2026-06-25T16:36:27",
    customer_name: "Anwar Selmi",
    customer_phone: "0555 123 456",
    items: [{ article: "T-shirt Oversized 250GSM", taille: "L", qty: 1 }],
  },
  {
    id: "CAR-MQTNP8XC",
    status: "nouveau",
    created_at: "2026-06-25T16:28:01",
    customer_name: "Anwar Selmi",
    customer_phone: "0555 123 456",
    items: [{ article: "T-shirt Oversized 250GSM", taille: "XL", qty: 1 }],
  },
  {
    id: "CAR-MQTITELL",
    status: "nouveau",
    created_at: "2026-06-25T14:11:15",
    customer_name: "Iouai",
    customer_phone: "0661 789 012",
    items: [{ article: "T-shirt", taille: "M", qty: 1 }],
  },
];

const STATUS_CONFIG = {
  nouveau:   { label: "Nouveau",    color: "#3B82F6", bg: "#EFF6FF" },
  en_cours:  { label: "En cours",   color: "#F97316", bg: "#FFF7ED" },
  termine:   { label: "Terminé",    color: "#10B981", bg: "#ECFDF5" },
  annule:    { label: "Annulé",     color: "#EF4444", bg: "#FEF2F2" },
};

function formatDate(iso) {
  return new Date(iso).toLocaleString("fr-DZ", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function buildText(order) {
  const lines = [
    `📦 ${order.id}`,
    `👤 ${order.customer_name}`,
    `📞 ${order.customer_phone || "—"}`,
    ...order.items.map((it, i) =>
      `🛍️ Article ${order.items.length > 1 ? i + 1 + " : " : ": "}${it.article}  |  Taille : ${it.taille}  |  Qté : ${it.qty}`
    ),
    `📅 ${formatDate(order.created_at)}`,
  ];
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
    <button
      onClick={copy}
      style={{
        padding: "6px 14px",
        borderRadius: 8,
        border: "none",
        background: done ? "#10B981" : "#1E293B",
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "background .2s",
        whiteSpace: "nowrap",
      }}
    >
      {done ? "✓ Copié" : "📋 Copier"}
    </button>
  );
}

function OrderCard({ order }) {
  const s = STATUS_CONFIG[order.status] || STATUS_CONFIG.nouveau;
  const text = buildText(order);

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 10,
        borderLeft: `4px solid ${s.color}`,
        boxShadow: "0 1px 4px rgba(0,0,0,.07)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }}>{order.id}</span>
        <span style={{
          background: s.bg, color: s.color,
          padding: "2px 10px", borderRadius: 20,
          fontSize: 11, fontWeight: 700,
        }}>{s.label}</span>
      </div>

      {/* Infos */}
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>
        <div>👤 <b>{order.customer_name}</b></div>
        <div>📞 {order.customer_phone || <span style={{ color: "#9CA3AF" }}>Non renseigné</span>}</div>
        {order.items.map((it, i) => (
          <div key={i}>
            🛍️ {it.article} &nbsp;|&nbsp; <b>{it.taille}</b> &nbsp;|&nbsp; x{it.qty}
          </div>
        ))}
        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>📅 {formatDate(order.created_at)}</div>
      </div>

      {/* Texte brut + bouton */}
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

export default function App() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState("tous");
  const [search, setSearch] = useState("");
  const [copyAll, setCopyAll] = useState(false);

  const filtered = orders.filter(o => {
    const matchStatus = filter === "tous" || o.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      o.id.toLowerCase().includes(q) ||
      o.customer_name.toLowerCase().includes(q) ||
      (o.customer_phone || "").includes(q);
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

  const count = (k) => k === "tous" ? orders.length : orders.filter(o => o.status === k).length;

  const doCopyAll = () => {
    navigator.clipboard.writeText(allText).then(() => {
      setCopyAll(true);
      setTimeout(() => setCopyAll(false), 2000);
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1E293B", padding: "18px 16px 14px", color: "#fff" }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.3 }}>📋 Résumé Commandes</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Caractère Store · copie rapide</div>
      </div>

      <div style={{ padding: "14px 12px" }}>
        {/* Search */}
        <input
          placeholder="🔍 Nom, référence, téléphone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 14px", borderRadius: 12,
            border: "1px solid #E2E8F0", fontSize: 13,
            outline: "none", background: "#fff",
            marginBottom: 10,
          }}
        />

        {/* Tabs */}
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

        {/* Copy all */}
        {filtered.length > 0 && (
          <button onClick={doCopyAll} style={{
            width: "100%", padding: "11px",
            borderRadius: 12, border: "none",
            background: copyAll ? "#10B981" : "#3B82F6",
            color: "#fff", fontSize: 13, fontWeight: 700,
            cursor: "pointer", marginBottom: 12,
            transition: "background .2s",
          }}>
            {copyAll ? `✓ ${filtered.length} commandes copiées !` : `📋 Tout copier (${filtered.length} commandes)`}
          </button>
        )}

        {/* Orders */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "#9CA3AF", padding: 40, fontSize: 14 }}>
            Aucune commande trouvée
          </div>
        ) : (
          filtered.map(o => <OrderCard key={o.id} order={o} />)
        )}
      </div>
    </div>
  );
}
