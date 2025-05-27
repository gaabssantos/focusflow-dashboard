import { useTasks } from "@/context/tasks.context";
import { useTheme } from "@/context/theme.context";
import { useState } from "react";

import {
  Plus,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { tasks } = useTasks();
  const { isDarkMode } = useTheme();

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getTasksForDate = (day: number | null) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return tasks.filter((task) => task.date === dateStr);
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (day: number | null) => {
    const today = new Date();
    return (
      day !== null &&
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      day === today.getDate()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendário</h1>
        <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Novo Evento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div
          className={`lg:col-span-2 ${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                } transition-colors`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                } transition-colors`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div
                key={day}
                className={`p-3 text-center text-sm font-medium ${
                  isDarkMode ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayTasks = getTasksForDate(day);
              const hasTask = dayTasks.length > 0;
              const todayClass = isToday(day);

              return (
                <div
                  key={index}
                  className={`min-h-[80px] p-2 border rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${
                    day
                      ? `${
                          isDarkMode
                            ? "border-slate-600 hover:border-slate-500 hover:bg-slate-700/50"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        } ${
                          todayClass
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400"
                            : ""
                        }`
                      : "border-transparent"
                  }`}
                >
                  {day && (
                    <>
                      <div
                        className={`text-sm font-medium mb-1 ${
                          todayClass ? "text-purple-400" : ""
                        }`}
                      >
                        {day}
                      </div>
                      {hasTask && (
                        <div className="space-y-1">
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task._id}
                              className={`text-xs p-1 rounded truncate ${
                                task.priority === "alta"
                                  ? "bg-red-100 text-red-600"
                                  : task.priority === "media"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div
                              className={`text-xs ${
                                isDarkMode ? "text-slate-400" : "text-slate-600"
                              }`}
                            >
                              +{dayTasks.length - 2} mais
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4">Próximos Eventos</h3>
          <div className="space-y-3">
            {tasks
              .filter((task) => !task.completed)
              .slice(0, 5)
              .map((task) => (
                <div
                  key={task._id}
                  className={`p-3 rounded-lg ${
                    isDarkMode ? "bg-slate-700/50" : "bg-slate-50"
                  } hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === "alta"
                          ? "bg-red-100 text-red-600"
                          : task.priority === "media"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p
                    className={`text-xs ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {new Date(task.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
