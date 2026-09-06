import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Mentions légales & CGV',
  description: 'Informations légales, conditions générales de vente et politique de garantie de Caractère Store.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-black mb-3">{title}</h2>
      <div className="text-[14px] text-gray-700 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-14">
        <div className="border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
          <div className="max-w-3xl mx-auto px-6 py-14">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-3">Mentions légales & CGV</h1>
            <p className="text-gray-600">
              Informations légales, conditions générales de vente et politique de garantie.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12">

          <Section title="1. Informations légales">
            <p><strong>Nom commercial :</strong> Caractère Store</p>
            <p><strong>Activité :</strong> Personnalisation textile — broderie, impression DTF, uniformes professionnels et print-on-demand.</p>
            <p><strong>Localisation :</strong> Alger, Algérie</p>
            <p><strong>Contact :</strong> WhatsApp <a href="https://wa.me/213557440522" className="underline">+213 557 440 522</a> · Email <a href="mailto:yakoumobi@gmail.com" className="underline">yakoumobi@gmail.com</a></p>
            <p><strong>Site web :</strong> caracteredz.com</p>
            <div className="rounded-xl px-4 py-3 mt-2" style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <p className="text-[13px]" style={{ color: '#92400E' }}>
                <strong>À compléter :</strong> numéro de registre de commerce (RC), numéro d'identification
                fiscale (NIF) et adresse postale précise seront ajoutés à cette page dès leur obtention.
              </p>
            </div>
          </Section>

          <Section title="2. Conditions générales de vente">
            <p>
              Toute commande passée sur Caractère Store (via le configurateur, le designer ou WhatsApp)
              implique l'acceptation des présentes conditions.
            </p>
            <p>
              Les prix affichés sont exprimés en dinars algériens (DA). Un devis est confirmé par écrit
              (WhatsApp ou email) avant le lancement de la production. La production démarre après
              validation du design par le client.
            </p>
            <p>
              Les délais de production annoncés (48h ouvrées pour les commandes standards) courent à
              partir de la validation du design et, le cas échéant, du règlement convenu. La livraison
              se fait via nos partenaires transport, en 3 à 5 jours selon la wilaya.
            </p>
          </Section>

          <Section title="3. Garantie & politique de retour">
            <p>
              Nos garanties diffèrent selon le type de commande, car les besoins ne sont pas les mêmes :
            </p>
            <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <p className="font-bold text-black mb-1.5">🛡️ Commandes entreprises (uniformes B2B)</p>
              <p>
                Vous validez le design avant production, puis les photos avant expédition. Si malgré
                cette double validation une pièce arrive défectueuse (erreur de notre part), nous la
                refaisons gratuitement.
              </p>
            </div>
            <div className="rounded-2xl border p-5 mt-4" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
              <p className="font-bold text-black mb-1.5">🛡️ Print-on-Demand (marques personnelles)</p>
              <p>
                Sur votre toute première pièce test : si la qualité d'impression ne correspond pas à ce
                que vous attendiez, nous la refaisons ou vous remboursons intégralement.
              </p>
            </div>
            <p className="mt-4">
              Dans les deux cas, la garantie couvre les erreurs de production ou de qualité de notre
              part — pas les retours pour simple changement d'avis une fois la pièce validée et produite
              conforme au design approuvé.
            </p>
          </Section>

          <Section title="4. Paiement">
            <p>
              Le paiement peut se faire par virement bancaire (RIB communiqué sur devis) ou selon les
              modalités indiquées lors du suivi de votre commande. Aucune donnée bancaire n'est stockée
              par Caractère Store.
            </p>
          </Section>

          <Section title="5. Contact">
            <p>
              Pour toute question sur ces conditions, une commande en cours ou une réclamation,
              contactez-nous directement sur{' '}
              <a href="https://wa.me/213557440522" className="underline">WhatsApp</a> ou par email à{' '}
              <a href="mailto:yakoumobi@gmail.com" className="underline">yakoumobi@gmail.com</a>.
            </p>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  )
}
