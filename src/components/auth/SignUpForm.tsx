"use client";

import PasswordInput from "@/components/PasswordInput";
import { useAuthModal } from "@/hooks/useAuth";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/validation";
import { useState } from "react";
import { MdEmail, MdPerson } from "react-icons/md";

export default function SignUpForm() {
  const { openModal, closeModal } = useAuthModal();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; content: string }>({
    type: "",
    content: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameError = validateName(name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'inscription");
      }

      localStorage.setItem("pendingVerificationEmail", email);

      setMessage({
        type: "success",
        content: "Inscription réussie ! Vérifiez votre email.",
      });

      setTimeout(() => {
        closeModal();
        openModal("verifyEmail");
      }, 1000);
    } catch (error) {
      console.error("Erreur:", error);
      setMessage({
        type: "error",
        content:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'inscription.",
      });
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
            onClick={() => openModal("signin")}
            className="font-medium text-violet-600 hover:text-violet-500"
          >
            connectez-vous à votre compte
          </button>
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="signup-name"
              className="block text-sm font-medium text-gray-700"
            >
              Nom complet
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdPerson
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="signup-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                  errors.name ? "border-red-300" : "border-gray-300"
                } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm`}
                placeholder="Votre nom complet"
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="signup-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm`}
                placeholder="vous@exemple.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <div className="mt-1">
              <PasswordInput
                id="signup-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
                error={errors.password}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirmer le mot de passe
            </label>
            <div className="mt-1">
              <PasswordInput
                id="signup-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez votre mot de passe"
                error={errors.confirmPassword}
              />
            </div>
          </div>
        </div>

        {message.content && (
          <div
            className={`p-4 rounded-md ${
              message.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {message.content}
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading ? "bg-violet-400" : "bg-violet-600 hover:bg-violet-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500`}
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
                Inscription en cours...
              </div>
            ) : (
              "S'inscrire"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
