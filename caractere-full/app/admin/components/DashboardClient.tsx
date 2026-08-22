'use client';

import EmployeeRanking from './EmployeeRanking';

export default function DashboardClient() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <EmployeeRanking />
    </div>
  );
}
