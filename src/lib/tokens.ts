import { randomBytes } from "crypto";
import prisma from "./prisma";

export async function generateVerificationToken(
  email: string
): Promise<string> {
  try {
    // Supprimer les anciens tokens
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    return token;
  } catch (error) {
    console.error("Erreur lors de la génération du token:", error);
    throw new Error("Erreur lors de la génération du token");
  }
}
