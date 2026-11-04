import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-auth";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;
  const { data, error } = await supabaseAdmin.from("commandes").select("*").order("created_at", { ascending: false }).limit(1000);
  if (error) return NextResponse.json({ error: "Commandes indisponibles." }, { status: 503 });
  return NextResponse.json(data || [], { headers: { "Cache-Control": "no-store" } });
}
