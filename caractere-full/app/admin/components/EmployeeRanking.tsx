'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function EmployeeRanking() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('employee_stats')
        .select('*')
        .order('completed_tasks', { ascending: false });

      if (!error && data) {
        setStats(data);
      }
      setLoading(false);
    };

    fetchStats();
  }, [supabase]);

  if (loading) {
    return <div className="text-sm text-slate-500">Chargement...</div>;
  }

  const champion = stats[0];

  return (
    <div className="space-y-6">
      {/* Champion du Mois */}
      {champion && (
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-xl p-6 text-white shadow-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">👑</div>
            <h3 className="text-sm font-semibold opacity-90 uppercase tracking-widest">
              Champion du Mois
            </h3>
            <h2 className="text-2xl font-bold mt-2">{champion.name}</h2>
            <div className="flex justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{champion.completed_tasks}</div>
                <div className="text-xs opacity-90">Tâches complétées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{champion.absences_count}</div>
                <div className="text-xs opacity-90">Absences (30j)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classement */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-widest">
          📊 Classement de l'Équipe
        </h3>
        <div className="space-y-2">
          {stats.map((employee, index) => {
            const isChampion = index === 0;
            return (
              <div
                key={employee.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isChampion
                    ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    isChampion
                      ? 'bg-amber-400 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className={`font-medium text-sm ${
                      isChampion
                        ? 'text-amber-900 dark:text-amber-100'
                        : 'text-slate-900 dark:text-white'
                    }`}>
                      {employee.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {employee.completed_tasks} complétées • {employee.absences_count} absence(s)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {employee.completed_tasks}
                  </div>
                  <div className="text-xs text-slate-500">tâches</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
