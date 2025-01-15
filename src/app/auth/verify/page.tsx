"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setStatus("success");
          setTimeout(() => {
            router.push("/auth/signin");
          }, 3000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'email :", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-white px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-xl shadow-lg">
        {status === "loading" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Vérification de votre email...
            </h2>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto"></div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email vérifié avec succès !
            </h2>
            <p className="text-gray-600 mb-4">
              Vous allez être redirigé vers la page de connexion...
            </p>
            <Link
              href="/auth/signin"
              className="text-violet-600 hover:text-violet-500"
            >
              Cliquer ici si vous n&apos;êtes pas redirigé
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Erreur de vérification
            </h2>
            <p className="text-gray-600 mb-4">
              Le lien de vérification est invalide ou a expiré.
            </p>
            <Link
              href="/auth/signin"
              className="text-violet-600 hover:text-violet-500"
            >
              Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
