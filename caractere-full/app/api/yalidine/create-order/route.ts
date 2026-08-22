import { createYalidineOrder } from "@/lib/actions/pipeline-actions";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const result = await createYalidineOrder(data);

    if ("error" in result) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json(result);
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
