import { createContext, useContext, useState, ReactNode } from "react";

export type Profile = {
  user: {
    name: string | undefined;
    email: string | undefined;
  };
};

type ProfileContextType = {
  profile: Profile;
  setProfile: (profile: Profile) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>({
    user: {
      name: undefined,
      email: undefined,
    },
  });

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile deve ser usado dentro de ProfileProvider");
  }
  return context;
}
