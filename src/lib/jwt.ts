import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface TokenPayload {
  email: string;
  [key: string]: string | number | boolean | null; // Types plus spécifiques pour les propriétés additionnelles
}

export function generateToken(payload: TokenPayload): string {
  try {
    return jwt.sign(payload, JWT_SECRET);
  } catch (error) {
    console.error("Erreur lors de la génération du token:", error);
    throw new Error("Erreur lors de la génération du token");
  }
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return null;
  }
}
