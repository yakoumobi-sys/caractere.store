import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";
const respond = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
const validId = (text: unknown): text is string => typeof text === "string" && /^[0-9a-f-]{36}$/i.test(text);

async function findUser(email: string) {
  // Supabase Auth is authoritative; never match by an unverified order phone alone.
  for (let page = 1; page <= 30; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error("Recherche des comptes indisponible.");
    const match = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < 1000) break;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const [members, requests, rewards, orders, purchases] = await Promise.all([
    supabaseAdmin.from("privilege_members").select("user_id,balance,lifetime_earned,email_opt_in,joined_at").order("joined_at", { ascending: false }).limit(150),
    supabaseAdmin.from("privilege_redemptions").select("id,user_id,reward_id,points_spent,status,requested_at").order("requested_at", { ascending: false }).limit(100),
    supabaseAdmin.from("privilege_rewards").select("id,title,cost_points,active"),
    supabaseAdmin.from("commandes").select("id,reference,nom_client,statut,prix_total,email").eq("statut", "termine").order("created_at", { ascending: false }).limit(50),
    supabaseAdmin.from("privilege_transactions").select("user_id").in("kind", ["purchase", "offline"]).limit(10000),
  ]);
  if (members.error || requests.error || rewards.error || orders.error || purchases.error) return respond({ error: "Données administrateur indisponibles." }, 503);
  const purchaseCount = new Map<string, number>();
  for (const row of purchases.data || []) purchaseCount.set(row.user_id, (purchaseCount.get(row.user_id) || 0) + 1);
  const userMap: Record<string, { email: string; name: string; phone: string }> = {};
  try {
    for (let page = 1; page <= 30; page++) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) break;
      for (const u of data.users) if (u.email) userMap[u.id] = {
        email: u.email,
        name: typeof u.user_metadata?.full_name === "string" ? u.user_metadata.full_name : "",
        phone: typeof u.user_metadata?.phone === "string" ? u.user_metadata.phone : "",
      };
      if (data.users.length < 1000) break;
    }
  } catch (e) { console.error("[privilege/admin] auth list failed"); }
  return respond({
    members: (members.data || []).map(x => ({
      ...x, email: userMap[x.user_id]?.email || "",
      name: userMap[x.user_id]?.name || "",
      phone: userMap[x.user_id]?.phone || "",
      purchase_count: purchaseCount.get(x.user_id) || 0,
    })),
    requests: (requests.data || []).map(x => ({ ...x, email: userMap[x.user_id]?.email || "" })),
    rewards: rewards.data || [],
    orders: orders.data || [],
  });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  let body: any;
  try { body = await req.json(); } catch { return respond({ error: "Requête invalide." }, 400); }
  if (!body || typeof body.action !== "string") return respond({ error: "Action invalide." }, 400);
  try {
    if (body.action === "create_member") {
      const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const phone = typeof body.phone === "string" ? body.phone.trim() : "";
      if (name.length < 2 || name.length > 100) return respond({ error: "Nom complet invalide (2 à 100 caractères)." }, 400);
      if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond({ error: "E-mail client invalide." }, 400);
      if (phone.length > 25 || (phone && !/^[+0-9 ()-]{6,25}$/.test(phone))) return respond({ error: "Téléphone invalide." }, 400);
      let account = await findUser(email);
      let invited = false;
      if (!account) {
        const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          data: { full_name: name, ...(phone ? { phone } : {}) },
        });
        if (error || !data.user) return respond({ error: "Invitation impossible. Vérifiez la configuration d'envoi des e-mails." }, 503);
        account = data.user;
        invited = true;
      } else {
        // L'administrateur peut personnaliser une carte existante sans créer de doublon.
        const { error } = await supabaseAdmin.auth.admin.updateUserById(account.id, {
          user_metadata: { ...account.user_metadata, full_name: name, ...(phone ? { phone } : {}) },
        });
        if (error) return respond({ error: "Impossible de mettre à jour le nom de ce client." }, 503);
      }
      const { error } = await supabaseAdmin.from("privilege_members")
        .upsert({ user_id: account.id }, { onConflict: "user_id", ignoreDuplicates: true });
      if (error) return respond({ error: "Compte créé, mais activation de la carte impossible. Réessayez avec la même adresse." }, 503);
      return respond({ success: true, invited, name, email });
    }
    if (body.action === "review") {
      if (!validId(body.id) || typeof body.approved !== "boolean") return respond({ error: "Décision invalide." }, 400);
      const { error } = await supabaseAdmin.rpc("privilege_review_redemption", { p_request_id: body.id, p_approved: body.approved });
      if (error) return respond({ error: error.message }, 400);
      return respond({ success: true });
    }

    if (!["credit_order", "credit_offline"].includes(body.action)) return respond({ error: "Action inconnue." }, 400);
    if (body.confirmed !== true) return respond({ error: "Confirmez la réception du paiement et l'identité du client." }, 400);
    if (typeof body.email !== "string" || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return respond({ error: "E-mail client invalide." }, 400);
    const account = await findUser(body.email.trim());
    if (!account) return respond({ error: "Aucun compte client Caractère à cet e-mail. Demandez-lui de créer un compte sur /auth/signup." }, 404);

    if (body.action === "credit_order") {
      if (typeof body.reference !== "string" || body.reference.length < 3 || body.reference.length > 100) return respond({ error: "Référence de commande invalide." }, 400);
      const { data: order, error: orderError } = await supabaseAdmin.from("commandes")
        .select("id,statut,prix_total,user_id,email").eq("reference", body.reference.trim()).maybeSingle();
      if (orderError || !order) return respond({ error: "Commande introuvable." }, 404);
      if (order.email && order.email.toLowerCase() !== account.email?.toLowerCase()) return respond({ error: "L'e-mail associé à la commande ne correspond pas. Faites vérifier l'identité avant le crédit." }, 400);
      const { data, error } = await supabaseAdmin.rpc("privilege_credit_order", { p_user_id: account.id, p_order_id: order.id });
      if (error) return respond({ error: error.message }, 400);
      return respond({ success: true, points: data });
    }
    if (typeof body.reference !== "string" || body.reference.trim().length < 4 || body.reference.length > 90) return respond({ error: "Référence facture requise (unique)." }, 400);
    if (!Number.isSafeInteger(body.amount) || body.amount < 100 || body.amount > 100000000) return respond({ error: "Montant payé invalide." }, 400);
    const { data, error } = await supabaseAdmin.rpc("privilege_credit_offline", {
      p_user_id: account.id, p_amount: body.amount, p_reference: body.reference.trim(),
    });
    if (error) return respond({ error: error.message }, 400);
    return respond({ success: true, points: data });
  } catch (e) {
    console.error("[privilege/admin] action failed", e instanceof Error ? e.message : "unknown");
    return respond({ error: "Opération momentanément indisponible." }, 503);
  }
}
