import { createClient } from "@/lib/supabase/server";
import { OrderDetailsFields } from "@/components/production/order-details-fields";
import { createPipelineOrder } from "@/lib/actions/pipeline-actions";
import Link from "next/link";

export default async function NewOrderPage() {
  const supabase = createClient();

  // Récupérer les contacts existants
  const { data: contacts } = await supabase
    .from("contacts")
    .select("id, name")
    .eq("contact_type", "client")
    .order("name");

  async function handleSubmit(formData: FormData) {
    "use server";
    const result = await createPipelineOrder(formData);
    if (result.error) {
      throw new Error(result.error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-6">
          <Link href="/admin/production/vue-ensemble" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            ← Retour
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Nouvelle commande</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Configurez rapidement une commande
          </p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          <OrderDetailsFields contacts={contacts ?? []} />

          <div className="flex gap-3 justify-end">
            <Link
              href="/admin/production/vue-ensemble"
              className="px-4 py-2 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Créer la commande
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
