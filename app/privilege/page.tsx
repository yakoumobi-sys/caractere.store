import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PORTAL = "https://caractere-privilege.mokka266.chatgpt.site";

export const metadata: Metadata = {
  title: "Caractère Privilège — Votre fidélité a du caractère",
  description: "Découvrez Caractère Privilège : votre espace fidélité et carte digitale chez Caractère à Alger.",
  alternates: { canonical: "/privilege" },
};

export default function PrivilegePage() {
  return (
    <>
      <Navbar />
      <main style={{background:"#f7f6f3",color:"#171717"}}>
        <section className="mx-auto max-w-7xl px-6 lg:px-12 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div>
            <p className="text-xs font-bold tracking-[.22em] uppercase" style={{color:"#ad4336"}}>✦ Caractère Privilège</p>
            <h1 className="font-bold tracking-[-.065em] leading-[1.05] mt-7 mb-7" style={{fontSize:"clamp(3.3rem,6vw,6rem)"}}>
              Votre fidélité<br /><span style={{color:"#ad4336"}}>a du caractère.</span>
            </h1>
            <p className="text-base lg:text-xl leading-relaxed max-w-xl" style={{color:"#65615d"}}>
              Un espace pensé pour celles et ceux qui nous font confiance. Découvrez votre carte digitale, vos avantages et les nouveautés du programme.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between gap-7 rounded-full bg-[#171717] px-7 py-4 text-white text-sm font-semibold hover:opacity-85 transition-opacity">
                Ouvrir mon espace Privilège <span aria-hidden="true">↗</span>
              </a>
              <Link href="/auth/login" className="inline-flex items-center gap-5 rounded-full border border-[#bbb7b0] px-7 py-4 text-[#171717] text-sm font-semibold hover:bg-white transition-colors">
                Mon compte Caractère <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="text-xs mt-6 leading-relaxed max-w-lg" style={{color:"#85807b"}}>
              L’espace Privilège s’ouvre actuellement sur une page dédiée. Les points, avantages personnalisés et notifications seront raccordés aux comptes Caractère dans une prochaine étape.
            </p>
          </div>
          <div className="relative flex flex-col items-center justify-center py-12 lg:py-20">
            <div aria-hidden="true" className="absolute w-[90%] aspect-square rounded-full" style={{background:"radial-gradient(circle,rgba(173,67,54,.17),transparent 70%)"}} />
            <div className="relative w-full max-w-[440px] aspect-[1.6] rounded-[24px] p-7 sm:p-9 flex flex-col justify-between text-white shadow-2xl" style={{background:"linear-gradient(125deg,#41403d,#111 65%,#302e2c)",transform:"rotate(-7deg)",boxShadow:"0 35px 70px rgba(17,17,17,.23)"}}>
              <div className="flex justify-between items-start">
                <span className="text-xl sm:text-2xl font-extrabold tracking-[-.08em]">CARACTÈRE<span style={{color:"#f16b59"}}>.</span></span>
                <span className="text-2xl text-[#dfc6a6]">✦</span>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl font-semibold tracking-[.16em]">PRIVILÈGE</p>
                <p className="text-[10px] tracking-[.24em] mt-2 text-[#c8c1ba]">VOTRE CARTE DIGITALE</p>
              </div>
            </div>
            <p className="relative text-[10px] tracking-[.22em] font-semibold mt-16 text-[#74716d]">UNE AUTRE FAÇON DE DIRE MERCI.</p>
          </div>
        </section>
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <p className="uppercase text-xs font-bold tracking-[.22em] text-[#ad4336]">Le programme</p>
            <h2 className="font-bold tracking-[-.055em] text-4xl lg:text-6xl leading-[1.13] mt-5 mb-16">Plus qu'une commande.<br />Une relation qui dure.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#e7e4df]">
              {[
                {n:"01",title:"Votre carte digitale",desc:"Un espace facilement accessible depuis votre téléphone."},
                {n:"02",title:"Des avantages",desc:"Consultez les offres et récompenses annoncées dans votre espace."},
                {n:"03",title:"Des nouvelles utiles",desc:"Des informations adaptées à vos préférences, avec votre accord."}
              ].map((item) => (
                <article key={item.n} className="py-9 pr-8 md:pl-6 first:pl-0 border-b md:border-b-0 md:border-r last:border-r-0 border-[#e7e4df]">
                  <p className="font-semibold text-xs tracking-widest" style={{color:"#ad4336"}}>{item.n}</p>
                  <h3 className="text-xl lg:text-2xl font-bold tracking-tight mt-7 mb-3">{item.title}</h3>
                  <p className="text-[#746f69] leading-relaxed text-sm lg:text-base">{item.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="bg-[#191919] text-white text-center px-6 py-24">
          <p className="uppercase text-xs tracking-[.2em] font-semibold text-[#c59e94]">Caractère Privilège</p>
          <h2 className="text-4xl lg:text-6xl font-bold tracking-[-.05em] mt-5 mb-6">Votre place est ici.</h2>
          <p className="text-[#b9b6b2] mb-9 max-w-lg mx-auto leading-relaxed">Découvrez le programme et les étapes pour rejoindre l’espace Privilège.</p>
          <a href={PORTAL} target="_blank" rel="noopener noreferrer" className="inline-flex gap-6 items-center rounded-full bg-white text-[#191919] px-7 py-4 font-semibold text-sm hover:opacity-90">Découvrir mon espace <span aria-hidden="true">↗</span></a>
        </section>
      </main>
      <Footer />
    </>
  );
}
