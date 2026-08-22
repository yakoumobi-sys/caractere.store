'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { STATUS_DEFS, getNextStatus } from '@/lib/pipeline';

export default function GrosQueuePage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('pipeline_orders')
        .select('*')
        .in('status', ['attente_gros', 'en_preparation_gros'])
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [supabase]);

  const handleStatusChange = async (orderId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus as any);

    if (!nextStatus) return;

    const { error } = await supabase
      .from('pipeline_orders')
      .update({ status: nextStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    }
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Commandes Gros</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {orders.length} commande{orders.length !== 1 ? 's' : ''} en cours
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-8 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                ✅ Aucune commande en attente
              </p>
            </div>
          ) : (
            orders.map(order => {
              const statusDef = STATUS_DEFS[order.status];

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
                      <div className="flex gap-3 mt-3">
                        <span className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded">
                          {statusDef?.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {order.status === 'attente_gros' && (
                        <button
                          onClick={() => handleStatusChange(order.id, order.status)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Prendre la commande
                        </button>
                      )}
                      {order.status === 'en_preparation_gros' && (
                        <button
                          onClick={() => handleStatusChange(order.id, order.status)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Marquer terminée
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
