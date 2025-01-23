"use client";

import { useAuthModal } from "@/hooks/useAuth";
import Modal from "../Modal";
import SignUpForm from "./SignUpForm";

export default function SignUpModal() {
  const { modalType, closeModal } = useAuthModal();
  const isOpen = modalType === "signup";

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Créer un compte">
      <SignUpForm />
    </Modal>
  );
}
