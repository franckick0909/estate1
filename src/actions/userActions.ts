"use server";

import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Non autorisé");
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToDelete) {
      throw new Error("Utilisateur non trouvé");
    }

    // Supprimer toutes les relations dans l'ordre
    await prisma.verificationToken.deleteMany({
      where: { identifier: userToDelete.email },
    });

    await prisma.session.deleteMany({
      where: { userId },
    });

    await prisma.account.deleteMany({
      where: { userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath("/admin/users");
    return { success: true, message: "Utilisateur supprimé avec succès" };
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      throw new Error("Non autorisé");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role as Role },
    });

    revalidatePath("/admin/users");
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    throw error;
  }
}
