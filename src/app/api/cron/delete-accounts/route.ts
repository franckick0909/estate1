import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Vérifier le header d'autorisation pour la sécurité
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Trouver et supprimer les comptes dont la demande date de plus de 24h
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        deleteRequestedAt: {
          lt: twentyFourHoursAgo,
        },
      },
    });

    return NextResponse.json({
      message: `${deletedUsers.count} comptes supprimés`,
      count: deletedUsers.count,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression des comptes:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression des comptes" },
      { status: 500 }
    );
  }
}
