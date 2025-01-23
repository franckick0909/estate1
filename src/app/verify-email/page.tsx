"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string>("Vérification en cours...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token");
        if (!token) {
          setStatus("Token manquant");
          return;
        }

        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (data.success) {
          setStatus("Email vérifié avec succès ! Redirection...");
          setTimeout(() => {
            router.push(data.redirectUrl || "/");
          }, 2000);
        } else {
          setStatus(data.error || "Une erreur est survenue");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'email:", error);
        setStatus("Une erreur est survenue lors de la vérification");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Vérification de l&apos;email
        </h1>
        <p className="text-center text-gray-600">{status}</p>
      </div>
    </div>
  );
}
