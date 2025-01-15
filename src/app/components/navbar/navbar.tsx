"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BurgerButton } from "./burgerButton";
import { NavbarMobile } from "./navbarMobile";
import { useSession, signOut } from "next-auth/react";
import { User } from "@prisma/client";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = ["Home", "About", "Contact", "Agents"];

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
      <header className="flex justify-between items-center h-24 w-full text-gray-900 bg-white z-[100]">
        <div className="flex-[3] flex items-center gap-10 md:gap-16 lg:gap-20 h-full">
          <div className="flex items-center gap-0 text-lg font-bold h-full z-[51] mr-3">
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

          <nav className="relative flex items-center justify-start gap-2 md:gap-4 lg:gap-6 xl:gap-8 max-sm:hidden w-full h-full">
            {navItems.map((item) => (
              <Link
                href="/"
                key={item}
                className="text-gray-900 hover:text-black font-inter tracking-wide relative inline-block
                          before:content-[''] before:absolute before:w-full before:h-[1px] before:bottom-0 before:left-0 
                          before:bg-black before:origin-right before:scale-x-0 hover:before:origin-left hover:before:scale-x-100
                          before:transition-transform before:duration-300 before:ease-in-out"
              >
                {item}
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
                <Image
                  src={session.user?.image || "https://via.placeholder.com/150"}
                  alt={session.user?.name || "utilisateur"}
                  width={50}
                  height={50}
                  className="object-cover w-full h-full rounded-full"
                />
              </div>
              <span className="text-sm md:text-base">{session.user?.name}</span>
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
              <Link
                href="/auth/signin"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors text-sm md:text-base"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto flex items-center justify-center gap-2 border border-violet-600 text-white bg-violet-600 rounded-md p-2 hover:bg-transparent hover:text-violet-600 transition-colors text-sm md:text-base"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-4 h-full sm:hidden">
          <BurgerButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </header>

      <NavbarMobile isOpen={isOpen} user={session?.user as User} />
    </>
  );
}