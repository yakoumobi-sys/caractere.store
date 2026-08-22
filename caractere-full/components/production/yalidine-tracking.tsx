"use client";

import { useState } from "react";
import { Card, Button, Badge } from "@/components/ui";
import { trackYalidineShipment, cancelYalidineShipment } from "@/lib/actions/yalidine-actions";

interface YalidineTrackingProps {
  orderId: string;
  tracking?: string;
  parcel?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_INFO: Record<
  string,
  { label: string; icon: string; color: string; tone: "gray" | "blue" | "green" | "red" }
> = {
  pending: {
    label: "En attente de récupération",
    icon: "⏳",
    color: "bg-yellow-50 dark:bg-yellow-900/20",
    tone: "blue",
  },
  in_transit: {
    label: "En transit",
    icon: "🚚",
    color: "bg-blue-50 dark:bg-blue-900/20",
    tone: "blue",
  },
  delivered: {
    label: "Livré ✅",
    icon: "✅",
    color: "bg-green-50 dark:bg-green-900/20",
    tone: "green",
  },
  failed: {
    label: "Échec de livraison",
    icon: "❌",
    color: "bg-red-50 dark:bg-red-900/20",
    tone: "red",
  },
  cancelled: {
    label: "Annulé",
    icon: "🚫",
    color: "bg-gray-50 dark:bg-gray-900/20",
    tone: "gray",
  },
};

export function YalidineTracking({
  orderId,
  tracking,
  parcel,
  status = "pending",
  createdAt,
  updatedAt,
}: YalidineTrackingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(updatedAt);

  const statusInfo = STATUS_INFO[status] || STATUS_INFO.pending;

  async function handleRefresh() {
    setLoading(true);
    setError(null);

    const result = await trackYalidineShipment(orderId);
    if (result.error) {
      setError(result.error);
    } else {
      setLastUpdate(new Date().toISOString());
    }

    setLoading(false);
  }

  async function handleCancel() {
    if (!confirm("Êtes-vous sûr d'annuler cet envoi ?")) return;

    setLoading(true);
    setError(null);

    const result = await cancelYalidineShipment(orderId);
    if (result.error) {
      setError(result.error);
    }

    setLoading(false);
  }

  if (!tracking) {
    return null;
  }

  return (
    <Card className={`p-6 ${statusInfo.color}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{statusInfo.icon}</span>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Suivi Yalidine/Alger
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {statusInfo.label}
              </p>
            </div>
          </div>
          <Badge tone={statusInfo.tone}>{status.toUpperCase()}</Badge>
        </div>

        {/* Numéros de suivi */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-md bg-white dark:bg-slate-900/50">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Numéro de suivi
            </p>
            <p className="font-mono text-sm font-medium text-slate-900 dark:text-white break-all">
              {tracking}
            </p>
          </div>
          {parcel && (
            <div className="p-3 rounded-md bg-white dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                Numéro de colis
              </p>
              <p className="font-mono text-sm font-medium text-slate-900 dark:text-white break-all">
                {parcel}
              </p>
            </div>
          )}
        </div>

        {/* Dates */}
        {(createdAt || lastUpdate) && (
          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-4">
            {createdAt && (
              <p>
                📅 Envoyé le{" "}
                {new Date(createdAt).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
            {lastUpdate && (
              <p>
                🔄 Dernière mise à jour:{" "}
                {new Date(lastUpdate).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleRefresh}
            loading={loading}
            disabled={status === "delivered" || status === "cancelled"}
          >
            🔄 Rafraîchir
          </Button>
          {status !== "delivered" && status !== "cancelled" && (
            <Button
              type="button"
              variant="danger"
              onClick={handleCancel}
              disabled={loading}
            >
              Annuler
            </Button>
          )}
        </div>
      </div>

      {/* Infos Yalidine */}
      <div className="mt-4 p-3 rounded-md bg-white dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-400">
        <p className="font-medium text-slate-900 dark:text-white mb-1">
          💡 À propos du suivi
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Yalidine/Alger livre à travers toute l&apos;Algérie</li>
          <li>Le client reçoit un SMS avec le numéro de suivi</li>
          <li>Paiement à la livraison (COD) disponible</li>
          <li>Cliquez sur &quot;Rafraîchir&quot; pour mettre à jour le statut</li>
        </ul>
      </div>
    </Card>
  );
}
