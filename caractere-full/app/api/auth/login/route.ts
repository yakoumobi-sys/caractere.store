import { loginEmployee } from "@/lib/actions/auth-actions";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, password, isFirstLogin } = await req.json();

    if (!firstName || !lastName || !password) {
      return Response.json(
        { error: "Nom et mot de passe requis" },
        { status: 400 }
      );
    }

    const result = await loginEmployee(firstName, lastName, password, isFirstLogin);

    if (result.error) {
      return Response.json({ error: result.error }, { status: 401 });
    }

    return Response.json({
      success: true,
      message: result.message,
      token: result.token,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
