'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

// Palette "Premium Corporate" — navy/gold.
const C = {
  navy: '#1A3A52',
  navyDark: '#0F2438',
  gold: '#D4A574',
  // Variante plus foncée de l'or — utilisée en texte sur fond clair (kicker, accents
  // de titre) : #D4A574 seul n'a pas assez de contraste sur blanc/gris clair pour
  // l'AA WCAG. Réservé au texte ; les fonds/boutons gardent l'or clair de la charte.
  goldText: '#8B5E2F',
  textDark: '#2C2C2C',
  textMuted: '#6B7280',
  bgLight: '#F5F5F5',
  white: '#FFFFFF',
  green: '#2D7A3E',
  red: '#D63D3D',
  border: '#E2E2E2',
}

// Logo blanc — nécessaire sur les fonds navy (header/footer) du nouveau design ;
// l'ancien logo noir disparaissait sur fond sombre.
const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
const WA = 'https://wa.me/213557440522'

type Lang = 'fr' | 'ar'

const T = {
  fr: {
    dir: 'ltr',
    langBtn: 'العربية',
    devisBtn: '☰', // Menu hamburger
    eyebrow: 'Pour les entreprises • Atelier Alger',
    h1a: 'Uniformes de qualité en ',
    h1b: '48 heures',
    h1c: 'Satisfait ou remboursé.',
    h1d: 'Vous validez, on produit.',
    sub: "L'atelier qui équipe restaurants, cliniques et chantiers en Algérie. Pas de retard, pas de surprise, pas d'intermédiaire.",
    ctaMaquette: 'Envoyer mon logo sur whatsapp →',
    ctaConfig: 'configurer ma commande',
    proof1: 'entreprises équipées',
    proof2: 'pièces produites',
    proof3: 'de satisfaction',
    proof4: 'Réponse en',
    proof4b: 'moins de 2h',
    painKicker: 'Le coût réel d\'un mauvais fournisseur',
    painH2a: 'Un uniforme raté = ',
    painH2b: 'votre image qui paye.',
    painLead: 'Si vous avez commandé des tenues personnalisées en Algérie, vous connaissez probablement ça:',
    pains: [
      { title: 'Fournisseur en retard', desc: 'Votre événement est dans 5 jours. Lui, il répond dans 5 jours.' },
      { title: 'Qualité aléatoire', desc: 'Logo de travers, broderie qui se défait au premier lavage.' },
      { title: 'Zéro transparence', desc: 'Vous payez, puis silence radio jusqu\'à la livraison. Ou pas.' },
      { title: 'Délai d\'import', desc: '6 semaines depuis la Chine. Douane. Stress. Surprises.' },
    ],
    valueKicker: 'Pourquoi nous choisir',
    valueH2a: 'On a bâti l\'atelier qu\'on aurait',
    valueH2b: 'voulu avoir comme client.',
    valueLead: 'Chaque point ci-dessous résout un problème qu\'on a entendu des centaines de fois.',
    values: [
      { ico: '💰', title: 'Simulation gratuite', desc: 'Logo → devis clair en 2 heures. Aucun engagement, aucun coût caché.', val: 'Valeur: 5 000 DA' },
      { ico: '🛡️', title: 'Garantie complète', desc: 'Nous prenons en charge toute erreur de notre part. Pièce défectueuse? Nous la refaisons gratuitement.', val: 'Zéro risque' },
      { ico: '🎧', title: 'Service client dédié', desc: 'Réponse < 2h sur WhatsApp, 6j/7. Un vrai contact, pas un bot, pas de silence radio.', val: '0557 440 522' },
      { ico: '⏱️', title: '48h garanties', desc: 'Production et sortie de votre commande en 48h ouvrées, écrit sur devis. Point.', val: 'Plus rapide d\'Algérie' },
      { ico: '📸', title: 'Photos avant envoi', desc: 'Validez chaque pièce en image avant expédition. Zéro mauvaise surprise à la réception.', val: 'Contrôle qualité garanti' },
      { ico: '🔁', title: 'Réassort en 1 message', desc: 'Vos designs archivés. Nouveau salarié? Un WhatsApp et son uniforme rentre en production.', val: 'Économise des heures' },
    ],
    processKicker: 'Processus simple, volontairement',
    processH2a: 'Du logo à votre équipe habillée: ',
    processH2b: '4 étapes, sans friction.',
    processLead: 'Votre seul travail: envoyer un logo. On gère le reste.',
    steps: [
      { title: 'Envoyez votre logo', desc: 'WhatsApp, email ou formulaire. Littéralement 2 minutes.' },
      { title: 'Validez la maquette', desc: 'Reçue en 2h, gratuite. Devis clair. Modifiable jusqu\'à validation.' },
      { title: 'Production 48h', desc: 'DTF ou broderie dans notre atelier. Vous recevez photos de contrôle.' },
      { title: 'Livraison 58 wilayas', desc: 'Designs sauvegardés pour les réassorts. Un message = une commande.' },
    ],
    testiKicker: 'Qui nous fait confiance',
    testiH2a: 'Ils ont testé.',
    testiH2b: 'Ils sont restés.',
    testimonials: [
      { quote: 'Salon dans 4 jours. Fournisseur habituel nous a lâchés. Caractère a produit 80 polos brodés en 48h chrono. Qualité impeccable.', who: 'Karim B.', role: 'Restaurant El Kef, Alger', result: '80 polos • 48h' },
      { quote: 'Les photos avant envoi changent tout. 45 blouses pour la clinique, chaque détail validé avant expédition. Zéro retour.', who: 'Dr. Samira M.', role: 'Clinique Al Chifa', result: '45 blouses • 0 défaut' },
      { quote: '120 gilets haute visibilité. Un mois de chantier intensif plus tard: impeccables. Le réassort se fait en un WhatsApp.', who: 'Yacine O.', role: 'BTP Construct', result: '120 gilets • réassort auto' },
    ],
    offerKicker: 'Offre première commande',
    offerTitle: 'Testez sans risque',
    offerSub: 'Tout ce qu\'il faut pour découvrir notre qualité:',
    offerItems: [
      'Maquette gratuite en 2h (valeur 5 000 DA)',
      'Production 48h garantie écrit',
      'Photos de contrôle avant livraison',
      'Vos designs archivés (réassort en 1 message)',
      'Rabais volume: −15% à 51 pièces, −30% à 200+',
      'Support dédié WhatsApp (< 2h, 6j/7)',
    ],
    offerCta: 'Démarrer maintenant →',
    offerScarcity: '⚡ Places limitées: 12 nouveaux comptes/mois pour tenir les 48h.',
    guaranteeTitle: 'Garantie Zéro Risque',
    guaranteeText: 'Vous validez le design avant production. Vous validez les photos avant expédition. Si malgré ça une pièce arrive défectueuse, on la refait gratuitement. Le risque est entièrement de notre côté—c\'est normal, c\'est notre métier.',
    faqKicker: 'Questions récurrentes',
    faqH2: 'Avant de vous engager, clarifiez tout.',
    faqs: [
      { q: 'C\'est vraiment 48h? Même pour 200 pièces?', a: 'Oui. Notre atelier tourne avec 20 personnes et des machines industrielles. Production 48h ouvrées garantie écrit jusqu\'à 500 pièces. Au-delà, devis avant paiement.' },
      { q: 'Et si la qualité ne me convient pas?', a: 'Vous validez la maquette avant production, puis les photos avant expédition. Si un défaut de fabrication apparaît malgré ça, on refait la pièce gratuitement.' },
      { q: 'Minimum de commande?', a: 'Une pièce. Mais les tarifs entreprise deviennent vraiment intéressants à partir de 51 pièces (−15%).' },
      { q: 'Comment ça marche pour le paiement?', a: 'Devis transparent en 2h. Paiement BaridiMob, CCP ou virement. Acompte à la commande, solde après validation photos. Jamais à l\'aveugle.' },
      { q: 'Livraison partout en Algérie?', a: 'Oui, 58 wilayas. Alger 24h post-production, reste du pays 2-5 jours selon la zone.' },
    ],
    finalH2: 'Prêt à tester?',
    finalP: 'Envoyer votre logo maintenant. Maquette gratuite en 2h, sans engagement.',
    finalCta: '💬 Envoyer mon logo',
    finalMicro: 'Réponse < 2h, 6j/7 • +213 557 440 522',
    footer1: '© 2026 Caractère Store • Uniformes & Branding B2B • Alger',
    footer2: '📞 +213 557 440 522 • 📧 yakoumobi@gmail.com',
    menuItems: [
      {
        label: 'Outils',
        items: [
          { label: 'Designer', href: '/designer' },
          { label: 'Studio 3D', href: '/studio-3d' },
          { label: 'Configurateur', href: '/configurateur' },
        ]
      },
      {
        label: 'Découvrir',
        items: [
          { label: 'Comment ça marche', href: '/comment-ca-marche' },
          { label: 'Produits', href: '/produits' },
          { label: 'Catalogue', href: '/collection' },
          { label: 'Print on Demand', href: '/print-on-demand' },
        ]
      },
      {
        label: 'Pour qui',
        items: [
          { label: 'Entreprises', href: '/entreprises' },
          { label: 'Particuliers', href: '/particuliers' },
        ]
      },
    ],
  },
  ar: {
    dir: 'rtl',
    langBtn: 'Français',
    devisBtn: '☰', // Menu hamburger
    eyebrow: 'للمؤسسات • ورشة الجزائر',
    h1a: 'أزياء موحدة في ',
    h1b: '48 ساعة',
    h1c: 'مضمونة أو استرجاع.',
    h1d: 'أنت تعتمد، نحن ننتج.',
    sub: 'الورشة التي تجهّز المطاعم والعيادات والبناء في الجزائر. بدون تأخير، بدون مفاجآت، بدون وسطاء.',
    ctaMaquette: 'أرسل شعارك ←',
    ctaConfig: '⚙️ اطلب أونلاين',
    proof1: 'مؤسسة جهّزناها',
    proof2: 'قطعة أنتجناها',
    proof3: 'رضا الزبائن',
    proof4: 'الرد خلال',
    proof4b: 'أقل من ساعتين',
    painKicker: 'تكلفة المورّد السيّئ',
    painH2a: 'زي فاشل = ',
    painH2b: 'سمعة مؤسستك تتضرر.',
    painLead: 'إذا طلبت ملابس مخصصة في الجزائر، تعرف غالباً ما يحدث:',
    pains: [
      { title: 'مورّد متأخر', desc: 'حدثك بعد 5 أيام وهو يرد بعد 5 أيام.' },
      { title: 'جودة غير منتظمة', desc: 'شعار مائل، تطريز يتفكك من أول غسلة.' },
      { title: 'انعدام الشفافية', desc: 'تدفع ثم صمت تام. قد لا يأتي الطلب أصلاً.' },
      { title: 'استيراد من الخارج', desc: '6 أسابيع من الصين. جمارك. مفاجآت. توتر.' },
    ],
    valueKicker: 'لماذا تختارنا',
    valueH2a: 'بنينا الورشة التي كنا',
    valueH2b: 'نتمنى التعامل معها.',
    valueLead: 'كل ميزة أدناه تحل مشكلة سمعناها مئات المرات.',
    values: [
      { ico: '💰', title: 'محاكاة مجانية', desc: 'شعار → عرض سعر واضح في ساعتين. بدون التزام، بدون تكلفة.', val: 'قيمته 5000 دج' },
      { ico: '🛡️', title: 'ضمان شامل', desc: 'نحن نتحمل أي خطأ من طرفنا. قطعة معيبة؟ نعيدها مجاناً.', val: 'بدون مخاطرة' },
      { ico: '🎧', title: 'خدمة عملاء مخصصة', desc: 'رد < ساعتين عبر واتساب، 6 أيام. شخص حقيقي وليس آلة.', val: '0557 440 522' },
      { ico: '⏱️', title: '48 ساعة مضمونة', desc: 'الإنتاج والتسليم من ورشتنا خلال 48 ساعة عمل. مكتوب في العرض.', val: 'الأسرع في الجزائر' },
      { ico: '📸', title: 'صور قبل الشحن', desc: 'تعتمد كل قطعة بالصورة قبل الإرسال. صفر مفاجآت سيئة.', val: 'تحكم جودة مضمون' },
      { ico: '🔁', title: 'إعادة الطلب برسالة', desc: 'تصاميمك محفوظة. موظف جديد? رسالة واحدة وزيّه ينتج.', val: 'توفير ساعات' },
    ],
    processKicker: 'عملية بسيطة، مقصودة',
    processH2a: 'من الشعار إلى فريقك بالزي الموحد: ',
    processH2b: '4 خطوات، بدون تعقيد.',
    processLead: 'عملك الوحيد: إرسال الشعار. نحن نتولى الباقي.',
    steps: [
      { title: 'أرسل شعارك', desc: 'واتساب أو إيميل أو الموقع. دقيقتان فقط.' },
      { title: 'اعتمد التصميم', desc: 'يصلك مجاني في ساعتين. عرض سعر واضح. قابل للتعديل.' },
      { title: 'إنتاج 48 ساعة', desc: 'طباعة أو تطريز في ورشتنا. نرسل صور المراقبة.' },
      { title: 'توصيل 58 ولاية', desc: 'تصاميمك محفوظة للطلبات القادمة. رسالة واحدة = طلب جديد.' },
    ],
    testiKicker: 'من يثق بنا',
    testiH2a: 'جرّبوا.',
    testiH2b: 'وبقوا معنا.',
    testimonials: [
      { quote: 'معرض بعد 4 أيام والمورد تخلى عنا. كاراكتير أنتجت 80 بولو مطرز في 48 ساعة. جودة عالية جداً.', who: 'كريم ب.', role: 'مطعم الكاف، الجزائر', result: '80 بولو • 48 ساعة' },
      { quote: 'صور المراقبة غيّرت كل شيء. 45 وزرة للعيادة، كل تطريزة اعتمدناها قبل الإرسال. صفر إرجاع.', who: 'د. سميرة م.', role: 'عيادة الشفاء', result: '45 وزرة • 0 عيب' },
      { quote: '120 صدرية عاكسة. شهر عمل مكثف وظلت ممتازة. الطلب الثاني تم برسالة واتساب واحدة.', who: 'ياسين و.', role: 'BTP Construct', result: '120 صدرية • طلب تلقائي' },
    ],
    offerKicker: 'عرض أول طلب',
    offerTitle: 'جرّب بدون مخاطرة',
    offerSub: 'كل ما تحتاجه لاكتشاف جودتنا:',
    offerItems: [
      'تصميم مجاني في ساعتين (قيمته 5000 دج)',
      'إنتاج 48 ساعة مضمون كتابياً',
      'صور مراقبة قبل التسليم',
      'تصاميمك محفوظة (إعادة طلب برسالة)',
      'تخفيضات: −15% من 51 قطعة، −30% من 200+',
      'دعم واتساب مخصص (< ساعتين، 6 أيام)',
    ],
    offerCta: 'ابدأ الآن ←',
    offerScarcity: '⚡ أماكن محدودة: 12 حساب جديد شهرياً فقط.',
    guaranteeTitle: 'ضمان بدون مخاطرة',
    guaranteeText: 'تعتمد التصميم قبل الإنتاج. تعتمد الصور قبل الشحن. لو وصلتك قطعة معيبة رغم ذلك، نعيد صنعها مجاناً. المخاطرة علينا—هذا منطقي، هذه مهنتنا.',
    faqKicker: 'أسئلة متكررة',
    faqH2: 'قبل الانطلاق، وضّح كل شيء.',
    faqs: [
      { q: 'فعلاً 48 ساعة؟ حتى 200 قطعة?', a: 'نعم. ورشتنا بـ20 شخص وآلات صناعية. 48 ساعة عمل مضمونة حتى 500 قطعة، مكتوب في العرض. أكثر من ذلك، عرض قبل دفع.' },
      { q: 'إذا الجودة ما أعجبتني؟', a: 'تعتمد التصميم قبل الإنتاج والصور قبل الشحن. لو عيب صناعي ظهر، نعيد مجاناً.' },
      { q: 'حد أدنى للطلب؟', a: 'قطعة واحدة. لكن أسعار المؤسسات تصبح ممتازة من 51 قطعة (−15%).' },
      { q: 'الدفع كيف؟', a: 'عرض واضح في ساعتين. ديناردز، بريدي موب أو تحويل. تسبيق عند الطلب، والباقي بعد الصور. بدون عمياء.' },
      { q: 'توصيل لكل الجزائر؟', a: 'نعم، 58 ولاية. العاصمة 24 ساعة بعد الإنتاج، باقي الولايات 2–5 أيام.' },
    ],
    finalH2: 'جاهز للبدء؟',
    finalP: 'أرسل شعارك الآن. تصميم مجاني في ساعتين، بدون التزام.',
    finalCta: '💬 أرسل شعاري',
    finalMicro: 'رد < ساعتين، 6 أيام • 0557440522',
    footer1: '© 2026 كاراكتير ستور • أزياء موحدة وهوية بصرية • الجزائر',
    footer2: '📞 0557440522 • 📧 yakoumobi@gmail.com',
    menuItems: [
      {
        label: 'الأدوات',
        items: [
          { label: 'المصمم', href: '/designer' },
          { label: 'الاستوديو 3D', href: '/studio-3d' },
          { label: 'محرر الطلبات', href: '/configurateur' },
        ]
      },
      {
        label: 'اكتشف',
        items: [
          { label: 'كيف يعمل', href: '/comment-ca-marche' },
          { label: 'المنتجات', href: '/produits' },
          { label: 'الكتالوج', href: '/collection' },
          { label: 'الطباعة عند الطلب', href: '/print-on-demand' },
        ]
      },
      {
        label: 'من أجل من',
        items: [
          { label: 'المؤسسات', href: '/entreprises' },
          { label: 'الأفراد', href: '/particuliers' },
        ]
      },
    ],
  },
}

