"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type Member = { balance: number; lifetime_earned: number; email_opt_in: boolean; joined_at: string };
type Reward = { id: string; title: string; description: string; cost_points: number };
type Transaction = { id: string; kind: string; delta: number; description: string; created_at: string };
type Redemption = { id: string; reward_id: string; points_spent: number; status: string; requested_at: string };
type Notice = { id: string; title: string; message: string; read_at: string | null; created_at: string };
type Wallet = { member: Member | null; rewards: Reward[]; transactions: Transaction[]; redemptions: Redemption[]; notifications: Notice[] };
const fmt = (n: number) => new Intl.NumberFormat("fr-DZ").format(n);
const date = (text: string) => new Date(text).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });

export default function PrivilegeClient() {
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const request = useCallback(async (method: "GET" | "POST", body?: object) => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) throw new Error("Votre session a expiré. Reconnectez-vous.");
    const res = await fetch("/api/privilege", {
      method, headers: { Authorization: "Bearer " + session.access_token, ...(body ? { "Content-Type": "application/json" } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Une erreur est survenue.");
    return json;
  }, []);

  const reload = useCallback(async () => {
    const data = await request("GET");
    setWallet(data as Wallet);
  }, [request]);

  useEffect(() => {
    let active = true;
    supabaseClient.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      setUser(data.user);
      if (data.user) {
        try { const x = await request("GET"); if (active) setWallet(x); }
        catch(e) { if (active) setError(e instanceof Error ? e.message : "Erreur"); }
      }
    }).catch(() => { if (active) setError("Connexion impossible."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [request]);

  const act = async (action: string, body: object = {}) => {
    setBusy(true); setError(""); setInfo("");
    try {
      await request("POST", { action, ...body });
      await reload();
      setInfo(action === "join" ? "Votre carte est activée." : "Mise à jour enregistrée.");
    } catch(e) { setError(e instanceof Error ? e.message : "Une erreur est survenue."); }
    finally { setBusy(false); }
  };

  const redeem = async (reward: Reward) => {
    if (!window.confirm("Utiliser " + fmt(reward.cost_points) + " points pour demander « " + reward.title + " » ?")) return;
    setBusy(true); setError(""); setInfo("");
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) throw new Error("Reconnectez-vous.");
      const { error } = await supabaseClient.rpc("privilege_redeem", { p_reward_id: reward.id });
      if (error) throw new Error(error.message || "Récompense indisponible.");
      await reload();
      setInfo("Demande enregistrée. Notre équipe doit maintenant la valider.");
    } catch(e) { setError(e instanceof Error ? e.message : "Impossible de demander la récompense."); }
    finally { setBusy(false); }
  };

  const name = user?.user_metadata?.full_name?.toString().trim() || user?.email?.split("@")[0] || "Membre";
  const balance = wallet?.member?.balance || 0;

  return (
    <main className="bg-[#f7f6f3] text-[#1d1d1f] min-h-[80vh]">
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-12">
        <div className="text-[11px] font-bold uppercase tracking-[.23em] text-[#ac463b]">✦ Caractère Privilège</div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[-.065em] mt-5 leading-tight">Votre fidélité <span className="text-[#a94639]">a du caractère.</span></h1>
        <p className="text-[#77726d] mt-4 max-w-xl text-sm sm:text-base leading-relaxed">Votre carte, vos points et vos avantages dans un seul espace. Sans application à installer.</p>

        {error && <div role="alert" className="mt-7 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200 text-sm">{error}</div>}
        {info && <div role="status" className="mt-7 p-4 bg-white text-[#275c32] rounded-xl border border-[#b6d8b8] text-sm">{info}</div>}
        {loading && <p className="mt-14 text-[#77726d]">Chargement de votre espace…</p>}

        {!loading && !user && (
          <div className="mt-10 rounded-3xl bg-white border border-black/10 p-7 sm:p-10 max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight">Connectez-vous pour accéder à votre carte.</h2>
            <p className="text-[#76716b] text-sm leading-relaxed mt-3">Votre compte Caractère vous permet de retrouver vos avantages en toute sécurité.</p>
            <div className="flex gap-3 flex-wrap mt-7">
              <Link href="/auth/login" className="px-6 py-3 bg-[#1d1d1f] text-white rounded-full text-sm font-semibold">Se connecter</Link>
              <Link href="/auth/signup" className="px-6 py-3 border border-black/20 rounded-full text-sm font-semibold">Créer un compte</Link>
            </div>
          </div>
        )}

        {!loading && user && wallet && !wallet.member && (
          <div className="mt-9 grid lg:grid-cols-[1fr_.9fr] gap-7 items-center">
            <div className="rounded-3xl bg-white p-8 sm:p-11 border border-black/10">
              <p className="text-xs font-bold tracking-widest text-[#a94639]">BIENVENUE</p>
              <h2 className="text-3xl font-bold tracking-tight mt-4">Bienvenue, {name}.</h2>
              <p className="text-[#76716b] mt-4 leading-relaxed">Activez gratuitement votre carte digitale. Vos achats vérifiés pourront ensuite être crédités par notre équipe.</p>
              <button disabled={busy} onClick={() => act("join")} className="mt-7 rounded-full bg-[#191919] px-7 py-4 text-white text-sm font-semibold disabled:opacity-50">
                {busy ? "Activation…" : "Activer ma carte gratuite ↗"}
              </button>
            </div>
            <div className="rounded-3xl bg-[#181818] p-8 text-white aspect-[1.6] flex flex-col justify-between shadow-2xl">
              <div className="flex justify-between text-xl font-black tracking-tighter"><span>CARACTÈRE<span className="text-[#f17a65]">.</span></span><span>✦</span></div>
              <div><div className="text-3xl tracking-[.18em] font-semibold">PRIVILÈGE</div><div className="text-[11px] text-white/50 mt-2 tracking-widest">CARTE DIGITALE</div></div>
            </div>
          </div>
        )}

        {!loading && user && wallet?.member && (
          <>
            <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-6 mt-10">
              <div className="rounded-[28px] bg-[#181818] text-white p-7 sm:p-10 min-h-[270px] flex flex-col justify-between relative overflow-hidden">
                <div aria-hidden className="absolute -top-20 -right-12 w-72 h-72 rounded-full bg-[#a94639]/20 blur-3xl" />
                <div className="relative flex justify-between items-start text-xl font-black tracking-[-.06em]"><span>CARACTÈRE<span className="text-[#f17a65]">.</span></span><span className="text-[#d5bda7] text-2xl">✦</span></div>
                <div className="relative">
                  <p className="text-white/50 text-[11px] uppercase tracking-[.2em] mb-3">Caractère Privilège</p>
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">{name}</h2>
                  <p className="text-white/50 text-xs mt-2">Membre depuis {date(wallet.member.joined_at)}</p>
                </div>
              </div>
              <div className="rounded-[28px] bg-white border border-black/10 p-8 flex flex-col justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-[#8d8680]">Votre solde</p>
                <div><p className="text-6xl font-bold tracking-[-.07em]">{fmt(balance)}</p><p className="text-sm text-[#807a73] mt-2">points disponibles</p></div>
                <p className="text-xs text-[#9b958f]">{fmt(wallet.member.lifetime_earned)} points cumulés • 1 pt / 100 DA d’achat validé</p>
              </div>
            </div>
            <section className="mt-16">
              <div className="flex justify-between items-end gap-4"><div><p className="text-xs font-bold tracking-widest text-[#a94639]">RÉCOMPENSES</p><h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3">Vos avantages.</h2></div></div>
              <div className="grid md:grid-cols-2 gap-4 mt-7">
                {wallet.rewards.map(r => (
                  <article key={r.id} className="rounded-3xl bg-white border border-black/10 p-7 flex flex-col justify-between min-h-[240px]">
                    <div><span className="text-xs font-bold tracking-widest text-[#a94639]">{fmt(r.cost_points)} POINTS</span><h3 className="text-2xl font-bold mt-5 tracking-tight">{r.title}</h3><p className="text-[#79736d] text-sm mt-3 leading-relaxed">{r.description}</p></div>
                    <button type="button" disabled={busy || balance < r.cost_points} onClick={() => redeem(r)} className="self-start mt-6 rounded-full bg-[#191919] px-6 py-3 text-white text-sm font-semibold disabled:bg-[#eae8e5] disabled:text-[#8b8884]">
                      {balance < r.cost_points ? "Points insuffisants" : "Demander cet avantage ↗"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
            <section className="mt-16 grid lg:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white border border-black/10 p-7">
                <h2 className="text-xl font-bold">Mes opérations</h2>
                {wallet.transactions.length === 0 ? <p className="text-[#8a8580] text-sm mt-5 leading-relaxed">Aucun achat éligible crédité pour le moment. Contactez notre équipe si vous avez déjà commandé chez Caractère.</p> : (
                  <div className="mt-5 divide-y divide-black/10">{wallet.transactions.map(tx => (
                    <div key={tx.id} className="py-4 flex justify-between gap-4 text-sm"><div><p className="font-semibold">{tx.description}</p><p className="text-[#9b958f] text-xs mt-1">{date(tx.created_at)}</p></div><strong className={tx.delta > 0 ? "text-green-700" : "text-[#a94639]"}>{tx.delta > 0 ? "+" : ""}{fmt(tx.delta)} pts</strong></div>
                  ))}</div>
                )}
              </div>
              <div className="rounded-3xl bg-white border border-black/10 p-7">
                <h2 className="text-xl font-bold">Mes notifications</h2>
                {wallet.notifications.length === 0 ? <p className="text-[#8a8580] text-sm mt-5">Aucune notification pour le moment.</p> : (
                  <div className="mt-5 divide-y divide-black/10">{wallet.notifications.map(n => (
                    <div key={n.id} className="py-4">
                      <div className="flex justify-between gap-3"><p className="text-sm font-semibold">{n.title}</p>{!n.read_at && <button className="text-[#a94639] text-xs" disabled={busy} onClick={() => act("read",{id:n.id})}>Marquer lu</button>}</div>
                      <p className="text-[#77726d] text-sm mt-1 leading-relaxed">{n.message}</p><p className="text-[#99938e] text-xs mt-2">{date(n.created_at)}</p>
                    </div>
                  ))}</div>
                )}
              </div>
            </section>
            <section className="mt-6 rounded-3xl bg-white border border-black/10 p-7 flex flex-wrap justify-between gap-5 items-center">
              <div><h2 className="text-lg font-bold">Offres et nouveautés</h2><p className="text-sm text-[#77726d] mt-2">Recevoir des nouvelles Caractère par e-mail (désactivé par défaut).</p></div>
              <label className="flex gap-3 items-center text-sm font-medium">
                <input type="checkbox" checked={wallet.member.email_opt_in} disabled={busy} onChange={e => act("preferences",{email_opt_in:e.target.checked})} className="w-5 h-5 accent-[#a94639]" />
                {wallet.member.email_opt_in ? "Autorisé" : "Non autorisé"}
              </label>
            </section>
            {wallet.redemptions.length > 0 && <section className="mt-10 mb-4"><h2 className="text-xl font-bold mb-4">Demandes de récompenses</h2><div className="rounded-2xl bg-white border border-black/10 divide-y divide-black/10">{wallet.redemptions.map(x=><div key={x.id} className="flex justify-between gap-4 px-5 py-4 text-sm"><span>{fmt(x.points_spent)} pts • {date(x.requested_at)}</span><strong>{x.status === "pending" ? "En attente" : x.status === "fulfilled" ? "Validée" : "Refusée — points rendus"}</strong></div>)}</div></section>}
          </>
        )}
        <p className="text-xs text-[#8c8680] mt-12">Les avantages demandés sont soumis à validation manuelle. Apple Wallet et les notifications push ne sont pas encore disponibles.</p>
      </section>
    </main>
  );
}
