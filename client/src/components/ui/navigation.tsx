import {
  Home,
  Calendar,
  Target,
  TrendingUp,
  Settings,
  Zap,
  ChevronRight,
  DollarSign,
  Bot,
} from "lucide-react";
import { useTheme } from "@/context/theme.context.js";
import { useRoute } from "@/context/route.context.js";

const Navigation = () => {
  const { isDarkMode } = useTheme();
  const { currentRoute, setCurrentRoute } = useRoute();

  const navItems = [
    {
      id: "dashboard",
      icon: Home,
      label: "Dashboard",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "tasks",
      icon: Target,
      label: "Tasks",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "financial",
      icon: DollarSign,
      label: "Financeiro",
      color: "from-green-500 to-lime-500",
    },
    {
      id: "calendar",
      icon: Calendar,
      label: "Calendar",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "ia",
      icon: Bot,
      label: "IA",
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: "analytics",
      icon: TrendingUp,
      label: "Analytics",
      color: "from-orange-500 to-red-500",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <nav
      className={`fixed left-0 top-0 h-full w-20 lg:w-64 ${
        isDarkMode ? "bg-slate-800/90" : "bg-white/90"
      } backdrop-blur-xl border-r ${
        isDarkMode ? "border-slate-700" : "border-slate-200"
      } z-40 transition-all duration-300`}
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="hidden lg:block text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            FocusFlow
          </h1>
        </div>

        <div className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentRoute(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${
                currentRoute === item.id
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                  : `hover:bg-slate-700/50${
                      isDarkMode ? "" : " hover:bg-slate-100"
                    } hover:transform hover:scale-105`
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="hidden lg:block font-medium">{item.label}</span>
              {currentRoute === item.id && (
                <ChevronRight className="w-4 h-4 ml-auto animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
