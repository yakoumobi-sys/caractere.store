"use server";

import { createClient } from "@/lib/supabase/server";
import { getYalidineClient, type YalidineShipment } from "@/lib/yalidine/client";

/**
 * Crée un envoi sur Yalidine et l'associe à une commande
 */
export async function createYalidineShipment(
  orderId: string,
  shipmentData: Partial<YalidineShipment>
) {
  const supabase = createClient();

  try {
    // Récupérer les infos de la commande
    const { data: order, error: orderError } = await supabase
      .from("pipeline_orders")
      .select("*, contacts(name, phone, email)")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return { error: "Commande non trouvée" };
    }

    // Préparer les données pour Yalidine
    const yalidineShipment: YalidineShipment = {
      delivery_type: shipmentData.delivery_type || 1, // 1 = Yalidine, 2 = Alger Livraison
      pickup_wilaya: shipmentData.pickup_wilaya || "Alger",
      delivery_wilaya: shipmentData.delivery_wilaya || "Alger",
      client_name: order.contact_name,
      client_phone: order.contacts?.phone || "",
      client_email: order.contacts?.email,
      reference: order.number,
      price: order.amount_paid || 0,
      shipping_price: shipmentData.shipping_price || 0,
      notes: shipmentData.notes,
      is_cod: shipmentData.is_cod !== false, // Paiement à la livraison par défaut
    };

    // Créer l'envoi sur Yalidine
    const yalidineClient = getYalidineClient();
    const yalidineResponse = await yalidineClient.createShipment(yalidineShipment);

    if (!yalidineResponse.status || !yalidineResponse.data) {
      return {
        error: `Erreur Yalidine: ${yalidineResponse.message}`,
        details: yalidineResponse.error,
      };
    }

    // Enregistrer les infos Yalidine dans la commande
    const { error: updateError } = await supabase
      .from("pipeline_orders")
      .update({
        yalidine_tracking: yalidineResponse.data.tracking_number,
        yalidine_parcel: yalidineResponse.data.parcel_number,
        yalidine_status: "pending",
        yalidine_created_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      return { error: `Erreur enregistrement: ${updateError.message}` };
    }

    return {
      success: true,
      trackingNumber: yalidineResponse.data.tracking_number,
      parcelNumber: yalidineResponse.data.parcel_number,
      totalPrice: yalidineResponse.data.total_price,
    };
  } catch (error) {
    return {
      error: `Erreur: ${error instanceof Error ? error.message : "Inconnue"}`,
    };
  }
}

/**
 * Tracker un envoi Yalidine
 */
export async function trackYalidineShipment(orderId: string) {
  const supabase = createClient();

  try {
    // Récupérer le numéro de suivi
    const { data: order, error: orderError } = await supabase
      .from("pipeline_orders")
      .select("yalidine_tracking, yalidine_parcel, yalidine_status")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return { error: "Commande non trouvée" };
    }

    if (!order.yalidine_tracking) {
      return { error: "Pas d'envoi Yalidine pour cette commande" };
    }

    // Tracker sur Yalidine
    const yalidineClient = getYalidineClient();
    const trackingResponse = await yalidineClient.trackShipment(
      order.yalidine_tracking
    );

    if (!trackingResponse.status || !trackingResponse.data) {
      return {
        error: `Erreur tracking: ${trackingResponse.message}`,
      };
    }

    // Mettre à jour le statut
    const { error: updateError } = await supabase
      .from("pipeline_orders")
      .update({
        yalidine_status: trackingResponse.data.status,
        yalidine_updated_at: trackingResponse.data.updated_at,
      })
      .eq("id", orderId);

    if (updateError) {
      console.error("Erreur mise à jour:", updateError);
    }

    return {
      success: true,
      tracking: trackingResponse.data.tracking_number,
      status: trackingResponse.data.status,
      statusAr: trackingResponse.data.status_ar,
      wilaya: trackingResponse.data.wilaya,
      location: trackingResponse.data.location,
      updatedAt: trackingResponse.data.updated_at,
    };
  } catch (error) {
    return {
      error: `Erreur: ${error instanceof Error ? error.message : "Inconnue"}`,
    };
  }
}

/**
 * Récupère l'historique de suivi complet
 */
export async function getYalidineHistory(orderId: string) {
  const supabase = createClient();

  const { data: order, error } = await supabase
    .from("pipeline_orders")
    .select(
      "yalidine_tracking, yalidine_parcel, yalidine_status, yalidine_created_at, yalidine_updated_at"
    )
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return { error: "Commande non trouvée" };
  }

  return {
    tracking: order.yalidine_tracking,
    parcel: order.yalidine_parcel,
    status: order.yalidine_status,
    createdAt: order.yalidine_created_at,
    updatedAt: order.yalidine_updated_at,
  };
}

/**
 * Annule un envoi Yalidine
 */
export async function cancelYalidineShipment(orderId: string) {
  const supabase = createClient();

  try {
    const { data: order, error: orderError } = await supabase
      .from("pipeline_orders")
      .select("yalidine_tracking")
      .eq("id", orderId)
      .single();

    if (orderError || !order || !order.yalidine_tracking) {
      return { error: "Envoi Yalidine non trouvé" };
    }

    const yalidineClient = getYalidineClient();
    const cancelResponse = await yalidineClient.cancelShipment(
      order.yalidine_tracking
    );

    if (!cancelResponse.status) {
      return { error: `Erreur annulation: ${cancelResponse.message}` };
    }

    // Mettre à jour le statut
    await supabase
      .from("pipeline_orders")
      .update({ yalidine_status: "cancelled" })
      .eq("id", orderId);

    return { success: true, message: "Envoi annulé" };
  } catch (error) {
    return {
      error: `Erreur: ${error instanceof Error ? error.message : "Inconnue"}`,
    };
  }
}
