"use client";
import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

const COLORS = {
  bg: "#FAFBFC",
  white: "#FFFFFF",
  primary: "#0066FF",
  primaryLight: "#EFF6FF",
  text: "#1A1F2E",
  textMid: "#6B7280",
  textLight: "#9CA3AF",
  border: "#E5E7EB",
  error: "#EF4444",
  success: "#10B981",
};

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    // Vérifie que le token de reset est dans l'URL
    const hash = window.location.hash;
    if (!hash) {
      setSessionError(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validation
      if (!password || !confirmPassword) {
        setError("Veuillez remplir tous les champs");
        return;
      }

      if (password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères");
        return;
      }

      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas");
        return;
      }

      // Réinitialise le mot de passe avec Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
      
      // Redirige vers login après 2 secondes
      setTimeout(() => {
        router.push("/auth");
      }, 2000);

    } catch (err) {
      setError(err.message || "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  if (sessionError) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg,
          padding: "24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: COLORS.white,
            borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#FEE2E2",
              borderRadius: 8,
              padding: "24px",
              marginBottom: 24,
              fontSize: 14,
              color: "#991B1B",
              lineHeight: 1.6,
            }}
          >
            ⚠️ Le lien de réinitialisation est expiré ou invalide.
            <br />
            <br />
            Veuillez{" "}
            <a
              href="/auth"
              style={{
                color: "#DC2626",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              demander un nouveau lien
            </a>
            .
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg,
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: COLORS.white,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          padding: 40,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              marginBottom: 8,
              color: COLORS.text,
            }}
          >
            Nouveau mot de passe
          </h1>
          <p style={{ fontSize: 14, color: COLORS.textMid }}>
            Crée un mot de passe fort pour sécuriser ton compte.
          </p>
        </div>

        {/* Success message */}
        {success && (
          <div
            style={{
              background: "#F0FDF4",
              border: `1px solid #DCFCE7`,
              borderRadius: 8,
              padding: "16px",
              marginBottom: 24,
              fontSize: 13,
              color: "#15803D",
              textAlign: "center",
            }}
          >
            ✓ Mot de passe réinitialisé avec succès!
            <br />
            Redirection en cours...
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            style={{
              background: "#FEE2E2",
              border: `1px solid ${COLORS.error}22`,
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 13,
              color: "#991B1B",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit}>
            {/* Password field */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: COLORS.text,
                }}
              >
                Nouveau mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  fontSize: 14,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color .2s",
                  opacity: loading ? 0.6 : 1,
                }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.primary)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
              />
              <div
                style={{
                  fontSize: 12,
                  color: COLORS.textLight,
                  marginTop: 6,
                }}
              >
                Minimum 8 caractères
              </div>
            </div>

            {/* Confirm password field */}
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 6,
                  color: COLORS.text,
                }}
              >
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: `1px solid ${COLORS.border}`,
                  fontSize: 14,
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "border-color .2s",
                  opacity: loading ? 0.6 : 1,
                }}
                onFocus={(e) => (e.target.style.borderColor = COLORS.primary)}
                onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                background: COLORS.primary,
                color: COLORS.white,
                border: "none",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "background .2s",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) =>
                !loading && (e.target.style.background = "#0052CC")
              }
              onMouseLeave={(e) =>
                !loading && (e.target.style.background = COLORS.primary)
              }
            >
              {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}

        {/* Back to login link */}
        {success && (
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <a
              href="/auth"
              style={{
                fontSize: 14,
                color: COLORS.primary,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Retourner à la connexion
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Page wrapper avec Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: COLORS.bg,
          }}
        >
          <div style={{ fontSize: 14, color: COLORS.textLight }}>
            Chargement...
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
