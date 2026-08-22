import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui";
import { QuickAlertForm } from "@/components/alerts/quick-alert-form";
import { AlertsList } from "@/components/alerts/alerts-list";

export default async function AlertsPage() {
  const supabase = createClient();

  // Récupérer toutes les alertes (les ouvertes en premier)
  const { data: alerts } = await supabase
    .from("supply_alerts_view")
    .select("*")
    .order("status", { ascending: true })
    .order("priority", { ascending: false })
    .order("created_at", { ascending: false });

  // Séparer les alertes par statut pour affichage
  const openAlerts = (alerts || []).filter((a) => a.status === "open");
  const inProgressAlerts = (alerts || []).filter((a) => a.status === "in_progress");
  const resolvedAlerts = (alerts || []).filter((a) => a.status === "resolved");
  const closedAlerts = (alerts || []).filter((a) => a.status === "closed");

  return (
    <div>
      <PageHeader
        title="Alertes de fournitures"
        description="Signalez les manques de matériels et suivez leur approvisionnement"
      />

      {/* Formulaire rapide */}
      <QuickAlertForm />

      {/* Alertes ouvertes */}
      {openAlerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            🔴 Ouvertes ({openAlerts.length})
          </h2>
          <AlertsList alerts={openAlerts} />
        </div>
      )}

      {/* Alertes en cours */}
      {inProgressAlerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            🟡 En cours ({inProgressAlerts.length})
          </h2>
          <AlertsList alerts={inProgressAlerts} />
        </div>
      )}

      {/* Alertes résolues */}
      {resolvedAlerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            🟢 Résolues ({resolvedAlerts.length})
          </h2>
          <AlertsList alerts={resolvedAlerts} />
        </div>
      )}

      {/* Alertes clôturées */}
      {closedAlerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            ⚫ Clôturées ({closedAlerts.length})
          </h2>
          <AlertsList alerts={closedAlerts} />
        </div>
      )}

      {/* Aucune alerte */}
      {alerts && alerts.length === 0 && (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <p className="text-lg mb-2">Aucune alerte 🎉</p>
          <p className="text-sm">Tout va bien, les stocks semblent en bon état !</p>
        </div>
      )}

      {/* Légende des types */}
      <div className="mt-12 p-6 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Types de fournitures</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-medium">📄 Papier DTF</p>
            <p className="text-slate-500 dark:text-slate-400">Pour imprimante DTF</p>
          </div>
          <div>
            <p className="font-medium">🔵 Encre DTF</p>
            <p className="text-slate-500 dark:text-slate-400">Encre imprimante</p>
          </div>
          <div>
            <p className="font-medium">💨 Poudre DTF</p>
            <p className="text-slate-500 dark:text-slate-400">Poudre de fixation</p>
          </div>
          <div>
            <p className="font-medium">🧵 Fils broderie</p>
            <p className="text-slate-500 dark:text-slate-400">Fils colorés</p>
          </div>
          <div>
            <p className="font-medium">📌 Ruban stabilisation</p>
            <p className="text-slate-500 dark:text-slate-400">Pour broderie</p>
          </div>
          <div>
            <p className="font-medium">📽️ Film flocage</p>
            <p className="text-slate-500 dark:text-slate-400">Film thermique</p>
          </div>
          <div>
            <p className="font-medium">🧴 Colle flocage</p>
            <p className="text-slate-500 dark:text-slate-400">Adhésif flocage</p>
          </div>
          <div>
            <p className="font-medium">📦 Autre</p>
            <p className="text-slate-500 dark:text-slate-400">Autre fourniture</p>
          </div>
        </div>
      </div>
    </div>
  );
}
