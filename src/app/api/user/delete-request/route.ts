import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    // Mettre à jour l'utilisateur avec la date de demande de suppression
    await prisma.user.update({
      where: { id: session.user.id },
      data: { deleteRequestedAt: new Date() },
    });

    return NextResponse.json(
      { message: "Demande de suppression enregistrée" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la demande de suppression:", error);
    return NextResponse.json(
      { message: "Erreur lors de la demande de suppression" },
      { status: 500 }
    );
  }
}
