"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdEmail, MdRefresh } from "react-icons/md";

export default function VerifyEmailSent() {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResendEmail = async () => {
    setIsResending(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("pendingVerificationEmail"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi de l'email");
      }

      setMessage("Email de vérification renvoyé avec succès !");
    } catch (error) {
      console.error("Erreur:", error);
      setMessage(
        error instanceof Error ? error.message : "Une erreur est survenue"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-100 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MdEmail className="w-8 h-8 text-violet-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Vérifiez votre email
        </h2>

        <p className="text-gray-600 mb-6">
          Un email de vérification a été envoyé à votre adresse email. Veuillez
          cliquer sur le lien dans l&apos;email pour activer votre compte.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full flex items-center justify-center px-4 py-2 border border-violet-600 text-violet-600 rounded-md hover:bg-violet-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <MdRefresh className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <MdRefresh className="w-5 h-5 mr-2" />
            )}
            {isResending ? "Envoi en cours..." : "Renvoyer l'email"}
          </button>

          {message && (
            <p
              className={`text-sm ${
                message.includes("succès") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <button
            onClick={() => router.push("/signin")}
            className="w-full px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
          >
            Aller à la connexion
          </button>

          <p className="text-sm text-gray-500">
            N&apos;oubliez pas de vérifier vos spams si vous ne trouvez pas
            l&apos;email.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
