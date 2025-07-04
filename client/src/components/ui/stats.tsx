import { Award, Clock, DollarSign, Target } from "lucide-react";
import StatsCard from "./stats-card";
import { useEffect, useState } from "react";
import { getDoneTasks, refreshStats } from "@/services/api.service";
import { usePomodoro } from "@/context/pomodoro.context";
import { useFinancial } from "@/context/financical.context";
import formatCurrency from "@/utils/format-currency";

// Componente de Loading Skeleton para os cards
const StatsCardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="w-16 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-2">
      <div className="w-20 h-8 bg-gray-200 rounded"></div>
      <div className="w-24 h-4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const calculatePercentageIncrease = (
  currentValue: number,
  percentage: number
) => {
  const increase = Math.round(currentValue * (percentage / 100));
  return increase;
};

const Stats = () => {
  const [tasksDone, setTasksDone] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  const { pomodoro } = usePomodoro();
  const { earns } = useFinancial();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const tasksIncrease = calculatePercentageIncrease(tasksDone, 15);
  const streakIncrease = calculatePercentageIncrease(streak, 15);
  const pomodoroIncrease = calculatePercentageIncrease(
    (pomodoro * 25) / 60,
    15
  );

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setTasksDone((await getDoneTasks()) ?? 0);
      setStreak((await refreshStats()).currentStreak);

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }

    fetchData();
  }, [API_BASE_URL]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        icon={Target}
        title="Tarefas Concluídas"
        value={tasksDone}
        subtitle="Este mês"
        gradient="from-blue-500 to-cyan-500"
        trend={tasksIncrease}
      />
      <StatsCard
        icon={Award}
        title="Sequência Atual"
        value={`${streak} dias`}
        subtitle="Continue assim!"
        gradient="from-green-500 to-emerald-500"
        trend={streakIncrease}
      />
      <StatsCard
        icon={DollarSign}
        title="Ganhos"
        value={`${formatCurrency(earns)}`}
        subtitle="Valor total"
        gradient="from-orange-500 to-red-500"
        trend={8}
      />
      <StatsCard
        icon={Clock}
        title="Tempo de Foco"
        value={`${(pomodoro * 25) / 60}h`}
        subtitle="Hoje"
        gradient="from-purple-500 to-violet-500"
        trend={pomodoroIncrease}
      />
    </div>
  );
};

export default Stats;
