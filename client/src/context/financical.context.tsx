import { createContext, useContext, useState, ReactNode } from "react";

type FinancialContextType = {
  earns: number;
  setEarns: (earns: number) => void;
};

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: ReactNode }) {
  const [earns, setEarns] = useState(0);

  return (
    <FinancialContext.Provider value={{ earns, setEarns }}>
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancial deve ser usado dentro de FinancialProvider");
  }
  return context;
}
