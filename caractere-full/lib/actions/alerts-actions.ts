"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Crée une nouvelle alerte de fourniture
 */
export async function createSupplyAlert(formData: FormData) {
  const supabase = createClient();

  // Récupérer l'employé connecté
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non authentifié" };
  }

  // Récupérer l'ID de l'employé connecté
  const { data: employee } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!employee) {
    return { error: "Employé non trouvé" };
  }

  const alertType = formData.get("alert_type") as string;
  const department = formData.get("department") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const priority = formData.get("priority") as string;

  const { data: alert, error } = await supabase
    .from("supply_alerts")
    .insert({
      alert_type: alertType,
      department,
      title,
      description,
      priority: priority || "normal",
      created_by: employee.id,
    })
    .select("id, number")
    .single();

  if (error) {
    return { error: `Erreur création alerte: ${error.message}` };
  }

  return { alertId: alert.id, alertNumber: alert.number };
}

/**
 * Met à jour une alerte de fourniture
 */
export async function updateSupplyAlert(
  alertId: string,
  updates: {
    status?: string;
    priority?: string;
    assigned_to?: string;
    resolved_at?: string | null;
  }
) {
  const supabase = createClient();

  const updateData: any = { ...updates };

  // Si on marque comme résolu, ajouter resolved_at
  if (updates.status === "resolved" && !updates.resolved_at) {
    updateData.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("supply_alerts")
    .update(updateData)
    .eq("id", alertId);

  if (error) {
    return { error: `Erreur mise à jour: ${error.message}` };
  }

  return { success: true };
}

/**
 * Clôture une alerte
 */
export async function closeSupplyAlert(alertId: string) {
  return updateSupplyAlert(alertId, {
    status: "closed",
    resolved_at: new Date().toISOString(),
  });
}

/**
 * Assigne une alerte à un employé
 */
export async function assignSupplyAlert(alertId: string, employeeId: string) {
  return updateSupplyAlert(alertId, {
    assigned_to: employeeId,
    status: "in_progress",
  });
}
