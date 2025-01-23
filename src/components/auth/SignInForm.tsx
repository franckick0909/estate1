"use client";

import PasswordInput from "@/components/PasswordInput";
import { useAuthModal } from "@/hooks/useAuth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { MdEmail } from "react-icons/md";

export default function SignInForm() {
  const router = useRouter();
  const { openModal, closeModal } = useAuthModal();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const uniqueId = useId();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      closeModal();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      setError("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <p className="mt-2 text-sm text-gray-600">
          Ou{" "}
          <button
            onClick={() => openModal("signup")}
            className="font-medium text-violet-600 hover:text-violet-500"
          >
            créer un nouveau compte
          </button>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor={`${uniqueId}-signin-email`}
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id={`${uniqueId}-signin-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm text-gray-900"
                placeholder="vous@exemple.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor={`${uniqueId}-signin-password`}
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <div className="mt-1">
              <PasswordInput
                id={`${uniqueId}-signin-password`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connexion...
              </div>
            ) : (
              "Se connecter"
            )}
          </button>
        </div>
      </form>

      <div className="text-center">
        <button
          onClick={() => openModal("forgotPassword")}
          className="text-sm text-violet-600 hover:text-violet-500"
        >
          Mot de passe oublié ?
        </button>
      </div>
    </div>
  );
}
