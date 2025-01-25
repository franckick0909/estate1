import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    // Annuler la demande de suppression
    await prisma.user.update({
      where: { id: session.user.id },
      data: { deleteRequestedAt: null },
    });

    return NextResponse.json(
      { message: "Demande de suppression annulée" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'annulation:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'annulation" },
      { status: 500 }
    );
  }
}
