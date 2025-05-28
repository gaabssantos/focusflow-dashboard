import { createContext, useContext, useState, ReactNode } from "react";

type PomodoroContextType = {
  pomodoro: number;
  setPomodoro: (pomodoro: number) => void;
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [pomodoro, setPomodoro] = useState<number>(0);

  return (
    <PomodoroContext.Provider value={{ pomodoro, setPomodoro }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro deve ser usado dentro de PomodoroProvider");
  }
  return context;
}
