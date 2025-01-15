"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdEdit, MdPerson } from "react-icons/md";


export default function ModifierProfil() {
    const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    setIsUploading(true);
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
      
      // Mettre à jour l'image de profil dans la base de données
      const updateResponse = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

    if (!updateResponse.ok) throw new Error("Erreur lors de la mise à jour");


      // Mise à jour de la session avec la nouvelle image
      await updateSession({
        user: {
          ...session?.user,
          image: imageUrl,
        }
      });

    // Forcer un rafraîchissement de l'interface
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-violet-100 to-white">
        <p className="text-center text-2xl font-semibold text-gray-900">Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-violet-100 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden relative">
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

          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {session.user?.name}
            </h1>
            <p className="text-gray-500">{session.user?.email}</p>
          </div>

          {isUploading && (
            <div className="text-sm text-violet-600">
              Mise à jour de votre photo...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}