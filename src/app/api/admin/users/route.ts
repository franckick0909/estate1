import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  createdAt: string | null;
}

export async function GET(): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Accès non autorisé",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true, // S'assurer que createdAt est bien sélectionné
      },
    });

    if (!Array.isArray(users)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Format de données invalide",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const safeUsers: SafeUser[] = users.map((user) => ({
      id: String(user.id),
      name: user.name,
      email: String(user.email),
      role: String(user.role),
      image: user.image,
      createdAt: user.createdAt ? String(user.createdAt) : null,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        users: safeUsers,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
