"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdEdit, MdEmail, MdLock, MdPerson, MdSave } from "react-icons/md";

interface UpdateData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export default function ModifierProfil() {
  const { data: session, update } = useSession();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", content: "" });

    try {
      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      const updateData: UpdateData = {};
      if (formData.name !== session?.user?.name)
        updateData.name = formData.name;
      if (formData.email !== session?.user?.email)
        updateData.email = formData.email;
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      // Forcer la mise à jour de la session avec les nouvelles données
      await update({
        user: {
          ...session?.user,
          name: data.user.name,
          email: data.user.email,
        },
      });

      // Forcer un rafraîchissement du client
      router.refresh();

      setMessage({
        type: "success",
        content: "Profil mis à jour avec succès",
      });

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        name: data.user.name,
        email: data.user.email,
      }));
    } catch (error) {
      setMessage({
        type: "error",
        content:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setIsUploading(true);
    setMessage({ type: "", content: "" });
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erreur lors de l'upload");

      const data = await response.json();
      const imageUrl = data.secure_url;

      const updateResponse = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!updateResponse.ok) throw new Error("Erreur lors de la mise à jour");

      // Mise à jour explicite de la session avec la nouvelle image
      await update({
        user: {
          ...session?.user,
          image: imageUrl,
        },
      });

      // Double rafraîchissement pour forcer la mise à jour
      router.refresh();

      // Attendre un court instant pour la mise à jour
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Forcer un second rafraîchissement
      router.refresh();

      setMessage({
        type: "success",
        content: "Photo de profil mise à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur:", error);
      setMessage({
        type: "error",
        content: "Erreur lors de la mise à jour de la photo de profil",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-white">
        <p className="text-center text-2xl font-semibold text-gray-900">
          Veuillez vous connecter pour accéder à votre profil.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-100 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Modifier mon profil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Photo de profil */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden relative shadow-md">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Photo de profil"
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                ) : (
                  <div className="w-full h-full bg-violet-100 flex items-center justify-center">
                    <MdPerson className="w-16 h-16 text-violet-400" />
                  </div>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-violet-600 text-white p-2 rounded-full cursor-pointer hover:bg-violet-700 transition-colors"
              >
                <MdEdit className="w-5 h-5" />
                <input
                  title="Modifier votre photo de profil"
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
              </label>
            </div>
            {isUploading && (
              <div className="text-sm text-violet-700">
                Mise à jour de votre photo...
              </div>
            )}
          </div>

          {/* Section Formulaire */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdPerson className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    title="Modifier votre nom"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-gray-700"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdEmail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    title="Modifier votre email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-gray-700"
                  />
                </div>
              </div>

              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe actuel
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    title="Modifier votre mot de passe actuel"
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-gray-700"
                  />
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    title="Modifier votre nouveau mot de passe"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-gray-700"
                  />
                </div>
              </div>

              {/* Confirmer le nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    title="Modifier votre nouveau mot de passe"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-gray-700"
                  />
                </div>
              </div>

              {/* Message de statut */}
              {message.content && (
                <div
                  className={`p-4 rounded-md ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {message.content}
                </div>
              )}

              {/* Bouton de soumission */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-violet-300 disabled:cursor-not-allowed"
                >
                  <MdSave className="h-5 w-5 mr-2" />
                  {isSaving
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
