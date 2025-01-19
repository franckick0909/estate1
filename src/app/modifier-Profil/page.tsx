"use client";

import ProgressBar from "@/app/components/ProgressBar";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/validation";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdDeleteForever,
  MdEdit,
  MdEmail,
  MdLock,
  MdPerson,
  MdRefresh,
  MdSave,
  MdVisibility,
  MdVisibilityOff,
  MdWarning,
} from "react-icons/md";

interface UpdateData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export default function ModifierProfil() {
  const { data: session, update } = useSession();
  const router = useRouter();

  // États existants
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });

  // Nouveaux états
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCountdown, setDeleteCountdown] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  // Ajout d'un état pour suivre les champs modifiés
  const [modifiedFields, setModifiedFields] = useState<Record<string, boolean>>(
    {}
  );

  // Ajout de l'état pour la modal de confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Validation en temps réel
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    // Vérifier si des modifications ont été apportées
    const hasNameChanged = formData.name !== session?.user?.name;
    const hasEmailChanged = formData.email !== session?.user?.email;
    const hasPasswordChanged = formData.newPassword !== "";

    // Pour la modification du profil, on ne valide que si les champs sont remplis
    if (hasNameChanged) {
      const nameError = validateName(formData.name);
      if (nameError && formData.name.trim() !== "") newErrors.name = nameError;
    }

    if (hasEmailChanged) {
      const emailError = validateEmail(formData.email);
      if (emailError && formData.email.trim() !== "")
        newErrors.email = emailError;
    }

    if (hasPasswordChanged) {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) newErrors.newPassword = passwordError;

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    setErrors(newErrors);

    // Vérifier s'il y a des modifications valides
    const hasValidChanges =
      hasNameChanged || hasEmailChanged || hasPasswordChanged;
    setIsValid(Object.keys(newErrors).length === 0 && hasValidChanges);
  }, [formData, session?.user?.name, session?.user?.email]);

  // Fonction pour initier la suppression du compte
  const handleDeleteRequest = async () => {
    try {
      const response = await fetch("/api/user/delete-request", {
        method: "POST",
      });

      if (!response.ok)
        throw new Error("Erreur lors de la demande de suppression");

      setDeleteCountdown(24); // 24 heures
      setShowDeleteConfirm(true);

      // Démarrer le compte à rebours
      const interval = setInterval(() => {
        setDeleteCountdown((prev) => {
          if (prev === null || prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 3600000); // Mise à jour toutes les heures
    } catch (error) {
      console.error(
        "Erreur lors de la demande de suppression du compte",
        error
      );
      setMessage({
        type: "error",
        content: "Erreur lors de la demande de suppression du compte",
      });
    }
  };

  // Fonction pour annuler la suppression du compte
  const handleCancelDelete = async () => {
    try {
      const response = await fetch("/api/user/cancel-delete", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Erreur lors de l'annulation");

      setDeleteCountdown(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Erreur lors de l'annulation de la suppression", error);
      setMessage({
        type: "error",
        content: "Erreur lors de l'annulation de la suppression",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Marquer le champ comme modifié si sa valeur est différente de l'originale
    setModifiedFields((prev) => ({
      ...prev,
      [name]:
        name === "name"
          ? value !== session?.user?.name
          : name === "email"
            ? value !== session?.user?.email
            : value !== "",
    }));
  };

  // Fonction pour réinitialiser le formulaire
  const handleReset = () => {
    setFormData({
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setModifiedFields({});
    setErrors({});
  };

  // Fonction pour gérer la sauvegarde avec confirmation
  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  // Fonction existante handleSubmit renommée
  const submitChanges = async () => {
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
    setShowConfirmModal(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setIsUploading(true);
    setUploadProgress(0);
    setMessage({ type: "", content: "" });

    const file = e.target.files[0];

    // Vérification de la taille du fichier
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        content: "Le fichier ne doit pas dépasser 5MB",
      });
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(30); // Simulation du début de l'upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(60); // Simulation de la progression

      if (!response.ok) throw new Error("Erreur lors de l'upload");

      const data = await response.json();
      const imageUrl = data.secure_url;

      setUploadProgress(80); // Simulation de la progression

      const updateResponse = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!updateResponse.ok) throw new Error("Erreur lors de la mise à jour");

      await update({
        ...session,
        user: {
          ...session?.user,
          image: imageUrl,
        },
      });

      setUploadProgress(100); // Upload terminé

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
      // Attendre un peu avant de cacher la barre de progression
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  // Effet pour gérer la disparition automatique des messages
  useEffect(() => {
    if (message.content) {
      const timer = setTimeout(() => {
        setMessage({ type: "", content: "" });
      }, 4000); // 4 secondes

      // Cleanup du timer si le composant est démonté ou si un nouveau message arrive
      return () => clearTimeout(timer);
    }
  }, [message.content]);

  if (!session) {
    return (
      <div className="bg-gradient-to-l from-violet-100 to-white container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <p className="text-center text-2xl font-semibold text-gray-900">
          Veuillez vous connecter pour accéder à votre profil.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-100 to-white py-12 px-2 sm:px-4 lg:px-6">
      <div className="mx-auto">
        {/* Grille Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Box Photo de profil - Span 1 colonne */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 col-span-2 md:col-span-1"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Photo de profil
              </h2>
              <div className="relative mb-4">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div className="w-32 h-32 rounded-full overflow-hidden relative shadow-lg">
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
                        <MdPerson className="w-20 h-20 text-violet-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 max-w-48">
                    Vous pouvez modifier votre photo de profil en cliquant sur
                    le bouton ci-dessous.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-6 flex-wrap">
                  <p className="text-xs text-gray-700 max-w-48">
                    Seulement les fichiers JPG, JPEG, PNG et GIF sont autorisés.
                  </p>
                  <p className="text-xs text-gray-700 max-w-48">
                    La taille du fichier ne doit pas dépasser 5MB.
                  </p>
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-1/4 right-0 bg-violet-600 text-white p-4 rounded-full cursor-pointer hover:bg-violet-700 transition-colors"
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-2"
                >
                  <ProgressBar progress={uploadProgress} />
                  <p className="text-sm text-violet-600">
                    Upload en cours... {uploadProgress}%
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Box Informations personnelles - Span 2 colonnes sur desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 col-span-2 md:col-span-1 lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Informations personnelles
            </h2>
            <div className="grid gap-6">
              {/* Champ Nom */}
              <div className="relative">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom complet
                  {modifiedFields.name && (
                    <span className="ml-2 text-violet-600 text-xs">
                      (Modifié)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <MdPerson className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={session?.user?.name || "Votre nom"}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-violet-500 focus:border-violet-500 transition-colors
                      ${modifiedFields.name ? "border-violet-300 bg-violet-50" : "border-gray-300"}
                      ${errors.name ? "border-red-300" : ""}
                    `}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-rose-600"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>

              {/* Champ Email */}
              <div className="relative">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse email
                  {modifiedFields.email && (
                    <span className="ml-2 text-violet-600 text-xs">
                      (Modifié)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <MdEmail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={session?.user?.email || "votre@email.com"}
                    className={`block w-full pl-10 pr-3 py-2 border rounded-md focus:ring-violet-500 focus:border-violet-500 transition-colors
                      ${modifiedFields.email ? "border-violet-300 bg-violet-50" : "border-gray-300"}
                      ${errors.email ? "border-red-300" : ""}
                    `}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-rose-600"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Box Mot de passe - Span 3 colonnes sur desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 grid col-span-2 md:col-span-1 lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Modifier le mot de passe
            </h2>
            <div className="grid gap-6">
              {/* Mot de passe actuel */}
              <div className="relative">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mot de passe actuel
                  {modifiedFields.currentPassword && (
                    <span className="ml-2 text-violet-600 text-xs">
                      (Modifié)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <MdLock className="h-5 w-5" />
                  </span>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:ring-violet-500 focus:border-violet-500 text-gray-900 ${
                      errors.currentPassword
                        ? "border-rose-300"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? (
                      <MdVisibilityOff className="h-5 w-5" />
                    ) : (
                      <MdVisibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-rose-600"
                  >
                    {errors.currentPassword}
                  </motion.p>
                )}
              </div>

              {/* Nouveau mot de passe */}
              <div className="relative">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <MdLock className="h-5 w-5" />
                  </span>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:ring-violet-500 focus:border-violet-500 text-gray-900 ${
                      errors.newPassword ? "border-rose-300" : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <MdVisibilityOff className="h-5 w-5" />
                    ) : (
                      <MdVisibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-rose-600"
                  >
                    {errors.newPassword}
                  </motion.p>
                )}
              </div>

              {/* Confirmer le nouveau mot de passe */}
              <div className="relative">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirmer le nouveau mot de passe
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <MdLock className="h-5 w-5" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-10 py-2 border rounded-md focus:ring-violet-500 focus:border-violet-500 text-gray-900 ${
                      errors.confirmPassword
                        ? "border-rose-300"
                        : "border-gray-300"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <MdVisibilityOff className="h-5 w-5" />
                    ) : (
                      <MdVisibility className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-rose-600"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Box Suppression du compte - Span 3 colonnes sur desktop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 sm:p-8 grid col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Suppression du compte
              </h2>
              {deleteCountdown !== null && (
                <span className="text-red-600 font-medium">
                  Suppression dans {deleteCountdown}h
                </span>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <MdWarning className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Attention : Cette action est irréversible
                  </h3>
                  <p className="mt-2 text-sm text-red-700">
                    La suppression de votre compte entraînera la perte
                    définitive de toutes vos données après un délai de 24
                    heures. Pendant ce délai, vous pourrez annuler la
                    suppression.
                  </p>
                </div>
              </div>
            </div>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <MdDeleteForever className="h-5 w-5 mr-2" />
                Supprimer mon compte
              </button>
            ) : deleteCountdown === null ? (
              <div className="space-y-4">
                <p className="text-gray-700 font-medium">
                  Êtes-vous sûr de vouloir supprimer votre compte ?
                </p>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleDeleteRequest}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Confirmer la suppression
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleCancelDelete}
                className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
              >
                Annuler la suppression
              </button>
            )}
          </motion.div>
        </div>

        {/* Messages de notification */}
        <AnimatePresence>
          {message.content && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                </svg>
              )}
              <span>{message.content}</span>
              <button
                type="button"
                title="Fermer"
                onClick={() => setMessage({ type: "", content: "" })}
                className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                </svg>
              </button>
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 4, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 w-full ${
                  message.type === "success" ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ transformOrigin: "left" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boutons d'action - En dehors de la grille */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex flex-col sm:flex-row justify-evenly items-center gap-4 bg-white rounded-xl shadow-lg p-6 sm:p-8"
        >
          <button
            type="button"
            onClick={handleReset}
            disabled={!Object.keys(modifiedFields).length}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <MdRefresh className="h-5 w-5 mr-2" />
            Réinitialiser
          </button>

          <button
            type="submit"
            onClick={handleSaveClick}
            disabled={!isValid || isSaving}
            className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
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
                Enregistrement...
              </>
            ) : (
              <>
                <MdSave className="h-5 w-5 mr-2" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </motion.div>

        {/* Modal de confirmation */}
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmer les modifications
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Êtes-vous sûr de vouloir enregistrer ces modifications ?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={submitChanges}
                  className="px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
