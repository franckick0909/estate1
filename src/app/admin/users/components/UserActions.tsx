"use client";

import { useToast } from "@/components/toast/toast";
import { useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
}

interface UserActionsProps {
  user: User;
  onUpdate: () => void;
}

export default function UserActions({ user, onUpdate }: UserActionsProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    role: user.role,
  });

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        showToast("Utilisateur mis à jour avec succès", "success");
        setIsEditing(false);
        onUpdate();
      } else {
        showToast(data.error || "Erreur lors de la mise à jour", "error");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      showToast("Erreur lors de la mise à jour", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();

        if (data.success) {
          showToast("Utilisateur supprimé avec succès", "success");
          onUpdate();
        } else {
          showToast(data.error || "Erreur lors de la suppression", "error");
        }
      } else {
        throw new Error("Réponse invalide du serveur");
      }
    } catch (error) {
      console.error("Erreur détaillée:", error);
      showToast("Erreur lors de la suppression de l'utilisateur", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleEdit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rôle
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="USER">Utilisateur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </label>
        </div>
        <div className="flex space-x-2">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Annuler
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Modifier
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isLoading}
        className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        {isLoading ? "Suppression..." : "Supprimer"}
      </button>
    </div>
  );
}
