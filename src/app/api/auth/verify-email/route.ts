import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    console.log("Token reçu:", token);

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 400 });
    }

    const decoded = verifyToken(token);
    console.log("Token décodé:", decoded);

    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    await prisma.user.update({
      where: { email: decoded.email },
      data: { emailVerified: new Date() },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    return NextResponse.json({
      success: true,
      message: "Email vérifié avec succès",
      redirectUrl: `${baseUrl}?verified=true`,
    });
  } catch (error) {
    console.error("Erreur de vérification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification" },
      { status: 500 }
    );
  }
}
