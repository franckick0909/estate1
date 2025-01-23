"use client";

import { create } from "zustand";

type AuthModalType =
  | "signin"
  | "signup"
  | "forgotPassword"
  | "verifyEmail"
  | null;

interface AuthModalStore {
  modalType: AuthModalType;
  openModal: (type: AuthModalType) => void;
  closeModal: () => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  modalType: null,
  openModal: (type) => set({ modalType: type }),
  closeModal: () => set({ modalType: null }),
}));
