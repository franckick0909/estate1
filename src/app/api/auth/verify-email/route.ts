import { VerificationEmail } from "@/app/emails/verification-email";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Créer un token de vérification
    const token = createHash("sha256")
      .update(`${user.email}-${Date.now()}`)
      .digest("hex");

    // Sauvegarder le token dans la base de données
    await prisma.verificationToken.create({
      data: {
        identifier: user.email || "",
        token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 heures
      },
    });

    const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;

    await resend.emails.send({
      from: "Century 21 <verification@votredomaine.com>",
      to: email,
      subject: "Vérifiez votre adresse email",
      react: VerificationEmail({
        verificationLink,
        userName: user.name || "Utilisateur",
      }) as React.ReactElement,
    });

    return NextResponse.json(
      { message: "Email de vérification envoyé" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
