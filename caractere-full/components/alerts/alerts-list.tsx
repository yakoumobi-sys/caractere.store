import { Badge } from "@/components/ui";
import { updateSupplyAlert } from "@/lib/actions/alerts-actions";

interface Alert {
  id: string;
  number: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  department: string;
  alert_type: string;
  created_by_first_name?: string;
  created_by_color?: string;
  assigned_to_first_name?: string;
  assigned_to_color?: string;
  created_at: string;
}

const PRIORITY_COLORS: Record<string, { badge: string; bg: string }> = {
  low: { badge: "gray", bg: "bg-blue-50 dark:bg-blue-900/20" },
  normal: { badge: "gray", bg: "bg-slate-50 dark:bg-slate-800" },
  high: { badge: "blue", bg: "bg-orange-50 dark:bg-orange-900/20" },
  urgent: { badge: "red", bg: "bg-red-50 dark:bg-red-900/20" },
};

const STATUS_LABELS: Record<string, string> = {
  open: "Ouvert",
  in_progress: "En cours",
  resolved: "Résolu",
  closed: "Fermé",
};

export async function AlertsList({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        <p className="text-sm">Aucune alerte pour le moment 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg border ${PRIORITY_COLORS[alert.priority].bg} border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-slate-900 dark:text-white">{alert.number}</span>
                <Badge tone={PRIORITY_COLORS[alert.priority].badge}>
                  {alert.priority === "urgent"
                    ? "🚨 Urgent"
                    : alert.priority === "high"
                      ? "⚠️ Haute"
                      : alert.priority === "normal"
                        ? "Normal"
                        : "Basse"}
                </Badge>
                <Badge tone="gray">{STATUS_LABELS[alert.status]}</Badge>
              </div>
              <h4 className="font-medium text-slate-900 dark:text-white mb-1">{alert.title}</h4>
              {alert.description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{alert.description}</p>
              )}
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400">
                <span>📍 {alert.department}</span>
                {alert.created_by_first_name && (
                  <span className="flex items-center gap-1">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: alert.created_by_color }}
                    />
                    {alert.created_by_first_name}
                  </span>
                )}
                {alert.assigned_to_first_name && (
                  <span className="flex items-center gap-1">
                    🔗 Assigné à{" "}
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: alert.assigned_to_color }}
                    />
                    {alert.assigned_to_first_name}
                  </span>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            {alert.status !== "closed" && (
              <div className="flex gap-1 shrink-0">
                {alert.status === "open" && (
                  <form
                    action={async () => {
                      "use server";
                      await updateSupplyAlert(alert.id, { status: "in_progress" });
                    }}
                  >
                    <button
                      type="submit"
                      className="px-2 py-1 rounded text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      ▶️ En cours
                    </button>
                  </form>
                )}
                {alert.status === "in_progress" && (
                  <form
                    action={async () => {
                      "use server";
                      await updateSupplyAlert(alert.id, {
                        status: "resolved",
                      });
                    }}
                  >
                    <button
                      type="submit"
                      className="px-2 py-1 rounded text-xs font-medium bg-green-500 hover:bg-green-600 text-white transition-colors"
                    >
                      ✅ Résolu
                    </button>
                  </form>
                )}
                {(alert.status === "resolved" || alert.status === "in_progress") && (
                  <form
                    action={async () => {
                      "use server";
                      await updateSupplyAlert(alert.id, { status: "closed" });
                    }}
                  >
                    <button
                      type="submit"
                      className="px-2 py-1 rounded text-xs font-medium bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white transition-colors"
                    >
                      🚫 Clôturer
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
