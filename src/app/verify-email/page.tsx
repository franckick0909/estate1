"use client";

import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MdCheckCircle, MdError } from "react-icons/md";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Vérification en cours...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur de vérification");
        }

        setStatus("success");
        setMessage("Email vérifié avec succès !");

        // Redirection après 3 secondes
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Erreur de vérification"
        );
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus("error");
      setMessage("Token manquant");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-100 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6">
          {status === "loading" && (
            <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          )}
          {status === "success" && (
            <MdCheckCircle className="w-16 h-16 text-green-500" />
          )}
          {status === "error" && <MdError className="w-16 h-16 text-red-500" />}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Vérification de l'email
        </h2>

        <p
          className={`text-lg ${
            status === "error"
              ? "text-red-600"
              : status === "success"
                ? "text-green-600"
                : "text-gray-600"
          }`}
        >
          {message}
        </p>

        {status === "error" && (
          <button
            onClick={() => router.push("/signin")}
            className="mt-6 w-full px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors"
          >
            Retour à la connexion
          </button>
        )}
      </motion.div>
    </div>
  );
}
