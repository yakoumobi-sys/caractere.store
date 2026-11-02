import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import HomeChooser from "@/components/home/HomeChooser";

// Accueil — wrapper serveur pour exposer un title/description propres
// (le contenu réel est un composant client, qui ne peut pas exporter `metadata`).
export const metadata: Metadata = {
  title: { absolute: 'Vêtement personnalisé Algérie : T-shirts, Polos & Broderie | Caractère' },
  description:
    'Vêtement personnalisé en Algérie : t-shirts, polos, uniformes et casquettes avec votre logo. Broderie et impression DTF à Alger, dès 1 pièce. Simulation et devis gratuits.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Vêtement personnalisé Algérie : T-shirts, Polos & Broderie | Caractère',
    description: 'Vêtements personnalisés en Algérie pour entreprises et particuliers. T-shirts, polos, broderie et DTF. Simulation gratuite de votre logo.',
    url: 'https://www.caracteredz.com/',
    type: 'website',
    locale: 'fr_DZ',
    images: ['https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vêtement personnalisé Algérie : T-shirts, Polos & Broderie | Caractère',
    description: 'T-shirts, polos et uniformes personnalisés en Algérie. Broderie, DTF, simulation et devis gratuits.',
    images: ['https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo.jpg'],
  },
};

export default function Home() {
  return <><HomeChooser /><Footer /></>;
}
