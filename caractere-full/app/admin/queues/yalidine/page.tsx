'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { STATUS_DEFS } from '@/lib/pipeline';

export default function YalidineQueuePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('pipeline_orders')
      .select('*')
      .eq('is_yalidine_order', true)
      .in('status', ['yalidine_pending', 'yalidine_picked_up', 'yalidine_delivered', 'yalidine_failed'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from('pipeline_orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    }
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Commandes Yalidine
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {orders.length} commande{orders.length !== 1 ? 's' : ''} en cours
            </p>
          </div>
          <Link
            href="/admin/yalidine/new"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium"
          >
            ➕ Nouvelle Commande
          </Link>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                ✅ Aucune commande
              </p>
            </div>
          ) : (
            orders.map(order => {
              const statusDef = (STATUS_DEFS as any)[order.status];

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/admin/commandes/${order.id}`}
                        className="text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 no-underline"
                      >
                        Commande #{order.number}
                      </Link>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {order.contact_name} • {order.quantity} pièce(s)
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                        📍 {order.yalidine_tracking || 'En attente d\'envoi'}
                      </p>
                      <div className="flex gap-3 mt-3">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          order.status.includes('pending') ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' :
                          order.status.includes('picked_up') ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                          order.status.includes('delivered') ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                          'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                        }`}>
                          {statusDef?.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'yalidine_pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'yalidine_picked_up')}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Récupérée
                        </button>
                      )}
                      {order.status === 'yalidine_picked_up' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'yalidine_delivered')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Livrée
                        </button>
                      )}
                      {order.status === 'yalidine_failed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'yalidine_pending')}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Réessayer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
