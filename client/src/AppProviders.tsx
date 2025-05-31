import { ReactNode } from "react";
import { RouteProvider } from "./context/route.context";
import { ThemeProvider } from "./context/theme.context";
import { TasksProvider } from "./context/tasks.context";
import { ProfileProvider } from "./context/profile.context";
import { PendingTasksProvider } from "./context/pending-tasks.context";
import { PomodoroProvider } from "./context/pomodoro.context";
import { FinancialProvider } from "./context/financical.context";

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
              <FinancialProvider>
              <PomodoroProvider>{children}</PomodoroProvider>
              </FinancialProvider>
            </PendingTasksProvider>
          </ProfileProvider>
        </TasksProvider>
      </ThemeProvider>
    </RouteProvider>
  );
}

export default AppProviders;
