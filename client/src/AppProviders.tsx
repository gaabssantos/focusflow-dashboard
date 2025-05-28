import { ReactNode } from "react";
import { RouteProvider } from "./context/route.context";
import { ThemeProvider } from "./context/theme.context";
import { TasksProvider } from "./context/tasks.context";
import { ProfileProvider } from "./context/profile.context";
import { PendingTasksProvider } from "./context/pending-tasks";
import { PomodoroProvider } from "./context/pomodoro.context";

interface AppProvidersProps {
  children: ReactNode;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <RouteProvider>
      <ThemeProvider>
        <TasksProvider>
          <ProfileProvider>
            <PendingTasksProvider>
              <PomodoroProvider>{children}</PomodoroProvider>
            </PendingTasksProvider>
          </ProfileProvider>
        </TasksProvider>
      </ThemeProvider>
    </RouteProvider>
  );
}

export default AppProviders;
