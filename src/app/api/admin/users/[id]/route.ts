import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

interface ApiResponse {
  success: boolean;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    image: string | null;
  };
  error?: string;
  message?: string;
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const defaultResponse: ApiResponse = {
    success: false,
    error: "Erreur inconnue",
  };

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

    const data = await request.json();
    const { name, email, role } = data;

    if (!params.id || !email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "ID et email requis",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        user: updatedUser,
        message: "Utilisateur mis à jour avec succès",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      defaultResponse.error = error.message;
    }
    return new Response(JSON.stringify(defaultResponse), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Accès non autorisé",
          error: "Vous n'avez pas les droits nécessaires",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Vérifier si l'utilisateur existe
    const userToDelete = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!userToDelete) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Utilisateur non trouvé",
          error: "L'utilisateur n'existe pas",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Supprimer toutes les relations dans l'ordre
    await prisma.verificationToken.deleteMany({
      where: { identifier: userToDelete.email },
    });

    await prisma.session.deleteMany({
      where: { userId: params.id },
    });

    await prisma.account.deleteMany({
      where: { userId: params.id },
    });

    // Maintenant supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: params.id },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Utilisateur supprimé avec succès",
        error: null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Erreur serveur",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
