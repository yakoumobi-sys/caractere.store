"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./DevisExpress.module.css";

const WA = "https://wa.me/213557440522";
const copy = {
  fr: {
    eyebrow: "VOTRE PROJET COMMENCE ICI",
    title: "Une idée.\nUn devis sur mesure.",
    intro:
      "Dites-nous ce que vous imaginez. Notre équipe vous recontacte pour préciser le rendu, le prix et le délai.",
    name: "Votre nom",
    phone: "Téléphone",
    domain: "Votre projet",
    qty: "Quantité souhaitée",
    product: "Le vêtement",
    details: "Les détails qui comptent",
    detailHint: "Couleurs, tailles, emplacement du logo, date souhaitée…",
    file: "Votre logo ou visuel (facultatif)",
    upload: "Choisir un fichier",
    submit: "Demander mon devis gratuit ↗",
    sending: "Envoi en cours…",
    done: "Votre demande est bien enregistrée.",
    doneSub:
      "Notre équipe vous recontactera pour préparer votre devis. Conservez votre référence :",
    again: "Faire une autre demande",
    whatsapp: "Parler à l’équipe sur WhatsApp ↗",
    consent: "J’accepte d’être recontacté(e) au sujet de cette demande.",
    free: "Devis & simulation gratuits",
    minimum: "À partir d’une seule pièce",
    delivery: "Livraison dans les 58 wilayas",
    error:
      "L’envoi n’a pas abouti. Vos informations sont conservées dans le formulaire. Réessayez ou contactez-nous sur WhatsApp.",
    fileError: "Choisissez un fichier PNG, JPG, WEBP ou PDF de moins de 4 Mo.",
    uploadError:
      "Votre fichier n’a pas pu être envoyé. Réessayez ou retirez-le pour transmettre votre demande sans fichier.",
    rate: "Trop de tentatives. Réessayez plus tard ou contactez-nous sur WhatsApp.",
  },
  ar: {
    eyebrow: "مشروعك يبدأ هنا",
    title: "فكرتك.\nعرض سعر على مقاسك.",
    intro:
      "احكِ لنا عن فكرتك. يتواصل معك فريقنا لتحديد التصميم والسعر ومدة الإنجاز.",
    name: "الاسم",
    phone: "رقم الهاتف",
    domain: "نوع المشروع",
    qty: "الكمية المطلوبة",
    product: "نوع الملابس",
    details: "تفاصيل المشروع",
    detailHint: "الألوان، المقاسات، مكان الشعار، التاريخ المطلوب…",
    file: "الشعار أو التصميم (اختياري)",
    upload: "اختيار ملف",
    submit: "اطلب عرض سعر مجاني ↗",
    sending: "جارٍ الإرسال…",
    done: "تم تسجيل طلبك بنجاح.",
    doneSub: "سيتواصل معك فريقنا لتحضير عرض السعر. احتفظ برقم الطلب:",
    again: "إرسال طلب آخر",
    whatsapp: "تواصل مع فريقنا عبر واتساب ↗",
    consent: "أوافق على التواصل معي بخصوص هذا الطلب.",
    free: "عرض سعر وتصميم تجريبي مجاناً",
    minimum: "ابتداءً من قطعة واحدة",
    delivery: "توصيل إلى 58 ولاية",
    error:
      "لم يتم إرسال الطلب. معلوماتك محفوظة في الاستمارة. حاول مجدداً أو تواصل معنا عبر واتساب.",
    fileError: "اختر ملف PNG أو JPG أو WEBP أو PDF أقل من 4 ميغابايت.",
    uploadError: "تعذر إرسال الملف. حاول مجدداً أو احذفه لإرسال الطلب بدونه.",
    rate: "محاولات كثيرة. حاول لاحقاً أو تواصل معنا عبر واتساب.",
  },
};

