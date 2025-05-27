import { createContext, useContext, useState, ReactNode } from "react";

type RouteContextType = {
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
};

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState("dashboard");

  return (
    <RouteContext.Provider value={{ currentRoute, setCurrentRoute }}>
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error("useRoute deve ser usado dentro de RouteProvider");
  }
  return context;
}
