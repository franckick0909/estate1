"use client";

import { useAuthModal } from "@/hooks/useAuth";
import { MdEmail } from "react-icons/md";
import Modal from "../Modal";

export default function VerifyEmailModal() {
  const { modalType, closeModal } = useAuthModal();
  const isOpen = modalType === "verifyEmail";
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("pendingVerificationEmail")
      : null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Vérifiez votre email">
      <div className="text-center space-y-6 py-4">
        <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-violet-100">
          <MdEmail className="h-6 w-6 text-violet-600" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">
            Vérification de votre adresse email
          </h3>
          <p className="text-sm text-gray-500">
            Nous avons envoyé un email de vérification à{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>
          <p className="text-sm text-gray-500">
            Cliquez sur le lien dans l&apos;email pour activer votre compte.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => closeModal()}
            className="w-full px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 rounded-md hover:bg-violet-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Fermer
          </button>
          <p className="text-xs text-gray-500">
            Vous n&apos;avez pas reçu l&apos;email ? Vérifiez vos spams ou{" "}
            <button
              onClick={() => {
                // Ajouter la logique de renvoi d'email ici
              }}
              className="text-violet-600 hover:text-violet-500"
            >
              cliquez ici pour renvoyer
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}
