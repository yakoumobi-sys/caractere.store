"use client";

import { useState } from "react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { createYalidineShipment } from "@/lib/actions/yalidine-actions";

const WILAYAS = [
  "Alger",
  "Adrar",
  "Aïn Défla",
  "Aïn Témouchent",
  "Alger",
  "Algésiras",
  "Annaba",
  "Batna",
  "Béchar",
  "Bejaia",
  "Blida",
  "Bordj Bou Arréridj",
  "Bouira",
  "Boumerdès",
  "Chlef",
  "Constance",
  "Constantine",
  "Djanet",
  "Djidjelli",
  "El Asnam",
  "El Bayadh",
  "El Oued",
  "El Tarf",
  "Guelma",
  "Ghardaïa",
  "Guelma",
  "Jijel",
  "Khenchela",
  "Laghouat",
  "Mascara",
  "Medea",
  "Mila",
  "Mostaganem",
  "Msila",
  "Nador",
  "Naama",
  "Oran",
  "Ouargla",
  "Oum El Bouaghi",
  "Saida",
  "Saïda",
  "Sétif",
  "Sidi Bel Abbes",
  "Skikda",
  "Souk Ahras",
  "Tamanrasset",
  "Tebessa",
  "Tiaret",
  "Tindouf",
  "Tipaza",
  "Tissa",
  "Tlemcen",
  "Tizi Ouzou",
  "Tlemcen",
];

interface YalidineFormProps {
  orderId: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  orderNumber: string;
  amount: number;
  onSuccess?: () => void;
}

export function YalidineForm({
  orderId,
  clientName,
  clientPhone,
  clientEmail,
  orderNumber,
  amount,
  onSuccess,
}: YalidineFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [deliveryType, setDeliveryType] = useState(1);
  const [deliveryWilaya, setDeliveryWilaya] = useState("Alger");
  const [shippingPrice, setShippingPrice] = useState(0);
  const [notes, setNotes] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await createYalidineShipment(orderId, {
      delivery_type: deliveryType,
      delivery_wilaya: deliveryWilaya,
      shipping_price: shippingPrice,
      notes: notes || undefined,
      is_cod: true,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setExpanded(false);
      onSuccess?.();
    }

    setLoading(false);
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full p-4 rounded-lg border-2 border-dashed border-brand-500 dark:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 text-center text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors font-medium"
      >
        📦 Envoyer via Yalidine/Alger
      </button>
    );
  }

  return (
    <Card className="p-6 mb-6 bg-brand-50 dark:bg-brand-900/10 border-brand-200 dark:border-brand-800">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Créer un envoi Yalidine
      </h3>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Info client (affichage) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-md bg-white dark:bg-slate-800">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Client</p>
            <p className="font-medium text-slate-900 dark:text-white">{clientName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Téléphone</p>
            <p className="font-medium text-slate-900 dark:text-white">{clientPhone}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Commande</p>
            <p className="font-medium text-slate-900 dark:text-white">{orderNumber}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Montant</p>
            <p className="font-medium text-slate-900 dark:text-white">{amount} DA</p>
          </div>
        </div>

        {/* Type de livraison */}
        <Field label="Type de livraison" htmlFor="delivery_type">
          <div className="flex gap-2">
            {[
              { value: 1, label: "🟦 Yalidine" },
              { value: 2, label: "🟥 Alger Livraison" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDeliveryType(option.value)}
                className={`flex-1 p-2 rounded-md border transition-colors ${
                  deliveryType === option.value
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Wilaya de livraison */}
        <Field label="Wilaya de livraison" htmlFor="delivery_wilaya" required>
          <select
            id="delivery_wilaya"
            value={deliveryWilaya}
            onChange={(e) => setDeliveryWilaya(e.target.value)}
            required
            className={inputClass}
          >
            {WILAYAS.map((wilaya) => (
              <option key={wilaya} value={wilaya}>
                {wilaya}
              </option>
            ))}
          </select>
        </Field>

        {/* Frais de livraison */}
        <Field label="Frais de livraison (DA)" htmlFor="shipping_price">
          <input
            id="shipping_price"
            type="number"
            step="0.01"
            min="0"
            value={shippingPrice}
            onChange={(e) => setShippingPrice(parseFloat(e.target.value) || 0)}
            placeholder="0.00"
            className={inputClass}
          />
        </Field>

        {/* Notes */}
        <Field label="Notes (optionnel)" htmlFor="notes">
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Instructions spéciales, adresse précise, etc."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        {/* Résumé prix */}
        <div className="p-3 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-600 dark:text-slate-400">Produit</span>
            <span className="font-medium text-slate-900 dark:text-white">{amount} DA</span>
          </div>
          <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-600 dark:text-slate-400">Livraison</span>
            <span className="font-medium text-slate-900 dark:text-white">
              {shippingPrice} DA
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-slate-900 dark:text-white">Total</span>
            <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
              {amount + shippingPrice} DA
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="submit" loading={loading}>
            ✅ Créer l&apos;envoi
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setExpanded(false)}
            disabled={loading}
          >
            Annuler
          </Button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          ℹ️ Le client sera notifié par SMS avec son numéro de suivi. Paiement à la
          livraison (COD) activé par défaut.
        </p>
      </form>
    </Card>
  );
}
