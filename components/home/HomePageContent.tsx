'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-black-transparent.png'

export default function HomePageContent() {
  const [activeTab, setActiveTab] = useState(0)
  
  return (
    <div style={{background:'#FAFAF9', fontFamily:'Montserrat'}}>
      <header style={{sticky:true, padding:'16px 24px', display:'flex', justifyContent:'space-between', borderBottom:'1px solid #E5E7EB'}}>
        <img src={LOGO} alt="Caractère" style={{height:'36px'}} />
        <nav style={{display:'flex', gap:'24px'}}>
          <a href="#" style={{fontWeight:800}}>Outils</a>
          <a href="#" style={{fontWeight:800}}>Tarifs</a>
          <a href="https://wa.me/213557440522" style={{fontWeight:800,color:'#D4A574'}}>WhatsApp</a>
        </nav>
      </header>
      
      <section style={{padding:'80px 24px', textAlign:'center', background:'linear-gradient(135deg, #FAFAF9 0%, #F3F4F6 100%)'}}>
        <h1 style={{fontSize:'48px', fontWeight:800, marginBottom:'16px'}}>Votre marque en 48h</h1>
        <p style={{fontSize:'18px', fontWeight:700, marginBottom:'32px', color:'#6B7280'}}>DTF • Broderie • Uniformes | Sans stock • Sans risque</p>
        <div style={{display:'flex', gap:'12px', justifyContent:'center'}}>
          <Link href="/designer" style={{padding:'12px 24px', background:'#0C0A09', color:'#FAFAF9', borderRadius:'8px', fontWeight:800, textDecoration:'none'}}>🎨 Designer gratuit</Link>
          <a href="https://wa.me/213557440522" style={{padding:'12px 24px', border:'2px solid #0C0A09', borderRadius:'8px', fontWeight:800, textDecoration:'none', color:'#0C0A09'}}>💬 Question?</a>
        </div>
      </section>

      <section style={{padding:'60px 24px', textAlign:'center'}}>
        <img src={LOGO} alt="Caractère" style={{maxWidth:'240px', marginBottom:'32px'}} />
      </section>

      <section style={{padding:'80px 24px'}}>
        <h2 style={{fontSize:'42px', fontWeight:800, textAlign:'center', marginBottom:'48px'}}>Accès rapide</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'24px'}}>
          {[
            {icon:'🎨', name:'Designer', href:'/designer'},
            {icon:'🧊', name:'Studio 3D', href:'/studio-3d'},
            {icon:'👕', name:'Produits', href:'/produits'},
            {icon:'⭐', name:'Collection', href:'/collection'},
            {icon:'📚', name:'Comment ça marche', href:'/comment-ca-marche'}
          ].map((s,i) => (
            <Link key={i} href={s.href} style={{padding:'32px 20px', background:'#F9FAFB', border:'1px solid #E5E7EB', borderRadius:'12px', textDecoration:'none', color:'#0C0A09', textAlign:'center'}}>
              <div style={{fontSize:'48px', marginBottom:'16px'}}>{s.icon}</div>
              <p style={{fontWeight:800, fontSize:'15px'}}>{s.name}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer style={{background:'#0C0A09', color:'#FAFAF9', padding:'48px 24px', textAlign:'center'}}>
        <p style={{fontWeight:700}}>© 2024 Caractère Store • DTF • Broderie • Production 48h</p>
        <p style={{fontWeight:700, marginTop:'12px'}}>📞 +213 557 440 522 • 📧 yakoumobi@gmail.com</p>
      </footer>
    </div>
  )
}
