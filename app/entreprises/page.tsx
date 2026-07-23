'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const C = {
  black: '#0C0A09',
  dark: '#111113',
  white: '#FAFAF9',
  gold: '#D4A574',
  muted: '#A8A29E',
}

const LOGO = 'https://aijlvbipvqnvbywxhlbd.supabase.co/storage/v1/object/public/image/logo-white-transparent.png'
const WA = 'https://wa.me/213557440522'

type Lang = 'fr' | 'ar'

const T = {
  fr: {
    dir: 'ltr',
    langBtn: 'AR',
    devisBtn: '💬 Devis en 2h',
    eyebrow: 'Espace Entreprise — Atelier Alger',
    h1a: 'Vos uniformes livrés en ',
    h1b: '48h.',
    h1c: 'Validés en photo. ',
    h1d: 'Garantis.',
    sub: "L'atelier textile qui équipe les restaurants, cliniques et chantiers d'Algérie — sans retard, sans surprise, sans \"on vous rappelle\".",
    ctaMaquette: 'Recevoir ma maquette gratuite →',
    ctaConfig: '⚙️ Configurer en ligne',
    proof1: 'entreprises équipées',
    proof2: 'pièces produites',
    proof3: 'de satisfaction',
    proof4: 'Réponse en',
    proof4b: 'moins de 2h',
    painKicker: "Le vrai coût d'un mauvais fournisseur",
    painH2a: "Un uniforme raté, c'est votre image qui prend le coup. ",
    painH2b: 'Pas la nôtre.',
    painLead: 'Si vous avez déjà commandé des tenues personnalisées en Algérie, vous connaissez probablement ça:',
    pains: [
      { title: 'Fournisseur en retard', desc: 'Votre événement est dans 5 jours. Lui, il répond dans 5 jours.' },
      { title: 'Qualité aléatoire', desc: 'Logo de travers, broderie qui se défait au premier lavage.' },
      { title: 'Zéro visibilité', desc: "Vous payez, puis silence radio jusqu'à la livraison. Ou pas." },
      { title: 'Import = attente', desc: '6 semaines de Chine. Douane. Surprises. Stress.' },
    ],
    valueKicker: 'Pourquoi 500+ entreprises nous font confiance',
    valueH2a: "On a construit l'atelier qu'on aurait voulu avoir ",
    valueH2b: 'comme client.',
    valueLead: "Chaque point ci-dessous répond à une galère qu'on a entendue des centaines de fois.",
    values: [
      { ico: '⏱️', title: 'Production 48h — garantie écrite', desc: "Votre commande sort de notre atelier d'Alger en 48h ouvrées. Pas \"environ\". 48h.", val: "Le délai le plus court d'Algérie" },
      { ico: '📸', title: 'Photos avant expédition', desc: 'Vous validez chaque pièce en photo AVANT qu\'elle parte. Zéro mauvaise surprise à la réception.', val: 'Transparence totale' },
      { ico: '🎨', title: 'Maquette gratuite en 2h', desc: 'Envoyez votre logo, recevez la maquette professionnelle de vos uniformes en 2h. Sans engagement.', val: 'Valeur: 5 000 DA — offerte' },
      { ico: '🏭', title: 'Atelier local, 20 personnes', desc: 'DTF, broderie industrielle, presse. Tout sous un même toit à Alger. Vous pouvez même visiter.', val: 'Zéro intermédiaire' },
      { ico: '📉', title: "Rabais volume jusqu'à −30%", desc: "Plus vous commandez, moins vous payez l'unité. Grille tarifaire claire, sans négociation pénible.", val: 'Dès 51 pièces' },
      { ico: '🔁', title: 'Réassort en 1 message', desc: 'Vos designs sont archivés. Nouveau salarié? Un WhatsApp et son uniforme part en production.', val: 'Gain: des heures chaque mois' },
    ],
    processKicker: 'Simple, volontairement',
    processH2a: 'De votre logo à vos équipes habillées: ',
    processH2b: '4 étapes, zéro friction.',
    processLead: 'Votre seul travail: envoyer un logo et valider. On s\'occupe du reste.',
    steps: [
      { title: 'Envoyez votre logo', desc: 'Sur WhatsApp ou via le configurateur. 2 minutes, montre en main.' },
      { title: 'Validez la maquette', desc: 'Reçue en 2h, gratuite. Devis précis inclus. Modifiable jusqu\'à validation.' },
      { title: 'On produit en 48h', desc: "DTF ou broderie dans notre atelier d'Alger. Photos de contrôle envoyées." },
      { title: "Vous recevez. C'est tout.", desc: 'Livraison 58 wilayas. Designs archivés pour vos futurs réassorts.' },
    ],
    testiKicker: 'Ils ont testé. Ils sont restés.',
    testiH2a: 'Des résultats, ',
    testiH2b: 'pas des promesses.',
    testimonials: [
      { quote: "On avait un salon dans 4 jours et notre fournisseur habituel nous a lâchés. Caractère a produit 80 polos brodés en 48h. Qualité irréprochable, équipe au top le jour J.", who: 'Karim B.', role: 'Gérant — Restaurant El Kef', result: '80 polos • 48h chrono' },
      { quote: 'Les photos avant expédition, ça change tout. 45 blouses pour la clinique, chaque broderie validée avant l\'envoi. Zéro retour, zéro déception.', who: 'Dr. Samira M.', role: 'Directrice — Clinique Al Chifa', result: '45 blouses • 0 défaut' },
      { quote: "120 gilets haute visibilité avec notre logo. Un mois de chantier intensif plus tard: impeccables. Et le réassort se fait en un message WhatsApp.", who: 'Yacine O.', role: 'Directeur travaux — BTP Construct', result: '120 gilets • réassort auto' },
    ],
    offerKicker: "L'offre entreprise",
    offerTitle: 'Le Pack Première Commande',
    offerSub: 'Tout ce qu\'il faut pour tester notre qualité sans risque:',
    offerItems: [
      'Maquette professionnelle en 2h — Offerte (valeur 5 000 DA)',
      'Production prioritaire 48h garantie par écrit',
      'Photos de contrôle avant expédition',
      'Archivage de vos designs pour réassorts en 1 message',
      'Rabais volume: −15% dès 51 pièces, jusqu\'à −30% dès 200',
      'Interlocuteur dédié sur WhatsApp (réponse < 2h, 6j/7)',
    ],
    offerCta: 'Démarrer ma première commande →',
    offerScarcity: '⚡ Capacité limitée: nous acceptons 12 nouveaux comptes entreprise par mois pour tenir le 48h.',
    guaranteeTitle: 'La Garantie "Zéro Pièce Ratée"',
    guaranteeText: 'Vous validez la maquette avant production. Vous validez les photos avant expédition. Et si malgré ces deux contrôles une pièce arrive avec un défaut de fabrication, on la refait gratuitement, sans débat. Le risque est entièrement de notre côté — c\'est normal, c\'est notre métier.',
    faqKicker: "Les questions qu'on nous pose vraiment",
    faqH2: 'Tout ce que vous voulez savoir avant de commander.',
    faqs: [
      { q: "C'est vraiment 48h? Même pour 200 pièces?", a: "Oui. Notre atelier tourne avec 20 personnes et des machines industrielles DTF + broderie. Jusqu'à 500 pièces, le délai de production de 48h ouvrées est garanti par écrit sur votre devis. Au-delà, on vous donne un délai précis avant que vous payiez quoi que ce soit." },
      { q: 'Et si la qualité ne me convient pas?', a: 'Vous validez la maquette avant production, puis les photos avant expédition. Si malgré ça une pièce présente un défaut de fabrication, on la refait gratuitement. C\'est notre garantie, sans discussion.' },
      { q: 'Quel est le minimum de commande?', a: 'Une pièce. Sérieusement. Mais les tarifs entreprise deviennent vraiment intéressants dès 51 pièces (−15%) et 200 pièces (jusqu\'à −30%).' },
      { q: 'Comment se passe le paiement?', a: 'Devis clair sous 2h. Paiement par BaridiMob, CCP ou virement. Acompte à la commande, solde validé après les photos de contrôle. Vous ne payez jamais le solde à l\'aveugle.' },
      { q: 'Vous livrez partout en Algérie?', a: 'Oui, les 58 wilayas. Alger en 24h après production, le reste du pays en 2 à 5 jours selon la zone.' },
    ],
    finalH2: 'Votre maquette gratuite vous attend.',
    finalP: 'Envoyez votre logo maintenant. Dans 2h, vous voyez exactement à quoi ressembleront vos équipes. Sans payer. Sans engagement.',
    finalCta: '💬 Envoyer mon logo sur WhatsApp',
    finalMicro: 'Réponse en moins de 2h, 6j/7 • +213 557 440 522',
    footer1: '© 2026 Caractère Store • Uniformes & Branding B2B • Atelier Alger • Livraison 58 wilayas',
    footer2: '📞 +213 557 440 522 • 📧 yakoumobi@gmail.com',
  },
  ar: {
    dir: 'rtl',
    langBtn: 'FR',
    devisBtn: '💬 عرض سعر في ساعتين',
    eyebrow: 'فضاء المؤسسات — ورشة الجزائر',
    h1a: 'أزياء موحدة تُسلَّم في ',
    h1b: '48 ساعة.',
    h1c: 'مُعتمدة بالصور. ',
    h1d: 'مضمونة.',
    sub: 'الورشة النسيجية التي تجهّز المطاعم والعيادات وورشات البناء في الجزائر — بدون تأخير، بدون مفاجآت، بدون "سنعاود الاتصال بك".',
    ctaMaquette: 'أرسل شعارك واستلم التصميم مجاناً ←',
    ctaConfig: '⚙️ صمّم طلبك عبر الموقع',
    proof1: 'مؤسسة جهّزناها',
    proof2: 'قطعة أنتجناها',
    proof3: 'نسبة الرضا',
    proof4: 'الرد خلال',
    proof4b: 'أقل من ساعتين',
    painKicker: 'التكلفة الحقيقية للمورّد السيّئ',
    painH2a: 'الزيّ الفاشل يضرّ بصورة مؤسستك أنت. ',
    painH2b: 'وليس بصورتنا.',
    painLead: 'إذا سبق لك أن طلبت ملابس مخصصة في الجزائر، فأنت على الأرجح تعرف هذا:',
    pains: [
      { title: 'مورّد متأخر دائماً', desc: 'مناسبتك بعد 5 أيام. وهو يردّ بعد 5 أيام.' },
      { title: 'جودة عشوائية', desc: 'شعار مائل، تطريز يتفكك من أول غسلة.' },
      { title: 'انعدام الشفافية', desc: 'تدفع، ثم صمت تام حتى التسليم. أو لا تسليم أصلاً.' },
      { title: 'الاستيراد = انتظار', desc: '6 أسابيع من الصين. جمارك. مفاجآت. توتر.' },
    ],
    valueKicker: 'لماذا تثق بنا أكثر من 500 مؤسسة',
    valueH2a: 'بنينا الورشة التي كنا نتمنى التعامل معها ',
    valueH2b: 'كزبائن.',
    valueLead: 'كل نقطة أدناه تحلّ مشكلة سمعناها مئات المرات.',
    values: [
      { ico: '⏱️', title: 'إنتاج في 48 ساعة — ضمان مكتوب', desc: 'طلبك يخرج من ورشتنا بالجزائر العاصمة خلال 48 ساعة عمل. ليس "تقريباً". 48 ساعة.', val: 'أقصر مدة في الجزائر' },
      { ico: '📸', title: 'صور قبل الشحن', desc: 'تعتمد كل قطعة بالصورة قبل أن تُشحن. صفر مفاجآت سيئة عند الاستلام.', val: 'شفافية كاملة' },
      { ico: '🎨', title: 'تصميم مجاني في ساعتين', desc: 'أرسل شعارك، واستلم التصميم الاحترافي لأزيائكم في ساعتين. بدون أي التزام.', val: 'قيمته: 5000 دج — مجاناً' },
      { ico: '🏭', title: 'ورشة محلية، 20 عاملاً', desc: 'طباعة DTF، تطريز صناعي، كبس حراري. كل شيء تحت سقف واحد بالعاصمة. يمكنك حتى زيارتنا.', val: 'بدون وسطاء' },
      { ico: '📉', title: 'تخفيضات الكمية حتى −30%', desc: 'كلما زادت الكمية، انخفض سعر القطعة. جدول أسعار واضح، بدون مفاوضات مرهقة.', val: 'ابتداءً من 51 قطعة' },
      { ico: '🔁', title: 'إعادة الطلب برسالة واحدة', desc: 'تصاميمكم محفوظة عندنا. موظف جديد؟ رسالة واتساب واحدة وزيّه يدخل الإنتاج.', val: 'توفير: ساعات كل شهر' },
    ],
    processKicker: 'بسيط، عن قصد',
    processH2a: 'من شعارك إلى فريقك بالزي الموحد: ',
    processH2b: '4 خطوات، بدون تعقيد.',
    processLead: 'عملك الوحيد: إرسال الشعار والاعتماد. نحن نتكفل بالباقي.',
    steps: [
      { title: 'أرسل شعارك', desc: 'عبر واتساب أو عبر الموقع. دقيقتان فقط.' },
      { title: 'اعتمد التصميم', desc: 'يصلك في ساعتين، مجاناً. مع عرض سعر دقيق. قابل للتعديل حتى الاعتماد.' },
      { title: 'ننتج في 48 ساعة', desc: 'طباعة DTF أو تطريز في ورشتنا بالعاصمة. نرسل لك صور المراقبة.' },
      { title: 'تستلم. هذا كل شيء.', desc: 'توصيل لـ58 ولاية. التصاميم محفوظة لطلباتكم القادمة.' },
    ],
    testiKicker: 'جرّبوا. وبقوا معنا.',
    testiH2a: 'نتائج ملموسة، ',
    testiH2b: 'وليست وعوداً.',
    testimonials: [
      { quote: 'كان عندنا معرض بعد 4 أيام وتخلى عنا المورد المعتاد. كاراكتير أنتجت 80 بولو مطرز في 48 ساعة. جودة ممتازة وفريق في المستوى يوم الحدث.', who: 'كريم ب.', role: 'مسيّر — مطعم الكاف', result: '80 بولو • 48 ساعة بالضبط' },
      { quote: 'الصور قبل الشحن غيّرت كل شيء. 45 وزرة طبية للعيادة، كل تطريز اعتمدناه قبل الإرسال. صفر إرجاع، صفر خيبة.', who: 'د. سميرة م.', role: 'مديرة — عيادة الشفاء', result: '45 وزرة • 0 عيب' },
      { quote: '120 صدرية عاكسة بشعارنا. بعد شهر من العمل المكثف في الورشة: ممتازة. وإعادة الطلب تتم برسالة واتساب واحدة.', who: 'ياسين و.', role: 'مدير أشغال — BTP Construct', result: '120 صدرية • إعادة طلب تلقائية' },
    ],
    offerKicker: 'عرض المؤسسات',
    offerTitle: 'باقة الطلب الأول',
    offerSub: 'كل ما تحتاجه لتجربة جودتنا بدون أي مخاطرة:',
    offerItems: [
      'تصميم احترافي في ساعتين — مجاناً (قيمته 5000 دج)',
      'إنتاج بأولوية في 48 ساعة بضمان مكتوب',
      'صور مراقبة قبل الشحن',
      'حفظ تصاميمكم لإعادة الطلب برسالة واحدة',
      'تخفيضات الكمية: −15% من 51 قطعة، حتى −30% من 200 قطعة',
      'مسؤول مخصص لكم على واتساب (رد < ساعتين، 6 أيام/7)',
    ],
    offerCta: 'ابدأ طلبك الأول ←',
    offerScarcity: '⚡ طاقة محدودة: نقبل 12 حساب مؤسسة جديد شهرياً فقط للحفاظ على ضمان الـ48 ساعة.',
    guaranteeTitle: 'ضمان "صفر قطعة فاشلة"',
    guaranteeText: 'تعتمد التصميم قبل الإنتاج. تعتمد الصور قبل الشحن. وإذا رغم هاتين المراقبتين وصلتك قطعة بها عيب صناعي، نعيد صنعها مجاناً، بدون نقاش. المخاطرة كلها علينا — هذا طبيعي، هذه مهنتنا.',
    faqKicker: 'الأسئلة التي تُطرح علينا فعلاً',
    faqH2: 'كل ما تريد معرفته قبل الطلب.',
    faqs: [
      { q: 'هل فعلاً 48 ساعة؟ حتى لـ200 قطعة؟', a: 'نعم. ورشتنا تعمل بـ20 شخصاً وآلات صناعية للطباعة والتطريز. حتى 500 قطعة، مدة الإنتاج 48 ساعة عمل مضمونة كتابياً في عرض السعر. أكثر من ذلك، نعطيك مدة دقيقة قبل أن تدفع أي شيء.' },
      { q: 'وإذا لم تعجبني الجودة؟', a: 'تعتمد التصميم قبل الإنتاج، ثم الصور قبل الشحن. وإذا رغم ذلك ظهر عيب صناعي في قطعة، نعيد صنعها مجاناً. هذا ضماننا، بدون نقاش.' },
      { q: 'ما هو الحد الأدنى للطلب؟', a: 'قطعة واحدة. بجدية. لكن أسعار المؤسسات تصبح مثيرة للاهتمام فعلاً من 51 قطعة (−15%) ومن 200 قطعة (حتى −30%).' },
      { q: 'كيف يتم الدفع؟', a: 'عرض سعر واضح خلال ساعتين. الدفع عبر بريدي موب، CCP أو تحويل بنكي. تسبيق عند الطلب، والباقي بعد اعتماد صور المراقبة. لا تدفع الباقي أبداً على العمياء.' },
      { q: 'هل توصلون لكل ولايات الجزائر؟', a: 'نعم، الـ58 ولاية. العاصمة في 24 ساعة بعد الإنتاج، وباقي الولايات من 2 إلى 5 أيام حسب المنطقة.' },
    ],
    finalH2: 'تصميمك المجاني في انتظارك.',
    finalP: 'أرسل شعارك الآن. خلال ساعتين، سترى بالضبط كيف سيبدو فريقك. بدون دفع. بدون التزام.',
    finalCta: '💬 أرسل شعاري عبر واتساب',
    finalMicro: 'رد خلال أقل من ساعتين، 6 أيام/7 • 0557440522',
    footer1: '© 2026 كاراكتير ستور • أزياء موحدة وهوية بصرية للمؤسسات • ورشة الجزائر • توصيل 58 ولاية',
    footer2: '📞 0557440522 • 📧 yakoumobi@gmail.com',
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
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&family=Cairo:wght@600;700;800;900&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body, html {
      background: ${C.black};
      color: ${C.white};
      font-weight: 600;
      line-height: 1.6;
    }

    .lang-fr { font-family: 'Montserrat', sans-serif; }
    .lang-ar { font-family: 'Cairo', sans-serif; }

    .reveal { opacity: 0; transform: translateY(24px); transition: opacity .7s ease-out, transform .7s ease-out; }
    .reveal.in { opacity: 1; transform: translateY(0); }

    header {
      position: sticky; top: 0; z-index: 100;
      background: rgba(12,10,9,.92);
      backdrop-filter: blur(14px);
      border-bottom: 1px solid rgba(250,250,249,.08);
      padding: 14px 24px;
      display: flex; justify-content: space-between; align-items: center;
    }
    header img { height: 34px; width: auto; }
    header .actions { display: flex; align-items: center; gap: 10px; }
    header .wa-btn {
      background: ${C.gold}; color: ${C.black};
      padding: 10px 18px; border-radius: 8px;
      font-weight: 800; font-size: 13px; text-decoration: none;
      transition: transform .25s;
    }
    header .wa-btn:hover { transform: translateY(-2px); }
    header .lang-btn {
      border: 1.5px solid rgba(250,250,249,.3);
      background: transparent; color: ${C.white};
      padding: 9px 14px; border-radius: 8px;
      font-weight: 900; font-size: 13px; cursor: pointer;
      transition: all .25s; letter-spacing: 1px;
    }
    header .lang-btn:hover { border-color: ${C.gold}; color: ${C.gold}; }

    .wrap { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    .hero { padding: 90px 0 70px; text-align: center; position: relative; }
    .hero .eyebrow {
      display: inline-block;
      border: 1px solid rgba(212,165,116,.4);
      color: ${C.gold};
      padding: 6px 16px; border-radius: 999px;
      font-size: 12px; font-weight: 800; letter-spacing: 1px;
      margin-bottom: 28px;
    }
    .hero h1 {
      font-size: clamp(32px, 6.5vw, 64px);
      font-weight: 900; line-height: 1.15;
      margin-bottom: 22px;
    }
    .hero h1 .accent { color: ${C.gold}; }
    .hero .sub {
      font-size: 17px; color: ${C.muted};
      max-width: 640px; margin: 0 auto 36px; font-weight: 600;
    }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 10px;
      padding: 16px 32px; border-radius: 10px;
      font-weight: 800; font-size: 15px;
      text-decoration: none; cursor: pointer;
      transition: transform .25s, box-shadow .3s; border: none;
    }
    .btn:hover { transform: translateY(-3px); }
    .btn-gold { background: ${C.gold}; color: ${C.black}; box-shadow: 0 12px 34px -12px rgba(212,165,116,.45); }
    .btn-ghost { border: 1.5px solid rgba(250,250,249,.25); color: ${C.white}; background: transparent; }
    .btn-ghost:hover { border-color: ${C.gold}; color: ${C.gold}; }

    .proofbar {
      display: flex; flex-wrap: wrap; justify-content: center; gap: 14px;
      margin-top: 44px; font-size: 13px; color: ${C.muted}; font-weight: 700;
    }
    .proofbar span { display: flex; align-items: center; gap: 7px; }
    .proofbar b { color: ${C.white}; }

    .section { padding: 80px 0; }
    .section-dark { background: ${C.dark}; }
    .kicker { color: ${C.gold}; font-size: 12px; font-weight: 800; letter-spacing: 2px; margin-bottom: 14px; text-align: center; }
    .h2 { font-size: clamp(26px, 4.5vw, 42px); font-weight: 900; text-align: center; line-height: 1.2; margin-bottom: 18px; }
    .h2 .accent { color: ${C.gold}; }
    .lead { text-align: center; color: ${C.muted}; max-width: 620px; margin: 0 auto 52px; font-size: 16px; }

    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }

    .pain {
      background: rgba(250,250,249,.03);
      border: 1px solid rgba(250,250,249,.08);
      border-radius: 14px; padding: 26px;
    }
    .pain .x { color: #EF4444; font-size: 20px; margin-bottom: 12px; display: block; }
    .pain p.title { font-weight: 800; font-size: 15px; margin-bottom: 6px; }
    .pain p.desc { font-size: 13px; color: ${C.muted}; }

    .value-card {
      background: rgba(250,250,249,.04);
      border: 1px solid rgba(250,250,249,.09);
      border-radius: 16px; padding: 30px 26px;
      transition: transform .3s, border-color .3s;
    }
    .value-card:hover { transform: translateY(-5px); border-color: rgba(212,165,116,.45); }
    .value-card .ico { font-size: 30px; margin-bottom: 16px; display: block; }
    .value-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 8px; }
    .value-card p { font-size: 13px; color: ${C.muted}; }
    .value-card .val { display: inline-block; margin-top: 14px; color: ${C.gold}; font-size: 12px; font-weight: 800; }

    .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
    .step {
      background: rgba(250,250,249,.03);
      border: 1px solid rgba(250,250,249,.08);
      border-radius: 14px; padding: 28px 24px; position: relative;
    }
    .step .num {
      width: 40px; height: 40px; border-radius: 10px;
      background: rgba(212,165,116,.14); color: ${C.gold};
      display: flex; align-items: center; justify-content: center;
      font-weight: 900; font-size: 17px; margin-bottom: 16px;
    }
    .step h3 { font-size: 15px; font-weight: 800; margin-bottom: 6px; }
    .step p { font-size: 13px; color: ${C.muted}; }

    .testi {
      background: rgba(250,250,249,.04);
      border: 1px solid rgba(250,250,249,.09);
      border-radius: 16px; padding: 28px;
    }
    .testi .stars { color: ${C.gold}; letter-spacing: 2px; margin-bottom: 14px; font-size: 14px; }
    .testi .quote { font-size: 14px; line-height: 1.8; margin-bottom: 18px; color: ${C.white}; }
    .testi .who { font-weight: 800; font-size: 13px; }
    .testi .role { font-size: 12px; color: ${C.muted}; font-weight: 700; }
    .testi .result { display: inline-block; margin-top: 12px; background: rgba(212,165,116,.12); color: ${C.gold}; padding: 5px 12px; border-radius: 999px; font-size: 11px; font-weight: 800; }

    .offer-box {
      background: linear-gradient(160deg, rgba(212,165,116,.12) 0%, rgba(250,250,249,.03) 60%);
      border: 1.5px solid rgba(212,165,116,.45);
      border-radius: 22px; padding: 46px 34px; text-align: center;
      max-width: 720px; margin: 0 auto;
    }
    .offer-box h3 { font-size: clamp(24px, 4vw, 34px); font-weight: 900; margin-bottom: 12px; }
    .offer-box .sub { color: ${C.muted}; font-size: 15px; margin-bottom: 30px; }
    .offer-list { max-width: 480px; margin: 0 auto 32px; }
    .offer-list li {
      list-style: none; display: flex; gap: 12px; align-items: flex-start;
      padding: 11px 0; border-bottom: 1px solid rgba(250,250,249,.07);
      font-size: 14px; font-weight: 700; text-align: start;
    }
    .offer-list li .check { color: ${C.gold}; font-weight: 900; }

    .guarantee {
      display: flex; gap: 18px; align-items: flex-start;
      background: rgba(250,250,249,.04);
      border: 1px solid rgba(250,250,249,.1);
      border-radius: 16px; padding: 28px; max-width: 720px; margin: 0 auto;
    }
    .guarantee .shield { font-size: 40px; }
    .guarantee h3 { font-size: 17px; font-weight: 900; margin-bottom: 8px; }
    .guarantee p { font-size: 14px; color: ${C.muted}; }

    .faq { max-width: 680px; margin: 0 auto; }
    .faq-item { border-bottom: 1px solid rgba(250,250,249,.09); padding: 22px 0; cursor: pointer; }
    .faq-item h3 { font-weight: 800; font-size: 15px; display: flex; justify-content: space-between; gap: 16px; }
    .faq-item .toggle { color: ${C.gold}; font-weight: 900; }
    .faq-item p { font-size: 14px; color: ${C.muted}; line-height: 1.8; margin-top: 12px; display: none; }
    .faq-item.active p { display: block; }

    .final {
      text-align: center; padding: 90px 24px;
      background: linear-gradient(160deg, rgba(212,165,116,.1) 0%, ${C.black} 65%);
    }
    .final h2 { font-size: clamp(28px, 5.5vw, 50px); font-weight: 900; line-height: 1.15; margin-bottom: 16px; }
    .final p { color: ${C.muted}; margin-bottom: 36px; font-size: 16px; }
    .final .micro { font-size: 12px; color: ${C.muted}; margin-top: 18px; }

    footer { background: ${C.black}; border-top: 1px solid rgba(250,250,249,.07); padding: 40px 24px; text-align: center; }
    footer img { height: 30px; margin-bottom: 16px; opacity: .9; }
    footer p { font-size: 12px; color: ${C.muted}; font-weight: 700; }

    @media (max-width: 768px) {
      .section { padding: 56px 0; }
      .guarantee { flex-direction: column; }
    }
  `}</style>
)

export default function EntreprisePage() {
  const [lang, setLang] = useState<Lang>('fr')
  const t = T[lang]
  useReveal(lang)
  const [faqOpen, setFaqOpen] = useState(0)

  const toggleLang = () => {
    setLang(lang === 'fr' ? 'ar' : 'fr')
    setFaqOpen(0)
  }

  return (
    <div dir={t.dir} className={lang === 'ar' ? 'lang-ar' : 'lang-fr'} style={{ background: C.black, color: C.white }}>
      <GlobalStyle />

      {/* HEADER */}
      <header>
        <Link href="/"><img src={LOGO} alt="Caractère" /></Link>
        <div className="actions">
          <button className="lang-btn" onClick={toggleLang}>{t.langBtn}</button>
          <a href={WA} className="wa-btn">{t.devisBtn}</a>
        </div>
      </header>

      {/* HERO */}
      <section className="hero wrap">
        <div className="reveal in">
          <span className="eyebrow">{t.eyebrow}</span>
          <h1>
            {t.h1a}<span className="accent">{t.h1b}</span><br />
            {t.h1c}<span className="accent">{t.h1d}</span>
          </h1>
          <p className="sub">{t.sub}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={WA} className="btn btn-gold">{t.ctaMaquette}</a>
            <Link href="/configurateur" className="btn btn-ghost">{t.ctaConfig}</Link>
          </div>
          <div className="proofbar">
            <span>✅ <b>500+</b> {t.proof1}</span>
            <span>✅ <b>50 000+</b> {t.proof2}</span>
            <span>✅ <b>4,9/5</b> {t.proof3}</span>
            <span>✅ {t.proof4} <b>{t.proof4b}</b></span>
          </div>
        </div>
      </section>

      {/* DOULEURS */}
      <section className="section section-dark">
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
          <h2 className="h2 reveal">{t.valueH2a}<span className="accent">{t.valueH2b}</span></h2>
          <p className="lead reveal">{t.valueLead}</p>
          <div className="grid">
            {t.values.map((v, i) => (
              <div key={i} className="value-card reveal">
                <span className="ico">{v.ico}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
                <span className="val">{v.val}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-dark">
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
          <h2 className="h2 reveal">{t.testiH2a}<span className="accent">{t.testiH2b}</span></h2>
          <div className="grid" style={{ marginTop: 48 }}>
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
      <section className="section section-dark">
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
            <a href={WA} className="btn btn-gold" style={{ width: '100%', maxWidth: 380 }}>{t.offerCta}</a>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>{t.offerScarcity}</p>
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
      <section className="section section-dark">
        <div className="wrap">
          <p className="kicker reveal">{t.faqKicker}</p>
          <h2 className="h2 reveal">{t.faqH2}</h2>
          <div className="faq" style={{ marginTop: 44 }}>
            {t.faqs.map((f, i) => (
              <div key={i} className={`faq-item reveal ${faqOpen === i ? 'active' : ''}`} onClick={() => setFaqOpen(faqOpen === i ? -1 : i)}>
                <h3>{f.q}<span className="toggle">{faqOpen === i ? '−' : '+'}</span></h3>
                <p>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="final">
        <div className="reveal">
          <h2>{t.finalH2}</h2>
          <p>{t.finalP}</p>
          <a href={WA} className="btn btn-gold" style={{ fontSize: 16, padding: '18px 40px' }}>{t.finalCta}</a>
          <p className="micro">{t.finalMicro}</p>
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
