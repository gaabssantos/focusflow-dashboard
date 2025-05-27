import { ReactNode } from "react";
import { RouteProvider } from "./context/route.context";
import { ThemeProvider } from "./context/theme.context";
import { TasksProvider } from "./context/tasks.context";
import { ProfileProvider } from "./context/profile.context";
import { PendingTasksProvider } from "./context/pending-tasks";

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
              {children}
            </PendingTasksProvider>
          </ProfileProvider>
        </TasksProvider>
      </ThemeProvider>
    </RouteProvider>
  );
}

export default AppProviders;