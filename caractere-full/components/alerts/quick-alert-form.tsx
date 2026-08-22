"use client";

import { useState } from "react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { createSupplyAlert } from "@/lib/actions/alerts-actions";

const ALERT_TYPES = [
  { value: "paper_dtf", label: "📄 Papier DTF", department: "DTF" },
  { value: "ink_dtf", label: "🔵 Encre DTF", department: "DTF" },
  { value: "powder_dtf", label: "💨 Poudre DTF", department: "DTF" },
  { value: "tape_broderie", label: "📌 Ruban de stabilisation", department: "Broderie" },
  { value: "thread_broderie", label: "🧵 Fil broderie", department: "Broderie" },
  { value: "film_flocage", label: "📽️ Film flocage", department: "Flocage" },
  { value: "glue_flocage", label: "🧴 Colle flocage", department: "Flocage" },
  { value: "misc", label: "📦 Autre", department: "Autre" },
];

const DEPARTMENTS = ["DTF", "Broderie", "Flocage", "Commercial", "Autre"];

const PRIORITIES = [
  { value: "low", label: "Basse (peut attendre)", color: "bg-blue-100 text-blue-700" },
  { value: "normal", label: "Normal", color: "bg-gray-100 text-gray-700" },
  { value: "high", label: "Haute (important)", color: "bg-orange-100 text-orange-700" },
  { value: "urgent", label: "Urgent ⚠️", color: "bg-red-100 text-red-700" },
];

export function QuickAlertForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alertType, setAlertType] = useState("paper_dtf");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("normal");
  const [expanded, setExpanded] = useState(false);

  const selectedType = ALERT_TYPES.find((t) => t.value === alertType);
  const department = selectedType?.department || "DTF";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("alert_type", alertType);
    formData.append("department", department);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("priority", priority);

    const result = await createSupplyAlert(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setTitle("");
      setDescription("");
      setAlertType("paper_dtf");
      setPriority("normal");
      setExpanded(false);
      onSuccess?.();
    }

    setLoading(false);
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full p-4 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 text-center text-slate-600 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
      >
        + Ajouter une alerte de fourniture
      </button>
    );
  }

  return (
    <Card className="p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Nouvelle alerte</h3>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type d'alerte */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Type de fourniture
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALERT_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setAlertType(type.value)}
                className={`p-2 rounded-md border transition-colors text-sm ${
                  alertType === type.value
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Titre */}
        <Field label="Titre de l'alerte" htmlFor="alert_title" required>
          <input
            id="alert_title"
            name="alert_title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Papier DTF en rupture"
            required
            className={inputClass}
          />
        </Field>

        {/* Description */}
        <Field label="Description (optionnel)" htmlFor="alert_description">
          <textarea
            id="alert_description"
            name="alert_description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Précisions supplémentaires..."
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </Field>

        {/* Priorité */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Priorité
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`p-2 rounded-md border transition-colors text-sm font-medium ${
                  priority === p.value
                    ? `${p.color} border-current`
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button type="submit" loading={loading}>
            ✅ Créer l&apos;alerte
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setExpanded(false)}
            disabled={loading}
          >
            Annuler
          </Button>
        </div>
      </form>
    </Card>
  );
}
