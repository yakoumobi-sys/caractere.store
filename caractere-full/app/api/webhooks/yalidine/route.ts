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
    // Récupérer l'URL pour vérifier les query params
    const url = new URL(req.url);
    const crcToken = url.searchParams.get("crc_token");

    // ✅ VALIDATION YALIDINE: Répondre avec le crc_token (depuis query param ou body)
    if (crcToken) {
      console.log("✅ Validation webhook Yalidine reçue (query param)");
      return Response.json({ crc_token: crcToken });
    }

    // Récupérer le body brut
    const rawBody = await req.text();
    let body: any = {};

    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.warn("Impossible de parser le body JSON");
    }

    // Vérifier aussi dans le body
    if (body.crc_token) {
      console.log("✅ Validation webhook Yalidine reçue (body)");
      return Response.json({ crc_token: body.crc_token });
    }

    // Typer le body correctement
    const webhookPayload = body as YalidineWebhookPayload;

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
      tracking: webhookPayload.tracking_number,
      status: webhookPayload.status,
      wilaya: webhookPayload.wilaya,
    });

    // 1. Trouver la commande avec ce numéro de suivi
    const { data: order, error: orderError } = await supabase
      .from("pipeline_orders")
      .select("id, yalidine_status")
      .eq("yalidine_tracking", webhookPayload.tracking_number)
      .single();

    if (orderError || !order) {
      console.warn("⚠️ Commande non trouvée pour:", webhookPayload.tracking_number);
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
        tracking_number: webhookPayload.tracking_number,
        parcel_number: webhookPayload.parcel_number,
        new_status: webhookPayload.status,
        status_ar: webhookPayload.status_ar,
        wilaya: webhookPayload.wilaya,
        location: webhookPayload.location,
        updated_at: webhookPayload.updated_at || new Date().toISOString(),
      });

    if (historyError) {
      console.error("❌ Erreur insertion historique:", historyError);
      return Response.json(
        { error: "Erreur enregistrement historique" },
        { status: 500 }
      );
    }

    // 3. Mettre à jour le statut de la commande
    if (webhookPayload.status !== order.yalidine_status) {
      const { error: updateError } = await supabase
        .from("pipeline_orders")
        .update({
          yalidine_status: webhookPayload.status,
          yalidine_updated_at: webhookPayload.updated_at || new Date().toISOString(),
        })
        .eq("id", order.id);

      if (updateError) {
        console.error("❌ Erreur mise à jour commande:", updateError);
        return Response.json(
          { error: "Erreur mise à jour commande" },
          { status: 500 }
        );
      }

      console.log(`✅ Statut mis à jour: ${order.yalidine_status} → ${webhookPayload.status}`);

      // 4. Si livré, mettre à jour la commande automatiquement
      if (webhookPayload.status === "delivered") {
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
      if (webhookPayload.status === "failed") {
        console.error("❌ Livraison échouée pour commande:", order.id);
      }
    }

    // Répondre à Yalidine
    return Response.json({
      success: true,
      message: `Webhook traité: ${webhookPayload.tracking_number}`,
      status: webhookPayload.status,
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
 * GET pour tester que le webhook est accessible ou valider avec crc_token
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const crcToken = url.searchParams.get("crc_token");

  // Si c'est une validation avec crc_token
  if (crcToken) {
    console.log("✅ Validation webhook Yalidine reçue via GET");
    return Response.json({ crc_token: crcToken });
  }

  // Sinon, juste tester que le webhook est actif
  return Response.json({
    message: "✅ Webhook Yalidine est actif",
    endpoint: "/api/webhooks/yalidine",
    methods: ["GET", "POST"],
  });
}
