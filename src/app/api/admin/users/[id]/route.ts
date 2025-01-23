import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function DELETE(
  request: Request,
  { params }: RouteContext
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

export async function PUT(
  request: Request,
  { params }: RouteContext
): Promise<Response> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
      });
    }

    const data = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        role: data.role,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Rôle mis à jour avec succès",
        user: updatedUser,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la mise à jour" }),
      { status: 500 }
    );
  }
}
