import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { requireAdmin } from "@/lib/api-auth";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic = "force-dynamic";
const reply = (data: unknown, status = 200) => NextResponse.json(data, {status, headers:{"Cache-Control":"no-store"}});
const cards = () => supabaseAdmin.from("privilege_direct_cards");
const purchases = () => supabaseAdmin.from("privilege_direct_purchases");
const uuid = (v: unknown): v is string => typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
function makeLink() {
 const token = randomBytes(32).toString("hex");
 return {hash:createHash("sha256").update(token).digest("hex"),link:"https://www.caracteredz.com/privilege/card#"+token};
}
async function count(id: string) {
 const r = await purchases().select("id",{head:true,count:"exact"}).eq("card_id",id);
 if(r.error) throw new Error("count");
 return r.count || 0;
}
export async function GET(req: NextRequest) {
 const denied = await requireAdmin(req); if(denied) return denied;
 try {
  const r = await cards().select("id,full_name,phone,created_at,reward_delivered_at").order("created_at",{ascending:false}).limit(500);
  if(r.error) return reply({error:"Cartes indisponibles."},503);
  const rows = await Promise.all((r.data||[]).map(async row=>({...row,purchase_count:await count(row.id)})));
  return reply({cards:rows});
 } catch { return reply({error:"Cartes indisponibles."},503); }
}
export async function POST(req: NextRequest) {
 const denied=await requireAdmin(req); if(denied) return denied;
 try {
  const b=await req.json();
  if(b.action==="create"){
   const name=typeof b.name==="string"?b.name.trim().replace(/\s+/g," "):"";
   const phone=typeof b.phone==="string"?b.phone.trim():"";
   if(name.length<2||name.length>100|| (phone&&!/^[+0-9 ()-]{6,25}$/.test(phone))) return reply({error:"Nom ou téléphone invalide."},400);
   const l=makeLink();
   const r=await cards().insert({full_name:name,phone:phone||null,token_hash:l.hash}).select("id").single();
   if(r.error) return reply({error:"Création impossible."},503);
   return reply({id:r.data.id,link:l.link});
  }
  if(!uuid(b.id)) return reply({error:"Carte invalide."},400);
  const row=await cards().select("id,reward_delivered_at").eq("id",b.id).maybeSingle();
  if(row.error||!row.data) return reply({error:"Carte introuvable."},404);
  if(b.action==="rotate"){
   const l=makeLink(); const r=await cards().update({token_hash:l.hash}).eq("id",b.id);
   if(r.error) return reply({error:"Lien indisponible."},503);
   return reply({link:l.link});
  }
  if(b.action==="purchase"){
   const ref=typeof b.reference==="string"?b.reference.trim().toUpperCase():"";
   if(b.confirmed!==true||ref.length<3||ref.length>100||!Number.isSafeInteger(b.amount)||b.amount<1||b.amount>100000000) return reply({error:"Vérifiez la facture et le paiement."},400);
   if(row.data.reward_delivered_at) return reply({error:"Récompense déjà remise. Créez une nouvelle carte."},409);
   if(await count(b.id)>=4) return reply({error:"Carte complète. Remettez d’abord la récompense."},409);
   const r=await purchases().insert({card_id:b.id,reference:ref,amount:b.amount});
   if(r.error) return reply({error:r.error.code==="23505"?"Facture déjà utilisée.":"Achat non enregistré."},r.error.code==="23505"?409:503);
   return reply({success:true});
  }
  if(b.action==="deliver"){
   if(b.confirmed!==true||await count(b.id)<4) return reply({error:"Carte incomplète ou remise non confirmée."},400);
   const r=await cards().update({reward_delivered_at:new Date().toISOString()}).eq("id",b.id).is("reward_delivered_at",null).select("id").maybeSingle();
   if(r.error||!r.data) return reply({error:"Récompense déjà remise ou opération impossible."},409);
   return reply({success:true});
  }
  return reply({error:"Action inconnue."},400);
 } catch {return reply({error:"Opération impossible."},503);}
}
