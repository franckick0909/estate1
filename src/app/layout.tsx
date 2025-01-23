import Providers from "@/app/providers";
import SignInModal from "@/components/auth/SignInModal";
import SignUpModal from "@/components/auth/SignUpModal";
import VerifyEmailModal from "@/components/auth/VerifyEmailModal";
import Navbar from "@/components/navbar/navbar";
import { ToastProvider } from "@/components/toast/toast";
import { ProfileImageProvider } from "@/context/ProfileImageContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vente et location de maison et appartement",
  description: "Vente et location de maison et appartement",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`max-w-screen-2xl mx-auto ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProfileImageProvider>
          <ToastProvider>
            <Providers>
              <Navbar />
              {children}
            </Providers>
            <SignInModal />
            <SignUpModal />
            <VerifyEmailModal />
          </ToastProvider>
        </ProfileImageProvider>
      </body>
    </html>
  );
}
