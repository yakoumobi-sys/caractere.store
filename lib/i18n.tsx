'use client'

// Choix FR/AR pour le parcours d'achat.
//
// Le site est rédigé en français ; l'arabe couvre ici le parcours de commande
// (configurateur et collection), c'est-à-dire les écrans où un client doit
// comprendre exactement ce qu'il choisit et ce qu'il paie. Le choix est
// mémorisé et appliqué à `<html lang dir>`, ce qui bascule toute la mise en
// page en RTL : les styles utilisent des propriétés logiques
// (`inset-inline`, `padding-inline`, `text-align: start`), donc le miroir est
// automatique — il n'y a pas de feuille de style RTL séparée à maintenir.

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Langue = 'fr' | 'ar'

const CLE_STOCKAGE = 'caractere_langue'

type Dictionnaire = Record<string, string>

const FR: Dictionnaire = {
  'langue.nom': 'Français',
  'langue.autre': 'العربية',

  'etape.produit': 'Produit',
  'etape.options': 'Options',
  'etape.logo': 'Logo',
  'etape.contact': 'Contact',
  'etape.numero': 'Étape',

  'nav.retour': '← Retour',
  'nav.continuer': 'Continuer →',
  'nav.passer': 'Passer cette étape →',
  'nav.confirmer': 'Confirmer la commande',
  'nav.envoi': 'Enregistrement…',

  'produit.titre': 'Quel produit personnaliser ?',
  'produit.sous': 'Choisissez le textile sur lequel on va imprimer votre visuel.',
  'produit.b2bTitre': 'Quel textile pour votre équipe ?',
  'produit.b2bSous': 'Uniformes, workwear ou goodies — sélectionnez le support à personnaliser.',
  'produit.devis': 'Prix sur devis',
  'produit.des': 'dès',
  'produit.chargement': 'Chargement du catalogue…',

  'introuvable.titre': 'Produit introuvable',
  'introuvable.texte':
    "Le lien que vous avez suivi ne correspond à aucune pièce de notre catalogue — il a peut-être été modifié ou le produit retiré. Choisissez une pièce ci-dessous pour continuer.",

  'options.titre': 'Options de personnalisation',
  'options.sous': 'Technique, couleur, tailles et quantités.',
  'options.technique': "Technique d'impression",
  'options.couleur': 'Couleur du textile',
  'options.couleurUnique': "Cette pièce n'existe que dans ce coloris.",
  'options.tailles': 'Tailles et quantités',
  'options.taillesAide':
    'Indiquez le nombre de pièces par taille. Le total se met à jour automatiquement.',
  'options.sansTaille': 'Quantité',
  'options.total': 'Total pièces',
  'options.guide': 'Guide des tailles',
  'options.paliers': 'Paliers de remise',

  'logo.titre': 'Votre logo ou design',
  'logo.sous': 'Envoyez le fichier de votre logo ou de votre visuel.',
  'logo.depot': 'Glissez votre fichier ici',
  'logo.parcourir': 'ou cliquez pour parcourir',
  'logo.envoi': 'Envoi en cours…',
  'logo.pret': '✓ Fichier reçu',
  'logo.echec': "L'envoi du fichier a échoué. Réessayez, ou transmettez-le sur WhatsApp.",
  'logo.retirer': 'Retirer',
  'logo.importe': 'Logo importé depuis le Designer',

  'contact.titre': 'Vos coordonnées',
  'contact.sous': 'Dernière étape avant enregistrement de la commande.',
  'contact.nom': 'Nom complet',
  'contact.entreprise': 'Entreprise',
  'contact.telephone': 'Téléphone',
  'contact.email': 'Email',
  'contact.notes': 'Notes complémentaires',
  'contact.livraison': 'Livraison',
  'contact.wilaya': 'Wilaya',
  'contact.commune': 'Commune ou ville',
  'contact.adresse': 'Adresse de livraison',
  'contact.urgent': 'Commande urgente',
  'contact.urgentSous': 'Traitement prioritaire — délai à confirmer avec l’atelier.',
  'contact.obligatoire': 'obligatoire',
  'contact.facultatif': 'facultatif',

  'manquants.titre': 'Il manque quelques informations',
  'manquants.produit': 'Choisir un produit',
  'manquants.quantite': 'Indiquer au moins une pièce',
  'manquants.nom': 'Renseigner votre nom',
  'manquants.telephone': 'Renseigner votre téléphone',
  'manquants.wilaya': 'Choisir la wilaya de livraison',

  'resume.titre': 'Récapitulatif',
  'resume.produit': 'Produit',
  'resume.technique': 'Technique',
  'resume.couleur': 'Couleur',
  'resume.tailles': 'Tailles',
  'resume.quantite': 'Quantité',
  'resume.logo': 'Logo',
  'resume.aucunLogo': 'Aucun',
  'resume.vide': '—',
  'resume.sousTotal': 'Sous-total vêtements',
  'resume.livraison': 'Livraison',
  'resume.livraisonAConfirmer': 'À confirmer',
  'resume.remise': 'Remise volume',
  'resume.total': 'Total',
  'resume.devis': "Tarif non communiqué pour cette pièce : l'atelier vous adresse un devis chiffré.",

  'confirmation.titre': 'Commande enregistrée',
  'confirmation.texte':
    'Votre commande est enregistrée. Un commercial vous rappelle pour confirmer les détails, les délais et le paiement.',
  'confirmation.reference': 'Référence de commande',
  'confirmation.suivre': 'Suivre ma commande',
  'confirmation.nouvelle': 'Nouvelle commande',
  'confirmation.whatsapp': 'Envoyer le récapitulatif sur WhatsApp',

  'erreur.enregistrement':
    "Nous n'avons pas pu enregistrer votre commande. Vos informations sont conservées sur cette page : réessayez, ou transmettez-les sur WhatsApp.",
  'erreur.whatsapp': 'Transmettre ma demande sur WhatsApp',
}

