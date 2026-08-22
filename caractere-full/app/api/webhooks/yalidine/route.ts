/**
 * API Route: POST /api/webhooks/yalidine
 *
 * Reçoit les notifications Yalidine et met à jour l'historique de suivi
 */

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

// Types Yalidine
interface YalidineWebhookPayload {
  tracking_number: string;
  parcel_number: string;
  status: string; // pending, in_transit, delivered, failed, cancelled
  status_ar?: string; // Statut en arabe
  wilaya?: string;
  location?: string;
  updated_at?: string;
  delivery_type?: number;
  notes?: string;
  timestamp?: number;
}

/**
 * Vérifier la signature du webhook (optionnel mais recommandé)
 */
function verifyWebhookSignature(payload: string, signature: string): boolean {
  // TODO: Implémenter la vérification avec votre clé secrète Yalidine
  // Pour le moment, on accepte tous les webhooks (à sécuriser en production!)
  return true;
}

export async function POST(req: Request) {
  const supabase = createClient();

  try {
    // Récupérer le body brut pour vérifier la signature
    const rawBody = await req.text();
    const body: YalidineWebhookPayload = JSON.parse(rawBody);

    // Vérifier la signature (optionnel)
    const signature = headers().get("x-yalidine-signature");
    if (signature && !verifyWebhookSignature(rawBody, signature)) {
      console.warn("❌ Signature webhook invalide");
      return Response.json(
        { error: "Signature invalide" },
        { status: 401 }
      );
    }

    console.log("📦 Webhook Yalidine reçu:", {
      tracking: body.tracking_number,
      status: body.status,
      wilaya: body.wilaya,
    });

    // 1. Trouver la commande avec ce numéro de suivi
    const { data: order, error: orderError } = await supabase
      .from("pipeline_orders")
      .select("id, yalidine_status")
      .eq("yalidine_tracking", body.tracking_number)
      .single();

    if (orderError || !order) {
      console.warn("⚠️ Commande non trouvée pour:", body.tracking_number);
      return Response.json(
        { warning: "Commande non trouvée" },
        { status: 200 } // Retourner 200 pour que Yalidine ne retry pas
      );
    }

    // 2. Enregistrer dans l'historique de suivi
    const { error: historyError } = await supabase
      .from("yalidine_tracking_history")
      .insert({
        order_id: order.id,
        tracking_number: body.tracking_number,
        parcel_number: body.parcel_number,
        new_status: body.status,
        status_ar: body.status_ar,
        wilaya: body.wilaya,
        location: body.location,
        updated_at: body.updated_at || new Date().toISOString(),
      });

    if (historyError) {
      console.error("❌ Erreur insertion historique:", historyError);
      return Response.json(
        { error: "Erreur enregistrement historique" },
        { status: 500 }
      );
    }

    // 3. Mettre à jour le statut de la commande
    if (body.status !== order.yalidine_status) {
      const { error: updateError } = await supabase
        .from("pipeline_orders")
        .update({
          yalidine_status: body.status,
          yalidine_updated_at: body.updated_at || new Date().toISOString(),
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("❌ Erreur mise à jour commande:", updateError);
        return Response.json(
          { error: "Erreur mise à jour commande" },
          { status: 500 }
        );
      }

      console.log(`✅ Statut mis à jour: ${order.yalidine_status} → ${body.status}`);

      // 4. Si livré, mettre à jour la commande automatiquement
      if (body.status === "delivered") {
        await supabase
          .from("pipeline_orders")
          .update({
            status: "payee",
            delivery_confirmed_at: new Date().toISOString(),
            paid_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        console.log("🎉 Commande marquée comme livrée et payée");
      }

      // 5. Si échec, notifier
      if (body.status === "failed") {
        console.error("❌ Livraison échouée pour commande:", order.id);
      }
    }

    // Répondre à Yalidine
    return Response.json({
      success: true,
      message: `Webhook traité: ${body.tracking_number}`,
      status: body.status,
    });
  } catch (error) {
    console.error("❌ Erreur webhook Yalidine:", error);
    return Response.json(
      {
        error: `Erreur: ${error instanceof Error ? error.message : "Inconnue"}`,
      },
      { status: 500 }
    );
  }
}

/**
 * GET pour tester que le webhook est accessible
 */
export async function GET() {
  return Response.json({
    message: "✅ Webhook Yalidine est actif",
    endpoint: "/api/webhooks/yalidine",
    methods: ["POST"],
  });
}
