"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AdminPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin");
    },
  });
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session?.user || session.user.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-xl">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="w-full mx-auto px-4 py-8 bg-gray-900 flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Utilisateurs</h2>
          <p className="text-gray-300 mb-4">Gérer les utilisateurs</p>
          <button
            type="button"
            onClick={() => router.push("/admin/users")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Voir les utilisateurs
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