const AR: Dictionnaire = {
  'langue.nom': 'العربية',
  'langue.autre': 'Français',

  'etape.produit': 'المنتج',
  'etape.options': 'الخيارات',
  'etape.logo': 'الشعار',
  'etape.contact': 'بياناتك',
  'etape.numero': 'الخطوة',

  'nav.retour': '→ رجوع',
  'nav.continuer': 'متابعة ←',
  'nav.passer': 'تخطي هذه الخطوة ←',
  'nav.confirmer': 'تأكيد الطلب',
  'nav.envoi': 'جارٍ التسجيل…',

  'produit.titre': 'ما المنتج الذي تريد تخصيصه؟',
  'produit.sous': 'اختر القطعة التي سنطبع عليها تصميمك.',
  'produit.b2bTitre': 'ما الزي المناسب لفريقك؟',
  'produit.b2bSous': 'أزياء موحّدة، ملابس عمل أو هدايا — اختر القطعة المراد تخصيصها.',
  'produit.devis': 'السعر حسب الطلب',
  'produit.des': 'ابتداءً من',
  'produit.chargement': 'جارٍ تحميل الكتالوج…',

  'introuvable.titre': 'المنتج غير موجود',
  'introuvable.texte':
    'الرابط الذي اتبعته لا يطابق أي قطعة في الكتالوج — ربما تغيّر الرابط أو أُزيلت القطعة. اختر قطعة أدناه للمتابعة.',

  'options.titre': 'خيارات التخصيص',
  'options.sous': 'التقنية، اللون، المقاسات والكميات.',
  'options.technique': 'تقنية الطباعة',
  'options.couleur': 'لون القماش',
  'options.couleurUnique': 'هذه القطعة متوفرة بهذا اللون فقط.',
  'options.tailles': 'المقاسات والكميات',
  'options.taillesAide': 'حدّد عدد القطع لكل مقاس. يُحدَّث المجموع تلقائيًا.',
  'options.sansTaille': 'الكمية',
  'options.total': 'مجموع القطع',
  'options.guide': 'دليل المقاسات',
  'options.paliers': 'مستويات التخفيض',

  'logo.titre': 'شعارك أو تصميمك',
  'logo.sous': 'أرسل ملف الشعار أو التصميم.',
  'logo.depot': 'اسحب ملفك إلى هنا',
  'logo.parcourir': 'أو انقر للاختيار',
  'logo.envoi': 'جارٍ الإرسال…',
  'logo.pret': '✓ تم استلام الملف',
  'logo.echec': 'فشل إرسال الملف. أعد المحاولة أو أرسله عبر واتساب.',
  'logo.retirer': 'إزالة',
  'logo.importe': 'تم استيراد الشعار من المصمّم',

  'contact.titre': 'بياناتك',
  'contact.sous': 'الخطوة الأخيرة قبل تسجيل الطلب.',
  'contact.nom': 'الاسم الكامل',
  'contact.entreprise': 'المؤسسة',
  'contact.telephone': 'الهاتف',
  'contact.email': 'البريد الإلكتروني',
  'contact.notes': 'ملاحظات إضافية',
  'contact.livraison': 'التوصيل',
  'contact.wilaya': 'الولاية',
  'contact.commune': 'البلدية أو المدينة',
  'contact.adresse': 'عنوان التوصيل',
  'contact.urgent': 'طلب مستعجل',
  'contact.urgentSous': 'معالجة ذات أولوية — تُحدَّد المدة مع الورشة.',
  'contact.obligatoire': 'إلزامي',
  'contact.facultatif': 'اختياري',

  'manquants.titre': 'تنقص بعض المعلومات',
  'manquants.produit': 'اختر منتجًا',
  'manquants.quantite': 'حدّد قطعة واحدة على الأقل',
  'manquants.nom': 'أدخل اسمك',
  'manquants.telephone': 'أدخل رقم هاتفك',
  'manquants.wilaya': 'اختر ولاية التوصيل',

  'resume.titre': 'ملخّص الطلب',
  'resume.produit': 'المنتج',
  'resume.technique': 'التقنية',
  'resume.couleur': 'اللون',
  'resume.tailles': 'المقاسات',
  'resume.quantite': 'الكمية',
  'resume.logo': 'الشعار',
  'resume.aucunLogo': 'لا يوجد',
  'resume.vide': '—',
  'resume.sousTotal': 'مجموع الملابس',
  'resume.livraison': 'التوصيل',
  'resume.livraisonAConfirmer': 'يُحدَّد لاحقًا',
  'resume.remise': 'تخفيض الكمية',
  'resume.total': 'المجموع',
  'resume.devis': 'لم يُحدَّد سعر هذه القطعة: ترسل لك الورشة عرض سعر مفصّلًا.',

  'confirmation.titre': 'تم تسجيل الطلب',
  'confirmation.texte':
    'تم تسجيل طلبك. سيتصل بك أحد المستشارين لتأكيد التفاصيل والآجال والدفع.',
  'confirmation.reference': 'مرجع الطلب',
  'confirmation.suivre': 'تتبّع طلبي',
  'confirmation.nouvelle': 'طلب جديد',
  'confirmation.whatsapp': 'إرسال الملخّص عبر واتساب',

  'erreur.enregistrement':
    'تعذّر تسجيل طلبك. بياناتك محفوظة في هذه الصفحة: أعد المحاولة أو أرسلها عبر واتساب.',
  'erreur.whatsapp': 'إرسال طلبي عبر واتساب',
}

