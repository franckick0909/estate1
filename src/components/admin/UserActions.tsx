"use client";

import { useToast } from "@/components/toast/toast";
import { useTransition } from "react";
import RoleSelect from "./RoleSelect";

interface UserActionsProps {
  userId: string;
  currentRole: string;
  onDelete: (userId: string) => Promise<void>;
  onUpdateRole: (userId: string, role: string) => Promise<void>;
}

export default function UserActions({
  userId,
  currentRole,
  onDelete,
  onUpdateRole,
}: UserActionsProps) {
  const [isPending, startTransition] = useTransition();
  const { showToast } = useToast();

  const handleDelete = () => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      startTransition(async () => {
        try {
          await onDelete(userId);
        } catch (error) {
          console.error(error);
          showToast("Erreur lors de la suppression", "error");
        }
      });
    }
  };

  const handleRoleChange = async (newRole: string) => {
    startTransition(async () => {
      try {
        await onUpdateRole(userId, newRole);
      } catch (error) {
        console.error(error);
        showToast("Erreur lors du changement de rôle", "error");
      }
    });
  };

  return (
    <div className="flex items-center gap-4">
      <RoleSelect
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        disabled={isPending}
      />
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="text-red-600 hover:text-red-900 disabled:opacity-50"
      >
        {isPending ? "En cours..." : "Supprimer"}
      </button>
    </div>
  );
}
