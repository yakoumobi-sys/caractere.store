'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { reportAbsence, checkTodayAbsence } from '@/lib/actions/tasks-actions';

export default function AbsenceReporter({ employeeId }: { employeeId: string }) {
  const [isAbsent, setIsAbsent] = useState(false);
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAbsence = async () => {
      const result = await checkTodayAbsence(employeeId);
      if (!('error' in result) && result.data) {
        setIsAbsent(true);
        setJustification(result.data.justification || '');
      }
      setLoading(false);
    };

    checkAbsence();
  }, [employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('employee_id', employeeId);
    formData.append('justification', justification);

    const result = await reportAbsence(formData);
    if (!('error' in result)) {
      setIsAbsent(true);
      setShowForm(false);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <div className="space-y-3">
      {isAbsent ? (
        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-3">
            <div className="text-2xl">😷</div>
            <div className="flex-1">
              <h4 className="font-semibold text-orange-900 dark:text-orange-100">
                Absence signalée
              </h4>
              {justification && (
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                  {justification}
                </p>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="text-xs text-orange-600 dark:text-orange-400 hover:underline mt-2"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">✅</div>
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm">
                  Présent(e) aujourd'hui
                </h4>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="text-xs text-green-600 dark:text-green-400 hover:underline"
            >
              Signaler absence
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
              Justification de l'absence
            </label>
            <textarea
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Ex: Rendez-vous médical, raison personnelle..."
              className="w-full mt-2 p-2 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded font-medium text-sm transition-colors"
            >
              Confirmer absence
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded font-medium text-sm transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
