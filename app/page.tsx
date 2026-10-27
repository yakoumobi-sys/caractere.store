import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import HomeChooser from "@/components/home/HomeChooser";

// Accueil — wrapper serveur pour exposer un title/description propres
// (le contenu réel est un composant client, qui ne peut pas exporter `metadata`).
export const metadata: Metadata = {
  title: { absolute: 'Vêtements personnalisés en Algérie | Caractère' },
  description:
    'T-shirts, polos, uniformes et casquettes personnalisés en Algérie. Impression DTF et broderie à Alger, dès 1 pièce. Simulation et devis gratuits.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Vêtements personnalisés en Algérie | Caractère',
    description: 'Personnalisation textile pour entreprises, marques et particuliers : DTF, broderie, simulation et devis gratuits à Alger.',
    url: 'https://www.caracteredz.com/',
    type: 'website',
    locale: 'fr_DZ',
    images: ['https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vêtements personnalisés en Algérie | Caractère',
    description: 'Impression DTF et broderie sur t-shirts, polos et uniformes en Algérie. Devis et simulation gratuits.',
    images: ['https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'],
  },
};

export default function Home() {
  return <><HomeChooser /><Footer /></>;
}
