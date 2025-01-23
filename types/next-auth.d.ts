import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      email: string;
      name: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: Role;
    emailVerified?: Date | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    email: string;
    name: string;
  }
}
