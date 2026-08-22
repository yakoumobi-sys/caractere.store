import { loginEmployee } from "@/lib/actions/auth-actions";

export async function POST(req: Request) {
  try {
    const { email, password, isFirstLogin } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const result = await loginEmployee(email, password, isFirstLogin);

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
