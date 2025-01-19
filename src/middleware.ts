import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Liste des routes protégées qui nécessitent une vérification d'email
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  // Vérifier si l'utilisateur accède à une route protégée
  if (
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    // Si l'utilisateur n'est pas connecté
    if (!token) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Si l'email n'est pas vérifié
    if (!token.emailVerified) {
      return NextResponse.redirect(new URL("/verify-email-sent", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
