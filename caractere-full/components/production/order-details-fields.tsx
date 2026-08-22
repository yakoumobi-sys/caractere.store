"use client";

import { useState } from "react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { LOGO_PLACEMENTS, LOGO_SOURCES, TECHNIQUES, type Technique } from "@/lib/pipeline";

interface ItemRow {
  product_name: string;
  color: string;
  size: string;
  quantity: number;
}

interface ContactOption {
  id: string;
  name: string;
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="h-6 w-6 rounded-full bg-brand-500 text-white text-xs font-semibold flex items-center justify-center shrink-0">
        {n}
      </span>
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}

/**
 * Configurateur de commande en 3 étapes : Client, Article, Impression.
 * Pensé pour aller vite — un commercial doit pouvoir saisir une commande
 * WhatsApp en quelques secondes.
 */
export function OrderDetailsFields({ contacts }: { contacts: ContactOption[] }) {
  const [clientMode, setClientMode] = useState<"existing" | "new">("existing");
  const [items, setItems] = useState<ItemRow[]>([{ product_name: "", color: "", size: "", quantity: 1 }]);
  const [technique, setTechnique] = useState<Technique>("dtf");
  const [logoPlacement, setLogoPlacement] = useState("coeur");
  const [logoSource, setLogoSource] = useState("whatsapp");
  const [amountPaid, setAmountPaid] = useState<string>("");

  function updateItem(i: number, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  return (
    <>
      {/* 1. Client */}
      <Card className="p-6">
        <StepLabel n={1} title="Client" />
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setClientMode("existing")}
            className={`rounded-md px-3.5 py-2 text-sm font-medium border ${clientMode === "existing" ? "bg-brand-500 text-white border-brand-500" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
          >
            Client existant
          </button>
          <button
            type="button"
            onClick={() => setClientMode("new")}
            className={`rounded-md px-3.5 py-2 text-sm font-medium border ${clientMode === "new" ? "bg-brand-500 text-white border-brand-500" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"}`}
          >
            + Nouveau client
          </button>
        </div>
        <input type="hidden" name="client_mode" value={clientMode} />

        {clientMode === "existing" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Client" htmlFor="contact_id" required>
              <select id="contact_id" name="contact_id" required={clientMode === "existing"} className={inputClass}>
                <option value="">— Sélectionner —</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Versement (DA)" htmlFor="amount_paid">
              <input
                id="amount_paid"
                name="amount_paid"
                type="number"
                step="0.01"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0.00"
                className={inputClass}
              />
            </Field>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Field label="Nom" htmlFor="client_new_name" required>
                <input id="client_new_name" name="client_new_name" required={clientMode === "new"} className={inputClass} />
              </Field>
              <Field label="Téléphone" htmlFor="client_new_phone">
                <input id="client_new_phone" name="client_new_phone" type="tel" className={inputClass} />
              </Field>
              <Field label="Type" htmlFor="client_new_type">
                <select id="client_new_type" name="client_new_type" defaultValue="client" className={inputClass}>
                  <option value="client">Client</option>
                  <option value="prospect">Prospect</option>
                </select>
              </Field>
            </div>
            <Field label="Versement (DA)" htmlFor="amount_paid">
              <input
                id="amount_paid"
                name="amount_paid"
                type="number"
                step="0.01"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder="0.00"
                className={inputClass}
              />
            </Field>
          </div>
        )}
      </Card>

      {/* 2. Article */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-3">
          <StepLabel n={2} title="Article" />
          <Button
            type="button"
            variant="secondary"
            onClick={() => setItems((prev) => [...prev, { product_name: "", color: "", size: "", quantity: 1 }])}
          >
            + Ajouter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2 pr-2 font-medium">Article</th>
                <th className="py-2 pr-2 font-medium">Couleur</th>
                <th className="py-2 pr-2 font-medium w-24">Taille</th>
                <th className="py-2 pr-2 font-medium w-24">Qté</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {items.map((row, i) => (
                <tr key={i}>
                  <td className="py-2 pr-2">
                    <input
                      value={row.product_name}
                      onChange={(e) => updateItem(i, { product_name: e.target.value })}
                      placeholder="T-shirt, Polo, Tote bag..."
                      className={inputClass}
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <input value={row.color} onChange={(e) => updateItem(i, { color: e.target.value })} className={inputClass} />
                  </td>
                  <td className="py-2 pr-2">
                    <input value={row.size} onChange={(e) => updateItem(i, { size: e.target.value })} className={inputClass} />
                  </td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      step="1"
                      value={row.quantity}
                      onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                      className={inputClass}
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <input type="hidden" name="items_json" value={JSON.stringify(items)} />
      </Card>

      {/* 3. Impression */}
      <Card className="p-6">
        <StepLabel n={3} title="Impression" />
        <div className="grid grid-cols-3 gap-2 mb-4">
          {TECHNIQUES.map((t) => (
            <label
              key={t.value}
              className={`flex items-center justify-center text-center rounded-md border px-3 py-3 text-sm font-medium cursor-pointer ${
                technique === t.value ? "bg-brand-500 text-white border-brand-500" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
              }`}
            >
              <input
                type="radio"
                name="technique"
                value={t.value}
                checked={technique === t.value}
                onChange={() => setTechnique(t.value)}
                className="sr-only"
              />
              {t.label}
            </label>
          ))}
        </div>

        {technique !== "aucune" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Emplacement du logo" htmlFor="logo_placement" required>
              <select
                id="logo_placement"
                name="logo_placement"
                value={logoPlacement}
                onChange={(e) => setLogoPlacement(e.target.value)}
                required
                className={inputClass}
              >
                {LOGO_PLACEMENTS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
            {logoPlacement === "special" && (
              <Field label="Précisions" htmlFor="logo_placement_note">
                <input id="logo_placement_note" name="logo_placement_note" className={inputClass} />
              </Field>
            )}

            <Field label="Où récupérer le logo" htmlFor="logo_source" required>
              <select
                id="logo_source"
                name="logo_source"
                value={logoSource}
                onChange={(e) => setLogoSource(e.target.value)}
                required
                className={inputClass}
              >
                {LOGO_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={logoSource === "email" ? "Adresse email du client" : "Numéro du client"} htmlFor="logo_source_value">
              <input id="logo_source_value" name="logo_source_value" className={inputClass} />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Ou envoyer directement le fichier (optionnel)" htmlFor="logo">
                <input id="logo" name="logo" type="file" accept="image/*,.pdf,.ai,.eps" className={inputClass} />
              </Field>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 dark:text-slate-500">Vêtements bruts, sans personnalisation — la commande part directement en préparation.</p>
        )}
      </Card>
    </>
  );
}
