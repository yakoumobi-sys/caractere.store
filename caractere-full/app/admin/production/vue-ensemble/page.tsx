'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { STATUS_DEFS, QUEUE_TITLES } from '@/lib/pipeline';

type QueueName = 'dtf' | 'flocage' | 'broderie' | 'gros' | 'ready' | 'delivery';

const QUEUES: { name: QueueName; label: string; color: string }[] = [
  { name: 'dtf', label: 'File DTF', color: 'blue' },
  { name: 'flocage', label: 'File Flocage', color: 'orange' },
  { name: 'broderie', label: 'File Broderie', color: 'purple' },
  { name: 'gros', label: 'Commandes Gros', color: 'indigo' },
  { name: 'ready', label: 'Commandes Prêtes', color: 'green' },
];

export default function ProductionOverviewPage() {
  const [stats, setStats] = useState<Record<QueueName, number>>({
    dtf: 0,
    flocage: 0,
    broderie: 0,
    gros: 0,
    ready: 0,
    delivery: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data: orders } = await supabase
        .from('pipeline_orders')
        .select('status')
        .in('status', ['attente_dtf', 'impression_dtf', 'attente_flocage', 'en_flocage', 'attente_broderie', 'en_broderie', 'attente_gros', 'en_preparation_gros', 'prete']);

      if (orders) {
        const counts: Record<QueueName, number> = {
          dtf: 0,
          flocage: 0,
          broderie: 0,
          gros: 0,
          ready: 0,
          delivery: 0,
        };

        orders.forEach((order: any) => {
          const statusDef = (STATUS_DEFS as any)[order.status];
          if (statusDef?.queue) {
            counts[statusDef.queue as QueueName]++;
          }
        });

        setStats(counts);
      }
      setLoading(false);
    };

    fetchStats();
  }, [supabase]);

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Production</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vue d'ensemble de toutes les files
            </p>
          </div>
          <Link
            href="/admin/production/new"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            ➕ Nouvelle commande
          </Link>
        </div>

        {/* Queue Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUEUES.map(queue => {
            const count = stats[queue.name];
            const colorClasses: Record<string, { bg: string; border: string; text: string; badge: string }> = {
              blue: {
                bg: 'bg-blue-50 dark:bg-blue-950',
                border: 'border-blue-200 dark:border-blue-800',
                text: 'text-blue-900 dark:text-blue-100',
                badge: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
              },
              orange: {
                bg: 'bg-orange-50 dark:bg-orange-950',
                border: 'border-orange-200 dark:border-orange-800',
                text: 'text-orange-900 dark:text-orange-100',
                badge: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
              },
              purple: {
                bg: 'bg-purple-50 dark:bg-purple-950',
                border: 'border-purple-200 dark:border-purple-800',
                text: 'text-purple-900 dark:text-purple-100',
                badge: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
              },
              indigo: {
                bg: 'bg-indigo-50 dark:bg-indigo-950',
                border: 'border-indigo-200 dark:border-indigo-800',
                text: 'text-indigo-900 dark:text-indigo-100',
                badge: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
              },
              green: {
                bg: 'bg-green-50 dark:bg-green-950',
                border: 'border-green-200 dark:border-green-800',
                text: 'text-green-900 dark:text-green-100',
                badge: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
              },
            };

            const colors = colorClasses[queue.color];

            return (
              <Link
                key={queue.name}
                href={`/admin/queues/${queue.name}`}
                className={`${colors.bg} border ${colors.border} rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${colors.text}`}>{queue.label}</h2>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-3xl font-bold ${colors.text}`}>{count}</p>
                    <p className={`text-sm ${colors.text} opacity-75`}>
                      commande{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                    {count > 0 ? '👉 Voir' : '✅ OK'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