const DICTIONNAIRES: Record<Langue, Dictionnaire> = { fr: FR, ar: AR }

type ContexteLangue = {
  langue: Langue
  definirLangue: (l: Langue) => void
  /** Traduit une clé. Retombe sur le français, puis sur la clé elle-même. */
  t: (cle: string) => string
  rtl: boolean
}

const Contexte = createContext<ContexteLangue>({
  langue: 'fr',
  definirLangue: () => {},
  t: (cle: string) => FR[cle] ?? cle,
  rtl: false,
})

export function FournisseurLangue({ children }: { children: React.ReactNode }) {
  // On démarre toujours en français pour que le rendu serveur et le premier
  // rendu client coïncident : lire localStorage pendant le rendu initial
  // provoquerait une erreur d'hydratation.
  const [langue, setLangue] = useState<Langue>('fr')

  useEffect(() => {
    try {
      const memorisee = window.localStorage.getItem(CLE_STOCKAGE)
      if (memorisee === 'ar' || memorisee === 'fr') setLangue(memorisee)
    } catch {
      /* navigation privée ou stockage bloqué : le français reste actif */
    }
  }, [])

  useEffect(() => {
    const racine = document.documentElement
    const langPrecedent = racine.lang
    const dirPrecedent = racine.dir
    racine.lang = langue
    racine.dir = langue === 'ar' ? 'rtl' : 'ltr'
    return () => {
      racine.lang = langPrecedent
      racine.dir = dirPrecedent
    }
  }, [langue])

  const definirLangue = useCallback((l: Langue) => {
    setLangue(l)
    try {
      window.localStorage.setItem(CLE_STOCKAGE, l)
    } catch {
      /* le choix vaudra pour cette visite seulement */
    }
  }, [])

  const t = useCallback(
    (cle: string) => DICTIONNAIRES[langue][cle] ?? FR[cle] ?? cle,
    [langue],
  )

  return (
    <Contexte.Provider value={{ langue, definirLangue, t, rtl: langue === 'ar' }}>
      {children}
    </Contexte.Provider>
  )
}

export function useLangue() {
  return useContext(Contexte)
}

/** Formatage monétaire commun : même montant affiché en FR et en AR. */
export function formaterDA(montant: number, langue: Langue = 'fr'): string {
  const nombre = montant.toLocaleString(langue === 'ar' ? 'ar-DZ' : 'fr-DZ')
  return langue === 'ar' ? `${nombre} دج` : `${nombre} DA`
}
