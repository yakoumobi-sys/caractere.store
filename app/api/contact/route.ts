import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { publicApiLimiter, getIP } from "@/lib/rate-limit";

// Bounded, per-instance fallback when optional Upstash is not configured.
const attempts = new Map<string, { count: number; expires: number }>();
function localLimit(ip: string) {
  const now = Date.now();
  attempts.forEach((value, key) => {
    if (value.expires < now) attempts.delete(key);
  });
  const value = attempts.get(ip);
  if (value && value.count >= 5) return false;
  if (!value && attempts.size >= 5000) return false;
  attempts.set(ip, {
    count: (value?.count ?? 0) + 1,
    expires: value?.expires ?? now + 3600000,
  });
  return true;
}
function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[c]!,
  );
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    if (raw.length > 12000)
      return NextResponse.json(
        { error: "Demande trop volumineuse" },
        { status: 413 },
      );
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }
    if (!body || Array.isArray(body) || typeof body !== "object")
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    const nom = typeof body.nom === "string" ? body.nom.trim() : "";
    const telephone =
      typeof body.telephone === "string" ? body.telephone.trim() : "";
    if (
      nom.length < 2 ||
      nom.length > 100 ||
      !/^[+0-9 ()-]{8,20}$/.test(telephone) ||
      telephone.replace(/\D/g, "").length < 8
    )
      return NextResponse.json(
        { error: "Nom et téléphone valides requis" },
        { status: 400 },
      );
    const payload: Record<string, string> = {};
    for (const key of [
      "source",
      "domaine",
      "produit",
      "quantite",
      "details",
      "logo",
      "entreprise",
      "email",
      "newsletter",
    ]) {
      if (body[key] != null) {
        if (typeof body[key] !== "string" && typeof body[key] !== "number")
          return NextResponse.json(
            { error: "Champ invalide" },
            { status: 400 },
          );
        const value = String(body[key]).trim();
        if (value.length > (key === "details" ? 2000 : 500))
          return NextResponse.json(
            { error: "Champ trop long" },
            { status: 400 },
          );
        payload[key] = value;
      }
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
      key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key)
      return NextResponse.json(
        { error: "Service indisponible. Contactez-nous sur WhatsApp." },
        { status: 503 },
      );
    if (payload.logo) {
      try {
        const logo = new URL(payload.logo);
        if (
          logo.origin !== new URL(url).origin ||
          !logo.pathname.startsWith("/storage/v1/object/public/image/logos/")
        )
          throw new Error("logo");
      } catch {
        return NextResponse.json(
          { error: "Fichier invalide" },
          { status: 400 },
        );
      }
    }
    const ip = getIP(req).split(",")[0].trim();
    const allowed =
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
        ? (await publicApiLimiter.limit(ip)).success
        : localLimit(ip);
    if (!allowed)
      return NextResponse.json(
        { error: "Trop de demandes. Réessayez plus tard." },
        { status: 429 },
      );
    const requestId = body.request_id ?? randomUUID();
    if (
      typeof requestId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        requestId,
      )
    )
      return NextResponse.json(
        { error: "Référence invalide" },
        { status: 400 },
      );
    const db = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await db
      .from("contact_requests")
      .upsert(
        { request_id: requestId, nom, telephone, payload },
        { onConflict: "request_id", ignoreDuplicates: true },
      )
      .select("id");
    if (error) {
      console.error("Quote storage failed:", error.code);
      return NextResponse.json(
        { error: "Enregistrement impossible. Réessayez." },
        { status: 503 },
      );
    }
    // Save first. Notification failure never loses the request or creates a false failure.
    if (data?.length && process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL) {
      try {
        const { error: mailError } = await new Resend(
          process.env.RESEND_API_KEY,
        ).emails.send({
          from:
            process.env.CONTACT_FROM_EMAIL ||
            "Caractère Store <contact@caracterestore.dz>",
          to: process.env.ADMIN_EMAIL,
          subject: `Demande de devis — ${nom}`,
          html: `<p>Nouvelle demande enregistrée dans votre espace admin, rubrique Devis.</p><pre>${escapeHtml(JSON.stringify({ reference: requestId, nom, telephone, ...payload }, null, 2))}</pre>`,
        });
        if (mailError)
          console.error("Quote notification failed:", mailError.name);
      } catch {
        console.error("Quote saved; email notification unavailable");
      }
    }
    return NextResponse.json({ success: true, reference: requestId });
  } catch {
    return NextResponse.json(
      {
        error:
          "Service indisponible. Réessayez ou contactez-nous sur WhatsApp.",
      },
      { status: 503 },
    );
  }
}
