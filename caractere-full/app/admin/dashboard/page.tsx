import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import DashboardClient from "../components/DashboardClient";

export const revalidate = 0;

async function getDashboardData() {
  const supabase = createClient();

  try {
    // 1. Récupérer les stats des commandes
    const { data: orders } = await supabase
      .from("pipeline_orders")
      .select("*")
      .order("created_at", { ascending: false });

    // 2. Récupérer les alertes (supply_alerts + commandes retardées + yalidine échouées)
    const { data: supplyAlerts } = await supabase
      .from("supply_alerts")
      .select("*")
      .in("status", ["open", "in_progress"])
      .order("priority", { ascending: false })
      .limit(10);

    // 3. Commandes > 2 jours
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const { data: oldOrders } = await supabase
      .from("pipeline_orders")
      .select("*")
      .lt("created_at", twoDaysAgo.toISOString())
      .neq("status", "prete")
      .neq("status", "payee");

    // 4. Commandes Yalidine échouées
    const { data: failedYalidine } = await supabase
      .from("pipeline_orders")
      .select("*")
      .eq("yalidine_status", "failed")
      .limit(10);

    const orderList = orders || [];
    const alertsList = supplyAlerts || [];
    const delayedOrders = oldOrders || [];
    const failedDeliveries = failedYalidine || [];

    return {
      totalOrders: orderList.length,
      pendingOrders: orderList.filter(
        (o) =>
          o.status &&
          ["attente_dtf", "impression_dtf", "attente_flocage", "en_flocage", "attente_broderie", "en_broderie"].includes(
            o.status
          )
      ).length,
      readyOrders: orderList.filter((o) => o.status === "prete").length,
      supplyAlerts: alertsList,
      delayedOrders,
      failedDeliveries,
      recentOrders: orderList.slice(0, 5),
    };
  } catch (error) {
    console.error("Dashboard error:", error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      readyOrders: 0,
      supplyAlerts: [],
      delayedOrders: [],
      failedDeliveries: [],
      recentOrders: [],
    };
  }
}

const PRIORITY_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  urgent: { bg: "bg-red-50", text: "text-red-700", icon: "🚨" },
  high: { bg: "bg-orange-50", text: "text-orange-700", icon: "⚠️" },
  normal: { bg: "bg-blue-50", text: "text-blue-700", icon: "ℹ️" },
  low: { bg: "bg-slate-50", text: "text-slate-700", icon: "💡" },
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  const alertsCount = data.supplyAlerts.length + data.delayedOrders.length + data.failedDeliveries.length;
  const urgentCount = data.supplyAlerts.filter((a) => a.priority === "urgent").length + data.failedDeliveries.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <img src="/logo-caractere.png" alt="Caractère" className="w-12 h-12 rounded-lg" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
              Tableau de bord
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Vue d'ensemble de Caractère Store
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Commandes totales",
              value: data.totalOrders,
              icon: "📦",
              color: "text-slate-600",
            },
            {
              label: "En production",
              value: data.pendingOrders,
              icon: "⚙️",
              color: "text-blue-600",
            },
            {
              label: "Prêtes à livrer",
              value: data.readyOrders,
              icon: "✅",
              color: "text-green-600",
            },
            {
              label: "Alertes",
              value: alertsCount,
              icon: urgentCount > 0 ? "🚨" : "⚠️",
              color: urgentCount > 0 ? "text-red-600" : "text-orange-600",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Supply Alerts */}
            {data.supplyAlerts.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    📦 Alertes d'approvisionnement
                  </h2>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {data.supplyAlerts.map((alert) => {
                    const colors = PRIORITY_COLORS[alert.priority] || PRIORITY_COLORS.normal;
                    return (
                      <Link
                        key={alert.id}
                        href={`/admin/alerts/${alert.id}`}
                        className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-lg shrink-0">{colors.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                              {alert.title}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              {alert.number} • {alert.department}
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} shrink-0`}>
                            {alert.priority === "urgent" ? "🚨 Urgent" : alert.priority === "high" ? "⚠️ Haute" : "Normal"}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delayed Orders */}
            {data.delayedOrders.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-orange-200 dark:border-orange-900 overflow-hidden">
                <div className="px-6 py-4 border-b border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/30">
                  <h2 className="text-base font-semibold text-orange-900 dark:text-orange-100 flex items-center gap-2">
                    ⏰ Commandes retardées (&gt; 2 jours)
                  </h2>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {data.delayedOrders.slice(0, 5).map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/commandes/${order.id}`}
                      className="px-6 py-4 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors block"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Commande #{order.number}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {order.contact_name} • Depuis{" "}
                            {Math.floor(
                              (Date.now() - new Date(order.created_at).getTime()) / (24 * 60 * 60 * 1000)
                            )}{" "}
                            jours
                          </p>
                        </div>
                        <span className="text-lg">⏳</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Failed Yalidine Deliveries */}
            {data.failedDeliveries.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900 overflow-hidden">
                <div className="px-6 py-4 border-b border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
                  <h2 className="text-base font-semibold text-red-900 dark:text-red-100 flex items-center gap-2">
                    ❌ Livraisons échouées (Yalidine)
                  </h2>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                  {data.failedDeliveries.slice(0, 5).map((order) => (
                    <Link
                      key={order.id}
                      href={`/admin/commandes/${order.id}`}
                      className="px-6 py-4 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors block"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">
                            Commande #{order.number}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {order.contact_name} • {order.yalidine_tracking}
                          </p>
                        </div>
                        <span className="text-lg">🚨</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Recent Orders */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-fit">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                Dernières commandes
                <Link href="/admin/commandes" className="text-xs text-blue-600 dark:text-blue-400 font-normal hover:underline">
                  Voir tout
                </Link>
              </h2>
            </div>
            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/commandes/${order.id}`}
                  className="px-6 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block text-sm"
                >
                  <p className="font-medium text-slate-900 dark:text-white truncate">#{order.number}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{order.contact_name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Champion du Mois Section */}
        <div className="mt-8">
          <DashboardClient />
        </div>
      </div>
    </div>
  );
}
