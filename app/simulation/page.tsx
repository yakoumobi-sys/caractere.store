import type { Metadata } from 'next'
import SimulationForm from './SimulationForm'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Votre simulation gratuite',
  description: 'Ajoutez votre logo et demandez votre simulation gratuite sur WhatsApp. Polos, t-shirts et tenues personnalisées par Caractère.',
  alternates: { canonical: 'https://www.caracteredz.com/simulation' },
  openGraph: {
    title: 'Votre logo mérite du caractère.',
    description: 'Votre logo. Nos vêtements. Demandez votre simulation gratuite.',
    url: 'https://www.caracteredz.com/simulation',
    images: [{ url: '/home-cutouts/polo.png' }],
  },
}

export default function SimulationPage() {
  return <>
    <Script id="meta-pixel-simulation" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1107588608797548');fbq('track','PageView');`}</Script>
    <SimulationForm />
  </>
}
