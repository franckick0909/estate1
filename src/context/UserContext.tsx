"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

type UserContextType = {
  userName: string | null;
  userImage: string | null;
  updateUserInfo: (name?: string, image?: string) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, update } = useSession();
  const [userName, setUserName] = useState<string | null>(
    session?.user?.name || null
  );
  const [userImage, setUserImage] = useState<string | null>(
    session?.user?.image || null
  );

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || null);
      setUserImage(session.user.image || null);
    }
  }, [session]);

  const updateUserInfo = async (name?: string, image?: string) => {
    if (name) setUserName(name);
    if (image) setUserImage(image);

    await update({
      ...session,
      user: {
        ...session?.user,
        ...(name && { name }),
        ...(image && { image }),
      },
    });
  };

  return (
    <UserContext.Provider value={{ userName, userImage, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
