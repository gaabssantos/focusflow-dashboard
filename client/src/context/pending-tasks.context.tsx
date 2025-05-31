import { createContext, useContext, useState, ReactNode } from "react";

type PendingTasksContextType = {
  pendingTasks: { count: number };
  setPendingTasks: (pendingTasks: number) => void;
};

const PendingTasksContext = createContext<PendingTasksContextType | undefined>(
  undefined
);

export function PendingTasksProvider({ children }: { children: ReactNode }) {
  const [pendingTasks, setPendingTasksState] = useState<{ count: number }>({ count: 0 });

  const setPendingTasks = (count: number) => {
    setPendingTasksState({ count });
  };

  return (
    <PendingTasksContext.Provider value={{ pendingTasks, setPendingTasks }}>
      {children}
    </PendingTasksContext.Provider>
  );
}

export function usePendingTasks() {
  const context = useContext(PendingTasksContext);
  if (!context) {
    throw new Error(
      "usePendingTasks deve ser usado dentro de PendingTasksProvider"
    );
  }
  return context;
}
