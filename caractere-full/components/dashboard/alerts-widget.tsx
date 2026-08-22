import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

export async function AlertsWidget() {
  const supabase = createClient();

  // Récupérer les alertes urgentes et en cours
  const { data: alerts } = await supabase
    .from("supply_alerts_view")
    .select("*")
    .in("status", ["open", "in_progress"])
    .order("priority", { ascending: false })
    .limit(5);

  const urgentCount = (alerts || []).filter((a) => a.priority === "urgent").length;
  const highCount = (alerts || []).filter((a) => a.priority === "high").length;

  return (
    <Card className="p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Alertes de fournitures</h2>
        <Link href="/alerts" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
          Voir tout
        </Link>
      </div>

      {(alerts || []).length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">✅ Aucune alerte — tout va bien !</p>
      ) : (
        <div className="space-y-2">
          {/* Résumé */}
          {(urgentCount > 0 || highCount > 0) && (
            <div className="flex gap-2 mb-3">
              {urgentCount > 0 && (
                <Badge tone="red">🚨 {urgentCount} urgent{urgentCount > 1 ? "s" : ""}</Badge>
              )}
              {highCount > 0 && (
                <Badge tone="blue">⚠️ {highCount} haute priorité</Badge>
              )}
            </div>
          )}

          {/* Listes d'alertes */}
          {(alerts || []).map((alert) => (
            <Link
              key={alert.id}
              href={`/alerts`}
              className="block p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg shrink-0 mt-0.5">
                  {alert.priority === "urgent"
                    ? "🚨"
                    : alert.priority === "high"
                      ? "⚠️"
                      : "ℹ️"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                    {alert.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {alert.number} • {alert.department}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
