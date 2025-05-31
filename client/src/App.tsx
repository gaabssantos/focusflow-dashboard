import { useTheme } from "./context/theme.context.js";
import Header from "./components/ui/header.js";
import { useRoute } from "./context/route.context.js";
import Navigation from "./components/ui/navigation.js";
import CalendarView from "./screens/calendar.screen.js";
import Welcome from "./components/ui/welcome.js";
import Stats from "./components/ui/stats.js";
import RecentTasks from "./components/ui/recent-tasks.js";
import TasksView from "./screens/task.screen.js";
import AnalyticsView from "./screens/analytics.screen.js";
import SettingsView from "./screens/settings.screen.js";
import FinancialView from "./screens/financial.screen.js";
import AIView from "./screens/ia.screen.js";
import { useTasks } from "./context/tasks.context.js";
import { useEffect } from "react";
import { Profile, useProfile } from "./context/profile.context.js";
import { usePendingTasks } from "./context/pending-tasks.context.js";
import {
  getPendingTasks,
  getProfile,
  getTasks,
} from "./services/api.service.js";

export default function App() {
  const { isDarkMode } = useTheme();
  const { currentRoute } = useRoute();
  const { tasks, setTasks } = useTasks();
  const { setProfile } = useProfile();
  const { setPendingTasks } = usePendingTasks();

  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-800";

  useEffect(() => {
    async function load() {
      setTasks((await getTasks()) ?? []);
      setProfile((await getProfile()) as Profile);
      setPendingTasks((await getPendingTasks()) ?? 0);
      setTimeout(() => {}, 800);
    }
    load();
  }, []);

  const DashboardView = () => (
    <div className="space-y-8">
      <Welcome />
      <Stats />
      <RecentTasks />
    </div>
  );

  const renderCurrentView = () => {
    switch (currentRoute) {
      case "dashboard":
        return <DashboardView />;
      case "tasks":
        return <TasksView />;
      case "calendar":
        return <CalendarView />;
      case "ia":
        return (
          <AIView
            tasks={tasks}
            stats={{
              tasksCompleted: 1,
              focusTime: 1,
              streak: 1,
              totalEarnings: 1,
            }}
          />
        );
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      case "financial":
        return <FinancialView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses} transition-all duration-500`}>
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10 z-[-1]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Navigation />
      <Header />

      <main className="ml-20 lg:ml-64 pt-24 p-8">
        <div className="max-w-7xl mx-auto">{renderCurrentView()}</div>
      </main>
    </div>
  );
}
