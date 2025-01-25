import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

// Définir le type pour les données de mise à jour
interface UpdateData {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();
    const { name, email, currentPassword, newPassword, image } = data;

    // Si une nouvelle image est fournie, mettre à jour uniquement l'image
    if (image) {
      const updatedUser = await prisma.user.update({
        where: { email: session.user.email },
        data: { image },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      });

      return NextResponse.json({
        message: "Image mise à jour avec succès",
        user: updatedUser,
      });
    }

    // Récupérer l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
        role: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Préparer les données à mettre à jour
    const updateData: UpdateData = {};

    // Gérer la mise à jour du nom
    if (name && name !== currentUser.name) {
      updateData.name = name;
    }

    // Gérer la mise à jour de l'email
    if (email && email !== currentUser.email) {
      // Vérifier si l'email n'est pas déjà utilisé
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: "Cet email est déjà utilisé" },
          { status: 400 }
        );
      }

      updateData.email = email;
    }

    // Gérer la mise à jour du mot de passe
    if (newPassword && currentPassword) {
      // Vérifier l'ancien mot de passe
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        currentUser.password!
      );

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Mot de passe actuel incorrect" },
          { status: 400 }
        );
      }

      // Hasher le nouveau mot de passe
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Gérer la mise à jour de l'image
    if (image) {
      updateData.image = image;
    }

    // Si aucune donnée à mettre à jour
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "Aucune modification détectée" },
        { status: 400 }
      );
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur de mise à jour:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
