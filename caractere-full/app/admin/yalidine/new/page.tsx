'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface FormData {
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientCity: string;
  postalCode: string;
  items: Array<{ productName: string; quantity: number }>;
}

export default function NewYalidineOrderPage() {
  const router = useRouter();
  const supabase = createClient();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    clientName: '',
    clientPhone: '',
    clientAddress: '',
    clientCity: '',
    postalCode: '',
    items: [{ productName: '', quantity: 1 }],
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('inventory')
      .select('product_name, quantity')
      .gt('quantity', 0);

    if (!error && data) {
      setInventory(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/yalidine/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (result.error) {
        alert(`Erreur: ${result.error}`);
      } else {
        alert(`Commande créée! #${result.orderNumber}`);
        router.push(`/admin/queues/yalidine`);
      }
    } catch (error) {
      alert('Erreur création commande');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1 }],
    }));
  };

  const removeItem = (index: number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin/queues/yalidine" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
          ← Retour
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Nouvelle Commande Yalidine
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Info */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Informations Client
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={form.clientName}
                  onChange={e => setForm(prev => ({ ...prev, clientName: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  required
                  value={form.clientPhone}
                  onChange={e => setForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Adresse *
                </label>
                <input
                  type="text"
                  required
                  value={form.clientAddress}
                  onChange={e => setForm(prev => ({ ...prev, clientAddress: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.clientCity}
                    onChange={e => setForm(prev => ({ ...prev, clientCity: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Code Postal *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.postalCode}
                    onChange={e => setForm(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Articles
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
              >
                + Ajouter
              </button>
            </div>

            <div className="space-y-4">
              {form.items.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-1">
                    <select
                      required
                      value={item.productName}
                      onChange={e => {
                        const newItems = [...form.items];
                        newItems[idx].productName = e.target.value;
                        setForm(prev => ({ ...prev, items: newItems }));
                      }}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="">Sélectionner un article</option>
                      {inventory.map(prod => (
                        <option key={prod.product_name} value={prod.product_name}>
                          {prod.product_name} (Stock: {prod.quantity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.quantity}
                      onChange={e => {
                        const newItems = [...form.items];
                        newItems[idx].quantity = parseInt(e.target.value) || 1;
                        setForm(prev => ({ ...prev, items: newItems }));
                      }}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Link
              href="/admin/queues/yalidine"
              className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium"
            >
              {submitting ? 'Création...' : 'Créer Commande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
