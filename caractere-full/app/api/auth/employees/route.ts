import { getEmployeesList } from "@/lib/actions/auth-actions";

export async function GET() {
  try {
    const result = await getEmployeesList();

    if (result.error) {
      return Response.json({ error: result.error }, { status: 400 });
    }

    return Response.json({
      success: true,
      employees: result.employees,
    });
  } catch (error) {
    console.error("Get employees API error:", error);
    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
