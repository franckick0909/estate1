import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { User } from "next-auth";

export const NavbarMobile = ({
  isOpen,
  user,
}: {
  isOpen: boolean;
  user: User | undefined;
}) => {
  const menuVariants = {
    open: {
      x: 0.5,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    closed: {
      x: "100%",
      opacity: 0.5,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  return (
    <motion.nav
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      variants={menuVariants}
      className="fixed top-0 right-0 w-3/4 sm:w-3/4 h-full z-50 bg-white text-zinc-950"
    >
      <div className="flex flex-col justify-center items-center gap-4 h-full w-full px-6">
        <motion.div className="flex gap-4 flex-col items-start w-full">
          {user ? (
            <motion.div
              variants={{
                open: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
                closed: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
              }}
              className="flex flex-col gap-4 items-center w-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user.image || "https://via.placeholder.com/150"}
                    alt={user.name || "utilisateur"}
                    width={50}
                    height={50}
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <span>{user.name}</span>
              </div>
              <Link
                href="/profil"
                className="w-full text-center border border-violet-600 text-white bg-violet-600 rounded-md p-2 hover:bg-transparent hover:text-violet-600 transition-colors"
              >
                Profil
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors"
              >
                Déconnexion
              </button>
            </motion.div>
          ) : (
            <motion.div
              variants={{
                open: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.2 },
                },
                closed: {
                  transition: { staggerChildren: 0.05, staggerDirection: -1 },
                },
              }}
              className="flex flex-col gap-2 w-full"
            >
              <Link
                href="/auth/signin"
                className="w-full text-center border border-violet-600 text-violet-600 rounded-md p-2 hover:bg-violet-600 hover:text-white transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/signup"
                className="w-full text-center border border-violet-600 text-white bg-violet-600 rounded-md p-2 hover:bg-transparent hover:text-violet-600 transition-colors"
              >
                S&apos;inscrire
              </Link>
            </motion.div>
          )}
        </motion.div>

        <div className="flex gap-4 w-full">
          <motion.div
            className="flex gap-4 flex-col items-start w-full"
            variants={{
              open: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {["Home", "About", "Contact", "Agents"].map((item) => (
              <motion.div
                className="w-full"
                key={item}
                variants={{
                  open: { y: 0, opacity: 1 },
                  closed: { y: 20, opacity: 0 },
                }}
              >
                <Link href="/" className="block">
                  {item}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};