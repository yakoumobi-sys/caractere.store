"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import * as crypto from "crypto";

/**
 * Hash un mot de passe avec bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  // Utiliser crypto natif pour un hash simple
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Vérifier un mot de passe
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [salt, storedHash] = hash.split(":");
  const computedHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return computedHash === storedHash;
}

/**
 * Générer un token de session
 */
export async function generateSessionToken(): Promise<string> {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Récupérer la liste des employés actifs
 */
export async function getEmployeesList() {
  const supabase = createClient();

  try {
    const { data: employees, error } = await supabase
      .from("employees")
      .select("id, first_name, last_name, is_active")
      .eq("is_active", true)
      .order("first_name", { ascending: true });

    if (error) {
      return { error: "Erreur lors de la récupération des employés" };
    }

    return {
      success: true,
      employees: employees || [],
    };
  } catch (error) {
    console.error("Get employees error:", error);
    return { error: "Erreur serveur" };
  }
}

/**
 * Login employé - Première connexion ou connexion régulière
 */
export async function loginEmployee(
  firstName: string,
  lastName: string,
  password: string,
  isFirstLogin: boolean = false
) {
  const supabase = createClient();

  try {
    // 1. Trouver l'employé par nom
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .select("id, first_name, last_name, email, password_hash, password_set_at, is_active")
      .eq("first_name", firstName)
      .eq("last_name", lastName)
      .single();

    if (employeeError || !employee) {
      return { error: "Employé non trouvé ou mot de passe incorrect" };
    }

    if (!employee.is_active) {
      return { error: "Ce compte est désactivé" };
    }

    // 2. Si première connexion
    if (isFirstLogin) {
      if (employee.password_set_at) {
        return { error: "Ce compte est déjà activé" };
      }

      // Créer le hash du password
      const passwordHash = await hashPassword(password);

      // Mettre à jour le password
      const { error: updateError } = await supabase
        .from("employees")
        .update({
          password_hash: passwordHash,
          password_set_at: new Date().toISOString(),
        })
        .eq("id", employee.id);

      if (updateError) {
        return { error: "Erreur lors de la création du mot de passe" };
      }

      // Créer une session
      return await createSession(employee.id, employee.email);
    }

    // 3. Login régulier - vérifier le password
    if (!employee.password_hash) {
      return { error: "Ce compte n'est pas activé. Veuillez créer un mot de passe." };
    }

    const isPasswordValid = await verifyPassword(password, employee.password_hash);
    if (!isPasswordValid) {
      return { error: "Email ou mot de passe incorrect" };
    }

    // Mettre à jour last_login
    await supabase
      .from("employees")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", employee.id);

    // Créer une session
    return await createSession(employee.id, employee.email);
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Erreur lors de la connexion" };
  }
}

/**
 * Créer une session
 */
export async function createSession(employeeId: string, email: string) {
  const supabase = createClient();

  try {
    const token = await generateSessionToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

    const { error: sessionError } = await supabase
      .from("employee_sessions")
      .insert({
        employee_id: employeeId,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (sessionError) {
      return { error: "Erreur lors de la création de la session" };
    }

    // Définir le cookie de session
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return {
      success: true,
      token,
      message: "Connexion réussie",
    };
  } catch (error) {
    console.error("Session error:", error);
    return { error: "Erreur lors de la création de la session" };
  }
}

/**
 * Vérifier la session courante
 */
export async function verifySession(token: string) {
  const supabase = createClient();

  try {
    const { data: session, error } = await supabase
      .from("employee_sessions")
      .select("employee_id, expires_at, employees(id, first_name, last_name, email, department)")
      .eq("token", token)
      .single();

    if (error || !session) {
      return { error: "Session invalide" };
    }

    // Vérifier l'expiration
    if (new Date(session.expires_at) < new Date()) {
      return { error: "Session expirée" };
    }

    return {
      success: true,
      employee: session.employees,
    };
  } catch (error) {
    console.error("Session verify error:", error);
    return { error: "Erreur lors de la vérification" };
  }
}

/**
 * Logout
 */
export async function logoutEmployee(token: string) {
  const supabase = createClient();

  try {
    await supabase.from("employee_sessions").delete().eq("token", token);

    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { error: "Erreur lors de la déconnexion" };
  }
}

/**
 * Changer le mot de passe
 */
export async function changePassword(
  employeeId: string,
  currentPassword: string,
  newPassword: string
) {
  const supabase = createClient();

  try {
    const { data: employee } = await supabase
      .from("employees")
      .select("password_hash")
      .eq("id", employeeId)
      .single();

    if (!employee?.password_hash) {
      return { error: "Impossible de vérifier le mot de passe actuel" };
    }

    const isValid = await verifyPassword(currentPassword, employee.password_hash);
    if (!isValid) {
      return { error: "Mot de passe actuel incorrect" };
    }

    const newHash = await hashPassword(newPassword);

    const { error } = await supabase
      .from("employees")
      .update({ password_hash: newHash })
      .eq("id", employeeId);

    if (error) {
      return { error: "Erreur lors du changement de mot de passe" };
    }

    return { success: true, message: "Mot de passe changé avec succès" };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "Erreur lors du changement de mot de passe" };
  }
}
