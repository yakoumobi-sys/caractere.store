"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Récupère les tâches d'un employé
 */
export async function getEmployeeTasks(employeeId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("assigned_to", employeeId)
    .order("due_date", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Met à jour le statut d'une tâche
 */
export async function updateTaskStatus(
  taskId: string,
  status: "todo" | "in_progress" | "completed"
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Crée une nouvelle tâche
 */
export async function createTask(formData: FormData) {
  const supabase = createClient();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const assignedTo = formData.get("assigned_to") as string;
  const priority = formData.get("priority") as string;
  const dueDate = formData.get("due_date") as string;

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "Non authentifié" };
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title,
      description,
      assigned_to: assignedTo,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      created_by: userData.user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Signale une absence pour aujourd'hui
 */
export async function reportAbsence(formData: FormData) {
  const supabase = createClient();

  const employeeId = formData.get("employee_id") as string;
  const justification = formData.get("justification") as string;

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("employee_absences")
    .upsert({
      employee_id: employeeId,
      absence_date: today,
      justification,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Récupère les stats des employés
 */
export async function getEmployeeStats() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("employee_stats")
    .select("*")
    .order("completed_tasks", { ascending: false });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

/**
 * Vérifie si un employé est absent aujourd'hui
 */
export async function checkTodayAbsence(employeeId: string) {
  const supabase = createClient();

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("employee_absences")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("absence_date", today)
    .single();

  if (error && error.code !== "PGRST116") {
    return { error: error.message };
  }

  return { data: data || null };
}
