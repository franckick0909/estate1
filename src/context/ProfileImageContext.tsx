"use client";

import { createContext, useContext, useState } from "react";

interface ProfileImageContextType {
  profileImage: string | null;
  updateProfileImage: (newImage: string) => void;
}

const ProfileImageContext = createContext<ProfileImageContextType | undefined>(
  undefined
);

export function ProfileImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const updateProfileImage = (newImage: string) => {
    setProfileImage(newImage);
  };

  return (
    <ProfileImageContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </ProfileImageContext.Provider>
  );
}

export function useProfileImage() {
  const context = useContext(ProfileImageContext);
  if (context === undefined) {
    throw new Error(
      "useProfileImage must be used within a ProfileImageProvider"
    );
  }
  return context;
}
