import { Task } from "@/@types/Task";
import { createContext, useContext, useState, ReactNode } from "react";

type TasksContextType = {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks deve ser usado dentro de TasksProvider");
  }
  return context;
}
