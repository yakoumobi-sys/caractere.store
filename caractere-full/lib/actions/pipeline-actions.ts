"use server";

import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/lib/pipeline";

/**
 * Crée une nouvelle commande en production
 */
export async function createPipelineOrder(formData: FormData) {
  const supabase = createClient();

  // Extraire les données du formulaire
  const contactId = formData.get("contact_id") as string;
  const clientNewName = formData.get("client_new_name") as string;
  const clientNewPhone = formData.get("client_new_phone") as string;
  const clientNewType = formData.get("client_new_type") as string;
  const technique = formData.get("technique") as string;
  const itemsJson = formData.get("items_json") as string;
  const amountPaid = formData.get("amount_paid") as string;
  const logoPlacement = formData.get("logo_placement") as string;
  const logoSource = formData.get("logo_source") as string;
  const logoSourceValue = formData.get("logo_source_value") as string;

  // Déterminer le contact
  let finalContactId = contactId;
  let contactName = clientNewName;

  if (clientNewName) {
    // Créer un nouveau contact
    const { data: newContact, error: contactError } = await supabase
      .from("contacts")
      .insert({
        name: clientNewName,
        phone: clientNewPhone,
        contact_type: clientNewType,
      })
      .select("id")
      .single();

    if (contactError) {
      return { error: `Erreur création contact: ${contactError.message}` };
    }

    finalContactId = newContact.id;
  } else if (contactId) {
    // Récupérer le nom du contact existant
    const { data: contact, error: fetchError } = await supabase
      .from("contacts")
      .select("name")
      .eq("id", contactId)
      .single();

    if (fetchError) {
      return { error: `Contact non trouvé: ${fetchError.message}` };
    }

    contactName = contact.name;
  }

  // Créer la commande
  const { data: order, error: orderError } = await supabase
    .from("pipeline_orders")
    .insert({
      contact_id: finalContactId,
      contact_name: contactName,
      technique,
      amount_paid: amountPaid ? parseFloat(amountPaid) : 0,
    })
    .select("id, number")
    .single();

  if (orderError) {
    return { error: `Erreur création commande: ${orderError.message}` };
  }

  // Ajouter les articles
  const items = itemsJson ? JSON.parse(itemsJson) : [];
  if (items.length > 0) {
    const itemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_name: item.product_name,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("pipeline_order_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Erreur ajout articles:", itemsError);
    }
  }

  // Ajouter les infos d'impression si technique != aucune
  if (technique !== "aucune") {
    const { error: printError } = await supabase.from("pipeline_order_prints").insert({
      order_id: order.id,
      placement: logoPlacement,
      text_content: logoSourceValue,
    });

    if (printError) {
      console.error("Erreur ajout impression:", printError);
    }
  }

  return { orderId: order.id, orderNumber: order.number };
}

/**
 * Avance une commande au statut suivant
 */
export async function advancePipelineOrder(orderId: string, nextStatus: OrderStatus) {
  const supabase = createClient();

  // Mettre à jour le statut
  const { error } = await supabase
    .from("pipeline_orders")
    .update({ status: nextStatus })
    .eq("id", orderId);

  if (error) {
    return { error: `Erreur mise à jour: ${error.message}` };
  }

  return { success: true };
}

/**
 * Attribue une commande à un employé
 */
export async function assignPipelineOrder(orderId: string, employeeId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("pipeline_orders")
    .update({ assigned_to: employeeId })
    .eq("id", orderId);

  if (error) {
    return { error: `Erreur attribution: ${error.message}` };
  }

  return { success: true };
}

/**
 * Confirme la livraison Yalidine et le paiement
 */
export async function confirmDeliveryAndPayment(orderId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("pipeline_orders")
    .update({
      delivery_confirmed_at: new Date().toISOString(),
      status: "payee",
      paid_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { error: `Erreur confirmation: ${error.message}` };
  }

  return { success: true };
}
