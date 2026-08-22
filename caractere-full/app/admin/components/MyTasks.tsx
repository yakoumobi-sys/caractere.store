'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { updateTaskStatus } from '@/lib/actions/tasks-actions';

export default function MyTasks({ employeeId }: { employeeId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', employeeId)
        .order('due_date', { ascending: true });

      if (!error && data) {
        setTasks(data);
      }
      setLoading(false);
    };

    fetchTasks();
  }, [employeeId, supabase]);

  const handleTaskToggle = async (taskId: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === 'todo'
        ? 'in_progress'
        : currentStatus === 'in_progress'
          ? 'completed'
          : 'todo';

    const result = await updateTaskStatus(taskId, nextStatus);
    if (!('error' in result)) {
      setTasks(
        tasks.map(t =>
          t.id === taskId ? { ...t, status: nextStatus } : t
        )
      );
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in_progress':
        return '⏳';
      default:
        return '○';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-500">Chargement...</div>;
  }

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Aucune tâche assignée
        </p>
      ) : (
        tasks.map(task => (
          <div
            key={task.id}
            onClick={() => handleTaskToggle(task.id, task.status)}
            className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-colors"
          >
            <div className="flex-shrink-0 text-lg">
              {getStatusIcon(task.status)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm ${
                task.status === 'completed'
                  ? 'line-through text-slate-500'
                  : 'text-slate-900 dark:text-white'
              }`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {task.description}
                </p>
              )}
              {task.due_date && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  📅 {new Date(task.due_date).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
            <span className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.priority}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
