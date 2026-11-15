"use client";
import { useCallback,useEffect,useState } from "react";
import { adminFetch } from "@/lib/adminFetch";
type Card={id:string;full_name:string;phone:string|null;purchase_count:number;reward_delivered_at:string|null};
export default function DirectCards(){
 const [cards,setCards]=useState<Card[]>([]);
 const [open,setOpen]=useState(false);
 const [name,setName]=useState("");
 const [phone,setPhone]=useState("");
 const [link,setLink]=useState("");
 const [selected,setSelected]=useState<Card|null>(null);
 const [reference,setReference]=useState("");
 const [amount,setAmount]=useState("");
 const [confirmed,setConfirmed]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [search,setSearch]=useState("");
 const load=useCallback(async()=>{
  const r=await adminFetch("/api/admin/privilege/cards",{cache:"no-store"});const d=await r.json();
  if(!r.ok)throw new Error(d.error||"Accès refusé.");setCards(d.cards);
 },[]);
 useEffect(()=>{load().catch(e=>setError(e.message))},[load]);
 async function whatsapp(c:Card){
  const phone=(c.phone||"").replace(/\D/g,"").replace(/^00213/,"213").replace(/^0/,"213");
  if(!/^213[567]\d{8}$/.test(phone)){setError("Téléphone client valide requis.");return;}
  setBusy(true);setError("");
  try{
   const r=await adminFetch("/api/admin/privilege/cards",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"share",id:c.id})});
   const d=await r.json();if(!r.ok||!d.link)throw new Error(d.error||"Lien indisponible.");
   const message="Salam "+c.full_name+" 👋\n\nMerci pour votre confiance ! Voici votre carte personnelle Caractère Privilège :\n"+d.link+"\n\nÀ chaque achat, 3 cases se cochent. 10 cases = 5 T-shirts offerts. 🎁\nEt au prochain achat, vous aurez un T-shirt caractérisé gratuit !";
   window.location.assign("https://wa.me/"+phone+"?text="+encodeURIComponent(message));
  }catch(e){setError(e instanceof Error?e.message:"Erreur.");}
  finally{setBusy(false);}
 }
 async function act(body:object){
  setBusy(true);setError("");setLink("");
  try{
   const r=await adminFetch("/api/admin/privilege/cards",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
   const d=await r.json();if(!r.ok)throw new Error(d.error||"Opération impossible.");
   if(d.link)setLink(d.link);
   setOpen(false);setName("");setPhone("");setSelected(null);setReference("");setAmount("");setConfirmed(false);await load();
  }catch(e){setError(e instanceof Error?e.message:"Erreur.")}
  finally{setBusy(false)}
 }
 return <section id="cartes-clients" className="mb-8 rounded-3xl border border-black/10 bg-white p-5 sm:p-7">
  <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#a94639]">CARACTÈRE PRIVILÈGE</p><h2 className="mt-2 text-2xl font-bold">Cartes clients</h2><p className="mt-1 text-sm text-gray-500">3 cases par achat • 10 cases = 5 T-shirts offerts.</p></div><button onClick={()=>{setOpen(!open);setLink("");setSelected(null)}} className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white">+ Nouvelle carte</button></div>
  {error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
  {open&&<form onSubmit={e=>{e.preventDefault();void act({action:"create",name,phone})}} className="mt-5 grid gap-3 rounded-2xl bg-gray-50 p-4 sm:grid-cols-2"><label className="text-sm font-semibold">Nom du client<input required minLength={2} maxLength={100} value={name} onChange={e=>setName(e.target.value)} className="mt-2 block w-full rounded-xl border bg-white p-3"/></label><label className="text-sm font-semibold">Téléphone (facultatif)<input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="mt-2 block w-full rounded-xl border bg-white p-3"/></label><button disabled={busy} className="rounded-xl bg-black p-3 text-sm font-bold text-white sm:col-span-2">{busy?"Création…":"Créer la carte et générer le lien"}</button></form>}
  {link&&<div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4"><p className="font-bold text-green-900">Lien privé du client — à transmettre par WhatsApp</p><input readOnly value={link} onFocus={e=>e.currentTarget.select()} className="mt-2 w-full rounded-lg border bg-white p-2 text-xs"/><div className="mt-3 flex flex-wrap gap-2"><button onClick={async()=>{try{await navigator.clipboard.writeText(link)}catch{setError("Sélectionnez et copiez le lien manuellement.")}}} className="rounded-lg bg-black px-4 py-2 text-sm text-white">Copier le lien</button><a href={"https://wa.me/?text="+encodeURIComponent("Voici votre carte Caractère Privilège : "+link)} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-green-700 px-4 py-2 text-sm text-white">Partager sur WhatsApp</a></div><p className="mt-2 text-xs text-green-900">Copiez le lien maintenant. Un nouveau lien invalide l’ancien.</p></div>}
  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Chercher un nom ou téléphone" className="mt-5 w-full rounded-xl border border-gray-200 p-3 text-sm"/>
  {selected&&<form onSubmit={e=>{e.preventDefault();void act({action:"purchase",id:selected.id,reference,amount:Number(amount),confirmed})}} className="mt-4 space-y-3 rounded-xl border bg-gray-50 p-4"><p className="font-semibold">Ajouter un achat à {selected.full_name}</p><input required minLength={3} maxLength={100} value={reference} onChange={e=>setReference(e.target.value)} placeholder="Référence unique de la facture" className="w-full rounded-lg border p-3"/><input required min={1} max={100000000} type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Montant payé (DA)" className="w-full rounded-lg border p-3"/><label className="flex gap-2 text-sm"><input type="checkbox" required checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>Paiement et identité du client vérifiés</label><button disabled={busy||!confirmed} className="rounded-lg bg-black px-5 py-3 text-sm text-white disabled:opacity-50">Valider +3 cases</button><button type="button" onClick={()=>setSelected(null)} className="ml-3 text-sm">Annuler</button></form>}
  <div className="mt-5 divide-y">{cards.filter(c=>(c.full_name+" "+(c.phone||"")).toLowerCase().includes(search.toLowerCase())).map(c=>{const n=Math.min(c.purchase_count*3,10);return <div key={c.id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div><p className="font-semibold">{c.full_name}</p><p className="text-xs text-gray-500">{c.phone||"Sans téléphone"} • {n}/10</p><div className="mt-2 flex gap-1">{Array.from({length:10},(_,i)=><span key={i} className={"h-3 w-3 rounded-full "+(i<n?"bg-[#ba8653]":"bg-gray-200")}/>)}</div></div><div className="flex flex-wrap items-center gap-2"><button type="button" disabled={busy||!c.phone} onClick={()=>void whatsapp(c)} className="rounded-lg bg-green-700 px-3 py-2 text-xs font-bold text-white">WhatsApp</button><button disabled={busy} onClick={()=>{if(window.confirm("Générer un nouveau lien ? L’ancien ne fonctionnera plus."))void act({action:"rotate",id:c.id})}} className="rounded-lg border px-3 py-2 text-xs font-bold">Nouveau lien</button>{c.reward_delivered_at?<span className="text-xs font-bold text-green-700">5 T-shirts remis</span>:n===10?<button disabled={busy} onClick={()=>{if(window.confirm("Confirmer que les 5 T-shirts ont réellement été remis ?"))void act({action:"deliver",id:c.id,confirmed:true})}} className="rounded-lg bg-green-700 px-3 py-2 text-xs font-bold text-white">Valider la remise des 5 T-shirts</button>:<button disabled={busy} onClick={()=>{setSelected(c);setReference("");setAmount("");setConfirmed(false);setOpen(false)}} className="rounded-lg bg-black px-3 py-2 text-xs font-bold text-white">+ Achat</button>}</div></div>})}{cards.length===0&&<p className="py-4 text-sm text-gray-500">Aucune carte avec lien privé pour le moment.</p>}</div>
 </section>
}
