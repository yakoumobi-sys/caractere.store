import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { supabaseAdmin } from "@/lib/supabase";
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const page = Math.max(
    0,
    Math.min(
      10000,
      Math.floor(Number(req.nextUrl.searchParams.get("page"))) || 0,
    ),
  );
  const { data, error, count } = await supabaseAdmin
    .from("contact_requests")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(page * 50, page * 50 + 49);
  if (error)
    return NextResponse.json(
      { error: "Chargement impossible" },
      { status: 503 },
    );
  return NextResponse.json(
    { requests: data, count },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (
    !body ||
    typeof body.id !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(body.id) ||
    !["nouveau", "contacte", "termine"].includes(body.status)
  )
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  const { data, error } = await supabaseAdmin
    .from("contact_requests")
    .update({ status: body.status })
    .eq("id", body.id)
    .select("id")
    .single();
  if (error || !data)
    return NextResponse.json(
      { error: "Mise à jour impossible" },
      { status: 400 },
    );
  return NextResponse.json({ success: true });
}
