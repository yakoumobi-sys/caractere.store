"use client";
import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminFetch";

type Member = { user_id: string; email: string; balance: number; lifetime_earned: number; joined_at: string };
type RequestItem = { id: string; user_id: string; reward_id: string; email: string; points_spent: number; status: string; requested_at: string };
type Reward = { id: string; title: string; cost_points: number };
type Order = { id: string; reference: string; nom_client: string; prix_total: number; email: string | null };
type AdminData = { members: Member[]; requests: RequestItem[]; rewards: Reward[]; orders: Order[] };
const money = (n: number) => new Intl.NumberFormat("fr-DZ").format(n);

export default function AdminPrivilege() {
  const [data, setData] = useState<AdminData | null>(null);
  const [type, setType] = useState<"credit_order" | "credit_offline">("credit_offline");
  const [email, setEmail] = useState("");
  const [reference, setReference] = useState("");
  const [amount, setAmount] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refresh = useCallback(async () => {
    const res = await adminFetch("/api/admin/privilege", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Accès refusé.");
    setData(json);
  }, []);
  useEffect(() => { refresh().catch(e => setError(e.message)); }, [refresh]);

  const post = async (body: object) => {
    setBusy(true); setError(""); setSuccess("");
    try {
      const res = await adminFetch("/api/admin/privilege", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Opération impossible.");
      setSuccess(json.points ? "Crédit effectué : +" + money(json.points) + " points." : "Décision enregistrée.");
      await refresh();
    } catch(e) { setError(e instanceof Error ? e.message : "Erreur"); }
    finally { setBusy(false); }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Record<string, unknown> = { action: type, email: email.trim(), reference: reference.trim(), confirmed };
    if (type === "credit_offline") payload.amount = Number(amount);
    void post(payload);
  };
  const pending = data?.requests.filter(x => x.status === "pending") || [];

  return (
    <div className="max-w-6xl mx-auto px-3 py-5 text-[#1d1d1f]">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div><p className="text-[11px] font-bold tracking-widest text-[#ad4336] uppercase">Caractère</p><h1 className="text-3xl font-bold tracking-tight mt-2">Privilège — Administration</h1><p className="text-sm text-gray-500 mt-2">Points accordés uniquement après vérification du paiement et de l'identité.</p></div>
        <button className="rounded-full bg-black text-white px-5 py-3 text-sm font-semibold disabled:opacity-50" disabled={busy} onClick={() => refresh().catch(e => setError(e.message))}>Actualiser</button>
      </div>
      {error && <div className="p-4 border border-red-200 bg-red-50 rounded-xl text-red-800 text-sm mb-5" role="alert">{error}</div>}
      {success && <div className="p-4 border border-green-200 bg-green-50 rounded-xl text-green-800 text-sm mb-5" role="status">{success}</div>}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {label:"Membres actifs",value:data?.members.length ?? "—"},
          {label:"Points disponibles",value:data ? money(data.members.reduce((sum,m)=>sum+m.balance,0)) : "—"},
          {label:"Récompenses à traiter",value:data?.requests.filter(x=>x.status==="pending").length ?? "—"},
        ].map(x=><div key={x.label} className="rounded-2xl bg-white p-6 border border-black/10"><p className="text-xs text-gray-500">{x.label}</p><p className="text-3xl font-bold mt-3">{x.value}</p></div>)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mt-7">
        <section className="bg-white rounded-2xl border border-black/10 p-6">
          <h2 className="text-xl font-bold">Créditer un achat vérifié</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">1 point / 100 DA encaissés. Seuls les clients ayant activé leur carte Privilège peuvent recevoir des points. Une référence facture ne peut être créditée qu'une seule fois.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <fieldset className="flex gap-5">
              <label className="text-sm"><input type="radio" checked={type==="credit_offline"} onChange={()=>setType("credit_offline")} /> Achat WhatsApp / boutique</label>
              <label className="text-sm"><input type="radio" checked={type==="credit_order"} onChange={()=>setType("credit_order")} /> Commande site</label>
            </fieldset>
            <label className="block text-sm font-semibold">E-mail du compte Caractère
              <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="client@exemple.dz" className="block w-full mt-2 rounded-xl border border-black/20 p-3 text-sm font-normal" />
            </label>
            <label className="block text-sm font-semibold">{type==="credit_offline" ? "Référence facture unique" : "Référence commande site"}
              <input required value={reference} onChange={e=>setReference(e.target.value)} placeholder={type==="credit_offline"?"FAC-2026-001":"CAR-..."} className="block w-full mt-2 rounded-xl border border-black/20 p-3 text-sm font-normal" />
            </label>
            {type==="credit_offline" && <label className="block text-sm font-semibold">Montant effectivement payé (DA)
              <input type="number" min="100" max="100000000" step="1" required value={amount} onChange={e=>setAmount(e.target.value)} className="block w-full mt-2 rounded-xl border border-black/20 p-3 text-sm font-normal" />
            </label>}
            <label className="flex gap-3 items-start text-sm text-gray-600"><input type="checkbox" required checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} className="mt-1" /> Je confirme avoir vérifié le paiement et l'identité du client avant d'attribuer ces points.</label>
            <button type="submit" disabled={busy || !confirmed} className="rounded-full bg-[#191919] px-7 py-3.5 text-white font-semibold text-sm disabled:opacity-50">{busy?"Traitement…":"Créditer les points"}</button>
          </form>
        </section>
        <section className="bg-white rounded-2xl border border-black/10 p-6">
          <h2 className="text-xl font-bold">Demandes de récompenses</h2>
          <p className="text-sm text-gray-500 mt-2">Accepter uniquement quand la remise a été validée commercialement.</p>
          {pending.length===0 ? <p className="mt-8 text-gray-500 text-sm">Aucune demande en attente.</p> : <div className="space-y-3 mt-6">{pending.map(x=><div key={x.id} className="border border-black/10 rounded-xl p-4">
            <p className="font-semibold text-sm">{data?.rewards.find(r=>r.id===x.reward_id)?.title || "Récompense"}</p><p className="text-xs text-gray-500 mt-1">{x.email || x.user_id} • {money(x.points_spent)} pts</p>
            <div className="flex gap-3 mt-4"><button disabled={busy} onClick={()=>post({action:"review",id:x.id,approved:true})} className="rounded-full bg-[#191919] px-4 py-2 text-white text-xs disabled:opacity-50">Valider</button><button disabled={busy} onClick={()=>post({action:"review",id:x.id,approved:false})} className="rounded-full border border-black/20 px-4 py-2 text-xs disabled:opacity-50">Refuser et rembourser les points</button></div>
          </div>)}</div>}
        </section>
      </div>
      <section className="bg-white rounded-2xl border border-black/10 p-6 mt-7">
        <h2 className="text-xl font-bold">Membres enregistrés</h2>
        {data?.members.length ? <div className="mt-5 divide-y divide-black/10">{data.members.map(m=><div key={m.user_id} className="flex justify-between items-center gap-4 py-3 text-sm"><div><p className="font-semibold">{m.email || m.user_id}</p><p className="text-xs text-gray-500">Points gagnés : {money(m.lifetime_earned)}</p></div><strong>{money(m.balance)} pts</strong></div>)}</div> : <p className="mt-5 text-sm text-gray-500">Aucun membre encore inscrit. Les clients peuvent activer leur carte depuis /privilege.</p>}
      </section>
      <section className="bg-white rounded-2xl border border-black/10 p-6 mt-7">
        <h2 className="text-xl font-bold">Commandes site éligibles</h2>
        <p className="text-sm text-gray-500 mt-2">Seules les commandes terminées ET dont le paiement est confirmé peuvent être créditées.</p>
        {data?.orders.length ? <div className="mt-5 space-y-3">{data.orders.map(o=><p key={o.id} className="text-sm">{o.reference} • {o.nom_client} • {money(o.prix_total)} DA</p>)}</div> : <p className="mt-5 text-sm text-gray-500">Aucune commande terminée actuellement.</p>}
      </section>
    </div>
  );
}