function useReveal(lang: Lang) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [lang])
}

const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Cairo:wght@600;700;800;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body, html {
      background: ${C.white};
      color: ${C.textDark};
      font-weight: 400;
      line-height: 1.6;
    }

    .lang-fr { font-family: 'Inter', sans-serif; }
    .lang-ar { font-family: 'Cairo', sans-serif; }

    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .6s ease-out, transform .6s ease-out; }
    .reveal.in { opacity: 1; transform: translateY(0); }

    a { transition: color .2s ease; }
    a:hover { text-decoration: underline; }

    header {
      position: sticky; top: 0; z-index: 100;
      background: ${C.navy};
      padding: 16px 40px;
      display: flex; justify-content: space-between; align-items: center;
    }
    header img { height: 32px; width: auto; }
    header .actions { display: flex; align-items: center; gap: 12px; }
    header .menu-btn {
      background: ${C.gold}; color: ${C.navy};
      padding: 10px 18px; border-radius: 8px;
      font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: .5px;
      border: none; cursor: pointer;
      transition: all .25s;
    }
    header .menu-btn:hover { box-shadow: 0 8px 24px rgba(212,165,116,.35); transform: translateY(-2px); }
    header .lang-btn {
      border: 1.5px solid rgba(255,255,255,.3);
      background: transparent; color: ${C.white};
      padding: 9px 14px; border-radius: 8px;
      font-weight: 700; font-size: 12px; cursor: pointer;
      transition: all .25s;
    }
    header .lang-btn:hover { border-color: ${C.gold}; color: ${C.gold}; }

    /* MENU DRAWER */
    .menu-overlay {
      position: fixed; inset: 0; background: rgba(15,36,56,.5);
      z-index: 99; opacity: 0; pointer-events: none;
      transition: opacity .3s;
    }
    .menu-overlay.open { opacity: 1; pointer-events: all; }

    .menu-drawer {
      position: fixed; top: 0; left: 0; height: 100vh; width: 80%;
      max-width: 300px;
      background: ${C.white};
      z-index: 101; overflow-y: auto;
      transform: translateX(-100%); transition: transform .3s ease-out;
    }
    .menu-drawer.open { transform: translateX(0); }
    .menu-drawer[dir="rtl"] { left: auto; right: 0; transform: translateX(100%); }
    .menu-drawer[dir="rtl"].open { transform: translateX(0); }

    .menu-close {
      background: none; border: none;
      font-size: 24px; color: ${C.textDark};
      cursor: pointer; padding: 16px; width: 100%;
      text-align: right;
    }
    .menu-drawer[dir="rtl"] .menu-close { text-align: left; }

    .menu-content {
      padding: 0 24px 40px;
    }

    .menu-section {
      margin-bottom: 32px;
    }

    .menu-section .label {
      font-size: 11px; font-weight: 900;
      color: ${C.navy}; text-transform: uppercase;
      letter-spacing: 1.5px; margin-bottom: 16px;
      display: block;
    }

    .menu-nav {
      display: flex; flex-direction: column; gap: 12px;
    }

    .menu-nav a, .menu-nav button {
      padding: 12px 16px; border-radius: 8px;
      border: none; background: ${C.bgLight};
      color: ${C.textDark}; font-weight: 600;
      font-size: 14px; text-decoration: none;
      cursor: pointer; transition: all .2s;
      text-align: left;
      display: block;
    }
    .menu-nav a:hover { text-decoration: none; }
    .menu-drawer[dir="rtl"] .menu-nav a,
    .menu-drawer[dir="rtl"] .menu-nav button { text-align: right; }

    .menu-nav a:hover, .menu-nav button:hover {
      background: ${C.gold}; color: ${C.navy};
    }

    .menu-divider {
      height: 1px; background: ${C.border}; margin: 24px 0;
    }

    .menu-cta {
      width: 100%; padding: 14px 16px; border-radius: 8px;
      background: ${C.gold}; color: ${C.navy};
      border: none; font-weight: 700; font-size: 14px;
      text-transform: uppercase; letter-spacing: .5px;
      cursor: pointer; transition: all .2s;
    }
    .menu-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(212,165,116,.35); text-decoration: none; }

    .wrap { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

    .hero {
      padding: 96px 0 64px; text-align: center;
      background: linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%);
      color: ${C.white};
    }
    .hero .eyebrow {
      display: inline-block;
      border: 1px solid rgba(212,165,116,.4);
      color: ${C.gold};
      padding: 8px 18px; border-radius: 999px;
      font-size: 12px; font-weight: 700; letter-spacing: .5px;
      margin-bottom: 32px;
      background: rgba(212,165,116,.12);
    }
    .hero h1 {
      font-size: clamp(32px, 6vw, 48px);
      font-weight: 700; line-height: 1.15;
      margin-bottom: 24px; color: ${C.white};
    }
    .hero h1 .accent { color: ${C.gold}; }
    .hero .sub {
      font-size: 20px; color: rgba(255,255,255,.85);
      max-width: 680px; margin: 0 auto 40px; font-weight: 400;
    }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      padding: 14px 32px; border-radius: 8px;
      font-weight: 700; font-size: 14px;
      text-decoration: none; cursor: pointer;
      transition: all .25s; border: none;
    }
    .btn:hover { transform: translateY(-3px); text-decoration: none; }
    .btn-accent { background: ${C.gold}; color: ${C.navy}; box-shadow: 0 8px 24px rgba(212,165,116,.3); }
    .btn-accent:hover { box-shadow: 0 12px 32px rgba(212,165,116,.45); }
    /* Bouton secondaire — utilisé sur les sections à fond navy (hero, CTA final) :
       contour blanc pour rester lisible sur fond sombre. */
    .btn-outline { border: 1.5px solid rgba(255,255,255,.5); color: ${C.white}; background: transparent; }
    .btn-outline:hover { border-color: ${C.white}; background: rgba(255,255,255,.08); }

    /* Pulse au chargement sur le CTA principal du hero */
    @keyframes ctaPulse {
      0%, 100% { box-shadow: 0 8px 24px rgba(212,165,116,.3); }
      50% { box-shadow: 0 8px 32px rgba(212,165,116,.6); }
    }
    .hero .btn-accent { animation: ctaPulse 1.8s ease-in-out 1; }

    .proofbar {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 18px;
      margin-top: 48px; font-size: 13px; color: rgba(255,255,255,.75); font-weight: 600;
    }
    .proofbar span { display: flex; align-items: center; gap: 8px; }
    .proofbar .check { color: ${C.gold}; }
    .proofbar b { color: ${C.white}; }

    .section { padding: 64px 0; }
    .section-light { background: ${C.bgLight}; }
    /* Toujours sur fond blanc/gris clair dans cette page → navy (l'or clair de la
       charte n'a pas assez de contraste en petit texte sur fond clair). */
    .kicker { color: ${C.navy}; font-size: 11px; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 16px; text-align: center; text-transform: uppercase; }
    .h2 { font-size: clamp(26px, 4.5vw, 36px); font-weight: 700; text-align: center; line-height: 1.2; margin-bottom: 20px; color: ${C.navy}; }
    .h2 .accent { color: ${C.goldText}; }
    .lead { text-align: center; color: ${C.textMuted}; max-width: 640px; margin: 0 auto 56px; font-size: 16px; line-height: 1.6; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }

    .pain {
      background: ${C.white};
      border: 1px solid ${C.border};
      border-left: 4px solid ${C.red};
      border-radius: 8px; padding: 32px;
      transition: all .3s;
    }
    .pain:hover { box-shadow: 0 8px 24px rgba(0,0,0,.08); }
    .pain .x {
      width: 32px; height: 32px; border-radius: 999px;
      background: ${C.red}; color: ${C.white};
      display: flex; align-items: center; justify-content: center;
      font-size: 15px; font-weight: 800; margin-bottom: 16px;
    }
    .pain .title { font-weight: 700; font-size: 15px; margin-bottom: 6px; color: ${C.textDark}; }
    .pain .desc { font-size: 14px; color: ${C.textMuted}; }

    .value-card {
      background: ${C.white};
      border: 1px solid ${C.border};
      border-left: 4px solid ${C.gold};
      border-radius: 8px; padding: 32px;
      transition: all .3s;
    }
    .value-card:hover { transform: scale(1.02); border-left-width: 6px; box-shadow: 0 12px 32px rgba(26,58,82,.12); }
    .value-card .ico-circle {
      width: 40px; height: 40px; border-radius: 999px;
      background: ${C.navy};
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; margin-bottom: 16px;
    }
    .value-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 8px; color: ${C.navy}; }
    .value-card p { font-size: 16px; line-height: 1.6; color: ${C.textMuted}; }
    .value-card .val { display: inline-block; margin-top: 14px; color: ${C.navy}; font-size: 12px; font-weight: 800; }

    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
    .step {
      background: ${C.white};
      border: 1px solid ${C.border};
      border-radius: 8px; padding: 32px;
    }
    .step .num {
      width: 44px; height: 44px; border-radius: 999px;
      background: ${C.navy}; color: ${C.gold};
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 18px; margin-bottom: 16px;
    }
    .step h3 { font-size: 15px; font-weight: 700; margin-bottom: 8px; color: ${C.textDark}; }
    .step p { font-size: 14px; color: ${C.textMuted}; }

    .testi {
      background: ${C.navy};
      border-radius: 8px; padding: 32px;
    }
    .testi .stars { color: ${C.gold}; letter-spacing: 2px; margin-bottom: 14px; font-size: 14px; }
    .testi .quote { font-size: 18px; font-style: italic; line-height: 1.7; margin-bottom: 16px; color: ${C.white}; font-weight: 400; }
    .testi .who { font-weight: 700; font-size: 13px; color: ${C.gold}; }
    .testi .role { font-size: 12px; color: rgba(255,255,255,.65); }
    .testi .result { display: inline-block; margin-top: 12px; background: rgba(212,165,116,.15); color: ${C.gold}; padding: 6px 14px; border-radius: 999px; font-size: 11px; font-weight: 800; }

    .offer-box {
      background: ${C.white};
      border: 2px solid ${C.gold};
      border-radius: 8px; padding: 48px 32px; text-align: center;
      max-width: 720px; margin: 0 auto;
    }
    .offer-box h3 { font-size: clamp(24px, 4vw, 36px); font-weight: 700; margin-bottom: 12px; color: ${C.navy}; }
    .offer-box .sub { color: ${C.textMuted}; font-size: 16px; margin-bottom: 32px; }
    .offer-list { max-width: 500px; margin: 0 auto 36px; }
    .offer-list li {
      list-style: none; display: flex; gap: 14px; align-items: flex-start;
      padding: 12px 0; border-bottom: 1px solid ${C.border};
      font-size: 14px; font-weight: 600; text-align: start; color: ${C.textDark};
    }
    .offer-list li:last-child { border-bottom: none; }
    .offer-list li .check { color: ${C.green}; font-weight: 900; font-size: 16px; }

    .guarantee {
      display: flex; gap: 20px; align-items: flex-start;
      background: ${C.white};
      border: 1px solid ${C.border};
      border-left: 4px solid ${C.gold};
      border-radius: 8px; padding: 32px; max-width: 720px; margin: 0 auto;
    }
    .guarantee .shield { font-size: 42px; flex-shrink: 0; }
    .guarantee h3 { font-size: 17px; font-weight: 900; margin-bottom: 8px; color: ${C.navy}; }
    .guarantee p { font-size: 14px; color: ${C.textMuted}; }

    .faq { max-width: 680px; margin: 0 auto; border-radius: 8px; overflow: hidden; border: 1px solid ${C.border}; }
    .faq-item { background: ${C.navy}; border-bottom: 1px solid rgba(255,255,255,.12); cursor: pointer; }
    .faq-item:last-child { border-bottom: none; }
    .faq-item h3 {
      font-weight: 700; font-size: 15px; display: flex; justify-content: space-between; align-items: center; gap: 16px;
      color: ${C.white}; padding: 20px 24px;
    }
    .faq-item .toggle { color: ${C.gold}; font-weight: 900; font-size: 18px; flex-shrink: 0; }
    .faq-item .answer {
      max-height: 0; overflow: hidden; transition: max-height .25s ease;
      background: ${C.bgLight};
    }
    .faq-item.active .answer { max-height: 240px; }
    .faq-item p { font-size: 14px; color: ${C.textMuted}; line-height: 1.8; padding: 0 24px 20px; }

    .final {
      text-align: center; padding: 96px 40px;
      background: linear-gradient(135deg, ${C.navy} 0%, ${C.navyDark} 100%);
    }
    .final h2 { font-size: clamp(28px, 5vw, 36px); font-weight: 700; line-height: 1.2; margin-bottom: 18px; color: ${C.white}; }
    .final p { color: rgba(255,255,255,.8); margin-bottom: 40px; font-size: 17px; }
    .final .cta-row { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
    .final .micro { font-size: 12px; color: rgba(255,255,255,.6); margin-top: 20px; }

    footer { background: ${C.navy}; padding: 48px 40px; text-align: center; }
    footer img { height: 30px; margin-bottom: 18px; }
    footer p { font-size: 12px; color: rgba(255,255,255,.65); font-weight: 600; }

    @media (max-width: 1199px) {
      .grid { grid-template-columns: repeat(2, 1fr); }
      .steps { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 768px) {
      .wrap { padding: 0 20px; }
      .grid, .steps { grid-template-columns: 1fr; }
      .section { padding: 48px 0; }
      .guarantee { flex-direction: column; }
      header { padding: 12px 20px; }
      .hero { padding: 64px 0 48px; }
      .final { padding: 64px 20px; }
    }
  `}</style>
)

export default function EntreprisePage() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = T[lang]
  useReveal(lang)
  const [faqOpen, setFaqOpen] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'ar' : 'fr')
    setFaqOpen(0)
  }

  return (
    <div dir={t.dir} className={lang === 'ar' ? 'lang-ar' : 'lang-fr'} style={{ background: C.white, color: C.textDark }}>
      <GlobalStyle />

      {/* HEADER */}
      <header>
        <Link href="/"><img src={LOGO} alt="Caractère" /></Link>
        <div className="actions">
          <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>{t.devisBtn}</button>
        </div>
      </header>

      {/* MENU DRAWER */}
      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <div className={`menu-drawer ${menuOpen ? 'open' : ''}`} dir={t.dir}>
        <button className="menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        <div className="menu-content">
          {t.menuItems.map((section, i) => (
            <div key={i} className="menu-section">
              <span className="label">{section.label}</span>
              <div className="menu-nav">
                {section.items.map((item, j) => (
                  <Link key={j} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</Link>
                ))}
              </div>
            </div>
          ))}
          <div className="menu-divider" />
          {/* Réutilise finalCta (déjà traduit FR/AR) — l'ancien texte était toujours en
              français ici, y compris en mode arabe. */}
          <a href={WA} className="menu-cta" onClick={() => setMenuOpen(false)}>{t.finalCta}</a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div className="reveal in">
            <span className="eyebrow">{t.eyebrow}</span>
            <h1>
              {t.h1a}<span className="accent">{t.h1b}</span><br />
              {t.h1c}<br/>
              <span className="accent">{t.h1d}</span>
            </h1>
            <p className="sub">{t.sub}</p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href={WA} className="btn btn-accent">{t.ctaMaquette}</a>
              <Link href="/configurateur" className="btn btn-outline">{t.ctaConfig}</Link>
            </div>
            <div className="proofbar">
              <span><span className="check">✓</span> <b>500+</b> {t.proof1}</span>
              <span><span className="check">✓</span> <b>50 000+</b> {t.proof2}</span>
              <span><span className="check">✓</span> <b>4,9/5</b> {t.proof3}</span>
              <span><span className="check">✓</span> {t.proof4} <b>{t.proof4b}</b></span>
            </div>
          </div>
        </div>
      </section>

      {/* DOULEURS */}
      <section className="section section-light">
        <div className="wrap">
          <p className="kicker reveal">{t.painKicker}</p>
          <h2 className="h2 reveal">{t.painH2a}<span className="accent">{t.painH2b}</span></h2>
          <p className="lead reveal">{t.painLead}</p>
          <div className="grid">
            {t.pains.map((p, i) => (
              <div key={i} className="pain reveal">
                <span className="x">✕</span>
                <p className="title">{p.title}</p>
                <p className="desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE STACK */}
      <section className="section">
        <div className="wrap">
          <p className="kicker reveal">{t.valueKicker}</p>
          <h2 className="h2 reveal">{t.valueH2a} <span className="accent">{t.valueH2b}</span></h2>
          <p className="lead reveal">{t.valueLead}</p>
          <div className="grid">
            {t.values.map((v, i) => (
              <div key={i} className="value-card reveal">
                <span className="ico-circle">{v.ico}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
                <span className="val">{v.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-light">
        <div className="wrap">
          <p className="kicker reveal">{t.processKicker}</p>
          <h2 className="h2 reveal">{t.processH2a}<span className="accent">{t.processH2b}</span></h2>
          <p className="lead reveal">{t.processLead}</p>
          <div className="steps">
            {t.steps.map((s, i) => (
              <div key={i} className="step reveal">
                <div className="num">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="section">
        <div className="wrap">
          <p className="kicker reveal">{t.testiKicker}</p>
          <h2 className="h2 reveal">{t.testiH2a} <span className="accent">{t.testiH2b}</span></h2>
          <div className="grid" style={{ marginTop: 52 }}>
            {t.testimonials.map((tm, i) => (
              <div key={i} className="testi reveal">
                <div className="stars">★★★★★</div>
                <p className="quote">"{tm.quote}"</p>
                <p className="who">{tm.who}</p>
                <p className="role">{tm.role}</p>
                <span className="result">{tm.result}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRE */}
      <section className="section section-light">
        <div className="wrap">
          <p className="kicker reveal">{t.offerKicker}</p>
          <div className="offer-box reveal">
            <h3>{t.offerTitle}</h3>
            <p className="sub">{t.offerSub}</p>
            <ul className="offer-list">
              {t.offerItems.map((item, i) => (
                <li key={i}><span className="check">✓</span><span>{item}</span></li>
              ))}
            </ul>
            <a href={WA} className="btn btn-accent" style={{ width: '100%', maxWidth: 380 }}>{t.offerCta}</a>
            <p style={{ fontSize: 12, color: C.textMuted, marginTop: 18 }}>{t.offerScarcity}</p>
          </div>
        </div>
      </section>

      {/* GARANTIE */}
      <section className="section">
        <div className="wrap">
          <div className="guarantee reveal">
            <span className="shield">🛡️</span>
            <div>
              <h3>{t.guaranteeTitle}</h3>
              <p>{t.guaranteeText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section-light">
        <div className="wrap">
          <p className="kicker reveal">{t.faqKicker}</p>
          <h2 className="h2 reveal">{t.faqH2}</h2>
          <div className="faq" style={{ marginTop: 52 }}>
            {t.faqs.map((f, i) => (
              <div key={i} className={`faq-item reveal ${faqOpen === i ? 'active' : ''}`} onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                <h3>{f.q}<span className="toggle">{faqOpen === i ? '−' : '+'}</span></h3>
                <div className="answer"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="final">
        <div className="wrap">
          <div className="reveal">
            <h2>{t.finalH2}</h2>
            <p>{t.finalP}</p>
            <div className="cta-row">
              <a href={WA} className="btn btn-accent" style={{ fontSize: 15, padding: '16px 40px', height: 48 }}>{t.finalCta}</a>
              <Link href="/configurateur" className="btn btn-outline" style={{ fontSize: 15, padding: '16px 40px', height: 48 }}>{t.ctaConfig}</Link>
            </div>
            <p className="micro">{t.finalMicro}</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <img src={LOGO} alt="Caractère" />
        <p>{t.footer1}</p>
        <p style={{ marginTop: 10 }}>{t.footer2}</p>
      </footer>
    </div>
  )
}
