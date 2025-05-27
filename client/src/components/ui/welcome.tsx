import { usePendingTasks } from "@/context/pending-tasks";
import { useProfile } from "@/context/profile.context";
import { useTheme } from "@/context/theme.context";
import { PlayCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Skeleton de carregamento
const WelcomeSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div
    className={`${
      isDarkMode
        ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50"
        : "bg-gradient-to-r from-purple-100 to-pink-100"
    } backdrop-blur-xl rounded-2xl p-8 border ${
      isDarkMode ? "border-purple-800" : "border-purple-200"
    }`}
  >
    <div className="mb-2">
      <div
        className={`h-10 rounded-lg ${
          isDarkMode ? "bg-slate-600" : "bg-gray-300"
        } w-3/4 animate-pulse`}
      />
    </div>
    <div className="mb-6 space-y-2">
      <div
        className={`h-5 rounded ${
          isDarkMode ? "bg-slate-600" : "bg-gray-300"
        } w-full animate-pulse`}
      />
      <div
        className={`h-5 rounded ${
          isDarkMode ? "bg-slate-600" : "bg-gray-300"
        } w-2/3 animate-pulse`}
      />
    </div>
    <div
      className={`h-12 rounded-xl ${
        isDarkMode ? "bg-slate-600" : "bg-gray-300"
      } w-48 animate-pulse`}
    />
  </div>
);

const Welcome = () => {
  const { isDarkMode } = useTheme();
  const { pendingTasks } = usePendingTasks();
  const { profile } = useProfile();

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Função para saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Buscar dados do perfil
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  if (isLoading) return <WelcomeSkeleton isDarkMode={isDarkMode} />;

  return (
    <div
      className={`${
        isDarkMode
          ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50"
          : "bg-gradient-to-r from-purple-100 to-pink-100"
      } backdrop-blur-xl rounded-2xl p-8 border ${
        isDarkMode ? "border-purple-800" : "border-purple-200"
      }`}
    >
      <h1 className="text-4xl font-bold mb-2">
        {getGreeting()}, {profile.user.name}! 👋
      </h1>
      <p
        className={`text-lg ${
          isDarkMode ? "text-slate-300" : "text-slate-700"
        } mb-6`}
      >
        {pendingTasks.count > 0
          ? `Você tem ${pendingTasks.count} tarefas pendentes hoje. Vamos
        conquistá-las!`
          : "Você não tem tarefas pendetes hoje. Aproveite o dia!"}
      </p>
      <button
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
        onClick={() => navigate("/sessao")}
      >
        <PlayCircle className="w-5 h-5 inline mr-2" />
        Iniciar Sessão de Foco
      </button>
    </div>
  );
};

export default Welcome;