export default function DevisExpressClient() {
  const [lang, setLang] = useState<"fr" | "ar">("fr");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [reference, setReference] = useState("");
  const requestId = useRef<string | null>(null);
  const uploaded = useRef<{ file: File; url: string } | null>(null);
  const t = copy[lang];

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setError("");
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      let logo = "";
      if (file) {
        if (uploaded.current?.file === file) logo = uploaded.current.url;
        else {
          const fd = new FormData();
          fd.append("file", file);
          const response = await fetch("/api/upload-logo", {
            method: "POST",
            body: fd,
          });
          if (!response.ok) throw new Error("upload");
          const result = await response.json();
          if (!result.url) throw new Error("upload");
          logo = result.url;
          uploaded.current = { file, url: logo };
        }
      }
      requestId.current ??= crypto.randomUUID();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          logo,
          source: "Devis express",
          request_id: requestId.current,
        }),
      });
      if (!response.ok)
        throw new Error(response.status === 429 ? "rate" : "server");
      const result = await response.json();
      if (!result.success) throw new Error("server");
      setReference(result.reference);
      setStatus("done");
    } catch (err) {
      setError(
        (err as Error).message === "upload"
          ? t.uploadError
          : (err as Error).message === "rate"
            ? t.rate
            : t.error,
      );
      setStatus("idle");
    }
  }

  return (
    <div className="c-scope">
      <Navbar />
      <main
        className={`c-wrap ${styles.layout}`}
        dir={lang === "ar" ? "rtl" : "ltr"}
        lang={lang}
      >
        <section className={styles.intro}>
          <div className={styles.top}>
            <Link href="/">← Caractère</Link>
            <button
              type="button"
              onClick={() => {
                setLang(lang === "fr" ? "ar" : "fr");
                setError("");
              }}
            >
              {lang === "fr" ? "العربية" : "Français"}
            </button>
          </div>
          <p className="c-eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
          <ul>
            <li>✓ {t.free}</li>
            <li>✓ {t.minimum}</li>
            <li>✓ {t.delivery}</li>
          </ul>
          <a href={WA} target="_blank" rel="noopener noreferrer">
            {t.whatsapp}
          </a>
          <p className={styles.number}>0557 44 05 22 · Alger</p>
        </section>
        <section
          className={styles.card}
          aria-label={
            lang === "fr" ? "Formulaire de devis" : "استمارة عرض السعر"
          }
        >
          {status === "done" ? (
            <div className={styles.success} role="status">
              <span>✓</span>
              <h2>{t.done}</h2>
              <p>{t.doneSub}</p>
              <strong>{reference}</strong>
              <a
                className="c-btn c-btn-accent"
                href={`${WA}?text=${encodeURIComponent(`Bonjour, je vous contacte au sujet de ma demande ${reference}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp ↗
              </a>
              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setReference("");
                  setFile(null);
                  requestId.current = null;
                  uploaded.current = null;
                }}
              >
                {t.again}
              </button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              onChange={() => {
                requestId.current = null;
              }}
            >
              <div className={styles.row}>
                <label>
                  {t.name}
                  <input
                    name="nom"
                    required
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                  />
                </label>
                <label>
                  {t.phone}
                  <input
                    name="telephone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    minLength={8}
                    maxLength={20}
                    placeholder="05… / +213…"
                    dir="ltr"
                  />
                </label>
              </div>
              <div className={styles.row}>
                <label>
                  {t.domain}
                  <select name="domaine" required defaultValue="entreprise">
                    <option value="entreprise">
                      {lang === "fr" ? "Entreprise / équipe" : "شركة / فريق"}
                    </option>
                    <option value="marque">
                      {lang === "fr"
                        ? "Marque / revendeur"
                        : "علامة تجارية / موزع"}
                    </option>
                    <option value="evenement">
                      {lang === "fr"
                        ? "Événement / association"
                        : "مناسبة / جمعية"}
                    </option>
                    <option value="particulier">
                      {lang === "fr" ? "Projet personnel" : "مشروع شخصي"}
                    </option>
                  </select>
                </label>
                <label>
                  {t.qty}
                  <input
                    name="quantite"
                    type="number"
                    min={1}
                    max={100000}
                    required
                    inputMode="numeric"
                    placeholder="20"
                  />
                </label>
              </div>
              <label>
                {t.product}
                <select name="produit" defaultValue="À conseiller">
                  <option value="À conseiller">
                    {lang === "fr"
                      ? "Je souhaite être conseillé(e)"
                      : "أحتاج إلى نصيحة"}
                  </option>
                  {[
                    "T-shirt",
                    "Polo",
                    "Hoodie",
                    "Gilet de travail",
                    "Casquette",
                    "Totebag",
                    "Tablier",
                  ].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </label>
              <label>
                {t.details}
                <textarea
                  name="details"
                  rows={4}
                  maxLength={2000}
                  placeholder={t.detailHint}
                />
              </label>
              <label className={styles.file}>
                {t.file}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp,.pdf"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setError("");
                    if (
                      f &&
                      (f.size > 4 * 1024 * 1024 ||
                        !/\.(png|jpe?g|webp|pdf)$/i.test(f.name))
                    ) {
                      setError(t.fileError);
                      e.target.value = "";
                      setFile(null);
                    } else setFile(f);
                  }}
                />
                <span>
                  {file
                    ? file.name
                    : `${t.upload} · PNG, JPG, WEBP, PDF · 4 Mo`}
                </span>
              </label>
              <label className={styles.consent}>
                <input type="checkbox" required name="consent" />
                {t.consent}
              </label>
              {error && (
                <p role="alert" className={styles.error}>
                  {error}
                </p>
              )}
              <button
                className="c-btn c-btn-accent"
                disabled={status === "sending"}
                type="submit"
              >
                {status === "sending" ? t.sending : t.submit}
              </button>
              <a className={styles.legal} href="/mentions-legales">
                {lang === "fr"
                  ? "Informations légales & confidentialité"
                  : "المعلومات القانونية والخصوصية"}
              </a>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
