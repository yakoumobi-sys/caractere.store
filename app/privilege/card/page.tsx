"use client";
import { useEffect,useState } from "react";
import LoyaltyCard from "../LoyaltyCard";
import NextPurchaseGift from "../NextPurchaseGift";
type Card={name:string;created_at:string;purchase_count:number;card_number:string;delivered:boolean};
export default function DirectPrivilegeCard(){
 const [card,setCard]=useState<Card|null>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(true);
 useEffect(()=>{
  const token=window.location.hash.slice(1);
  let active=true;
  fetch("/api/privilege/card",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token}),cache:"no-store"}).then(async r=>{
   const d=await r.json(); if(!r.ok)throw new Error(d.error||"Carte indisponible.");
   if(active)setCard(d);
  }).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)});
  return ()=>{active=false};
 },[]);
 return <main className="min-h-[85vh] bg-[#f7f6f3] px-4 py-12 text-[#181818]"><div className="mx-auto max-w-lg">
 <p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-[#a94639]">Caractère Privilège</p>
 <h1 className="mb-7 text-3xl font-bold tracking-tight">Votre carte de fidélité</h1>
 {loading&&<p>Chargement…</p>}{error&&<p role="alert">{error}</p>}
 {card&&<><LoyaltyCard name={card.name} joinedAt={card.created_at} purchaseCount={card.purchase_count} cardNumber={card.card_number} delivered={card.delivered}/><NextPurchaseGift/><div className="mt-6 rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">{card.delivered?"Vos 5 T-shirts ont été remis !":card.purchase_count>=4?"Félicitations ! 5 T-shirts offerts.":"10 cases = 5 T-shirts offerts"}</h2><p className="mt-3 text-sm text-gray-600">{card.delivered?"Votre récompense a été utilisée.":card.purchase_count>=4?"Présentez cette carte à notre équipe pour récupérer votre récompense.":"Chaque achat payé et validé coche 3 cases. Votre récompense est débloquée au quatrième achat."}</p></div><p className="mt-5 text-xs text-gray-500">Gardez ce lien privé : il donne accès à votre carte personnelle.</p></>}
 </div></main>
}
