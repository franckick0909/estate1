"use client";

import { useProfileImage } from "@/context/ProfileImageContext";
import { useUser } from "@/context/UserContext";
import { useAuthModal } from "@/hooks/useAuth";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdPerson } from "react-icons/md";
import { BurgerButton } from "./burgerButton";
import { NavbarMobile } from "./navbarMobile";

export default function Navbar() {
  const { userName } = useUser();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { openModal } = useAuthModal();
  const { profileImage } = useProfileImage();

  // Utiliser profileImage s'il existe, sinon utiliser l'image de la session
  const currentImage = profileImage || session?.user?.image;

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Agents", href: "/agents" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <header className="flex justify-between items-center h-24 w-full text-gray-900 bg-white z-[50]">
        <div className="flex-[3] flex items-center gap-10 md:gap-16 lg:gap-20 h-full">
          <div className="flex items-center gap-0 text-lg font-bold h-full mr-3">
            <Image
              src="/home1.svg"
              alt="logo"
              width={50}
              height={50}
              className="object-cover"
              priority
            />
            <span className="text-gray-700 inline-flex min-w-[124px]">
              CENTURY 21
            </span>
          </div>

          <nav className="relative flex items-center justify-start gap-2 md:gap-4 lg:gap-6 xl:gap-8 max-sm:hidden w-full h-full z-[50]">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="text-gray-900 hover:text-black font-inter tracking-wide relative inline-block
                          before:content-[''] before:absolute before:w-full before:h-[1px] before:bottom-0 before:left-0 
                          before:bg-black before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100
                          before:transition-transform before:duration-300 before:ease-in-out"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-[2] hidden items-center justify-end gap-2 md:gap-4 h-full sm:flex md:bg-violet-100 pr-[5px]">
          {status === "loading" ? (
            <div className="animate-pulse h-10 w-24 bg-gray-200 rounded-md"></div>
          ) : session ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt="Photo de profil"
                    width={50}
                    height={50}
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                    <MdPerson className="text-gray-500 text-2xl" />
                  </div>
                )}
              </div>

              {userName && (
                <span className="text-sm md:text-base">{userName}</span>
              )}
              <div className="relative">
                <Link
                  href="/profil"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-white bg-violet-600 rounded-md py-2 px-4 hover:bg-transparent hover:text-violet-600 transition-colors text-sm md:text-base"
                >
                  Profil
                </Link>
                <div className="absolute -top-1 -right-1 bg-rose-500 h-6 w-6 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors text-sm md:text-base"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => openModal("signin")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors text-sm md:text-base"
              >
                Se connecter
              </button>
              <button
                onClick={() => openModal("signup")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-white bg-violet-600 rounded-md p-2 hover:bg-transparent hover:text-violet-600 transition-colors text-sm md:text-base"
              >
                S&apos;inscrire
              </button>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 h-full sm:hidden">
          <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </header>

      <NavbarMobile isOpen={isOpen} user={session?.user || null} />
    </>
  );
}
