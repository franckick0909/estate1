"use client";

import { useAuthModal } from "@/hooks/useAuth";
import Modal from "../Modal";
import SignInForm from "./SignInForm";

export default function SignInModal() {
  const { modalType, closeModal } = useAuthModal();
  const isOpen = modalType === "signin";

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Connexion">
      <SignInForm />
    </Modal>
  );
}
