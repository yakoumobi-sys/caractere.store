import { createClient } from "@/lib/supabase/server";
import { PageHeader, Button } from "@/components/ui";
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
    // Rediriger vers la commande créée
    // redirect(`/production/${result.orderId}`);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/production" className="text-sm text-brand-500 hover:text-brand-600">
          ← Retour
        </Link>
      </div>

      <PageHeader
        title="Nouvelle commande"
        description="Configurez rapidement une commande WhatsApp"
      />

      <form action={handleSubmit} className="space-y-6">
        <OrderDetailsFields contacts={contacts ?? []} />

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" type="button">
            <Link href="/production">Annuler</Link>
          </Button>
          <Button type="submit">Créer la commande</Button>
        </div>
      </form>
    </div>
  );
}
