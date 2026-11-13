import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function currentUser(req: NextRequest) {
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  return error ? null : data.user;
}
function respond(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(req: NextRequest) {
  const user = await currentUser(req);
  if (!user) return respond({ error: "Connectez-vous pour voir votre carte." }, 401);
  const [memberResult, rewardsResult, pointsResult, requestsResult, notificationsResult, purchaseCountResult] = await Promise.all([
    supabaseAdmin.from("privilege_members").select("balance,lifetime_earned,email_opt_in,joined_at").eq("user_id", user.id).maybeSingle(),
    supabaseAdmin.from("privilege_rewards").select("id,title,description,cost_points").eq("active", true).order("cost_points"),
    supabaseAdmin.from("privilege_transactions").select("id,kind,delta,description,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
    supabaseAdmin.from("privilege_redemptions").select("id,reward_id,points_spent,status,requested_at").eq("user_id", user.id).order("requested_at", { ascending: false }).limit(30),
    supabaseAdmin.from("privilege_notifications").select("id,title,message,read_at,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
    supabaseAdmin.from("privilege_transactions").select("id", { count: "exact", head: true })
      .eq("user_id", user.id).in("kind", ["purchase", "offline"]),
  ]);
  const errors = [memberResult.error, rewardsResult.error, pointsResult.error, requestsResult.error, notificationsResult.error, purchaseCountResult.error].filter(Boolean);
  if (errors.length) {
    console.error("[privilege] database read error", errors[0]?.code);
    return respond({ error: "Votre carte est momentanément indisponible." }, 503);
  }
  return respond({
    member: memberResult.data,
    purchase_count: purchaseCountResult.count || 0,
    rewards: rewardsResult.data || [],
    transactions: pointsResult.data || [],
    redemptions: requestsResult.data || [],
    notifications: notificationsResult.data || [],
  });
}

export async function POST(req: NextRequest) {
  const user = await currentUser(req);
  if (!user) return respond({ error: "Connexion requise." }, 401);
  let payload: any;
  try { payload = await req.json(); } catch { return respond({ error: "Requête invalide." }, 400); }
  if (!payload || typeof payload.action !== "string") return respond({ error: "Action invalide." }, 400);

  if (payload.action === "join") {
    const { error } = await supabaseAdmin.from("privilege_members").upsert(
      { user_id: user.id },
      { onConflict: "user_id", ignoreDuplicates: true }
    );
    if (error) return respond({ error: "Impossible d'activer la carte." }, 503);
    // Rattrapage idempotent des commandes déjà terminées et payées du membre.
    // La fonction PostgreSQL rejette les doubles crédits.
    const { data: eligible } = await supabaseAdmin.from("commandes")
      .select("id").eq("user_id", user.id).eq("statut", "termine")
      .not("paid_confirmed_at", "is", null).limit(100);
    for (const order of eligible || []) {
      const result = await supabaseAdmin.rpc("privilege_credit_order", { p_user_id: user.id, p_order_id: order.id });
      if (result.error && result.error.code !== "23505") console.error("[privilege] credit after join", result.error.code);
    }
    return respond({ success: true });
  }

  if (payload.action === "redeem") {
    if (typeof payload.reward_id !== "string" || !/^[0-9a-f-]{36}$/i.test(payload.reward_id))
      return respond({ error: "Récompense invalide." }, 400);
    const { data, error } = await supabaseAdmin.rpc("privilege_redeem", {
      p_user_id: user.id, p_reward_id: payload.reward_id,
    });
    if (error) return respond({ error: error.message }, 400);
    return respond({ success: true, request_id: data });
  }
  if (payload.action === "preferences") {
    if (typeof payload.email_opt_in !== "boolean") return respond({ error: "Choix invalide." }, 400);
    const { data, error } = await supabaseAdmin.from("privilege_members")
      .update({ email_opt_in: payload.email_opt_in, updated_at: new Date().toISOString() })
      .eq("user_id", user.id).select("user_id").maybeSingle();
    if (error || !data) return respond({ error: "Activez d'abord votre carte." }, 400);
    return respond({ success: true });
  }
  if (payload.action === "read") {
    if (typeof payload.id !== "string" || !/^[0-9a-f-]{36}$/i.test(payload.id)) return respond({ error: "Notification invalide." }, 400);
    const { error } = await supabaseAdmin.from("privilege_notifications")
      .update({ read_at: new Date().toISOString() }).eq("id", payload.id).eq("user_id", user.id);
    if (error) return respond({ error: "Mise à jour impossible." }, 503);
    return respond({ success: true });
  }
  return respond({ error: "Action inconnue." }, 400);
}
