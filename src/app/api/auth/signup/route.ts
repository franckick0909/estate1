import { generateToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/sendgrid";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validation des données
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Générer et envoyer l'email de vérification
    try {
      const verificationToken = generateToken({ email: user.email });
      await sendVerificationEmail(
        user.email,
        user.name || "",
        verificationToken
      );
    } catch (emailError) {
      console.error("Erreur d'envoi d'email:", emailError);
      // On continue même si l'email échoue
    }

    // Créer un objet sans le mot de passe
    const userWithoutPassword = {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      image: user.image,
    };

    return NextResponse.json(
      {
        message: "Compte créé avec succès. Veuillez vérifier votre email.",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}
