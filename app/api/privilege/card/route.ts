import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase";
export const dynamic="force-dynamic";
const reply=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
export async function POST(req:NextRequest){
 try{
  const b=await req.json();
  if(typeof b.token!=="string"||!/^[a-f0-9]{64}$/.test(b.token))return reply({error:"Lien invalide."},404);
  const hash=createHash("sha256").update(b.token).digest("hex");
  const r=await supabaseAdmin.from("privilege_direct_cards").select("id,full_name,created_at,reward_delivered_at").eq("token_hash",hash).maybeSingle();
  if(r.error)return reply({error:"Service momentanément indisponible."},503);
  if(!r.data)return reply({error:"Lien expiré ou remplacé. Contactez Caractère."},404);
  const p=await supabaseAdmin.from("privilege_direct_purchases").select("id",{count:"exact",head:true}).eq("card_id",r.data.id);
  if(p.error)return reply({error:"Carte momentanément indisponible."},503);
  return reply({name:r.data.full_name,created_at:r.data.created_at,purchase_count:p.count||0,card_number:r.data.id.replace(/-/g,"").slice(-8).toUpperCase(),delivered:!!r.data.reward_delivered_at});
 }catch{return reply({error:"Lien invalide."},400);}
}
