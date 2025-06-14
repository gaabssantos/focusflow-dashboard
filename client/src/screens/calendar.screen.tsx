/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTheme } from "@/context/theme.context";
import { useState, useEffect } from "react";
import {
  Plus,
  ChevronRight,
  ChevronLeft,
  X,
  Calendar,
  Clock,
  FileText,
  Repeat,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { createRoutine, deleteRoutine, getAllRoutines } from "@/services/api.service";

// Skeleton component for calendar grid
const CalendarSkeleton = () => {
  return (
    <div className="grid grid-cols-7 gap-1">
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="p-3 text-center text-sm font-medium text-transparent bg-gray-200 dark:bg-slate-700 animate-pulse"
          >
            Placeholder
          </div>
        ))}
      {Array(35)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className="min-h-[100px] p-2 border rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse"
          >
            <div className="w-8 h-4 mb-1 bg-gray-300 dark:bg-slate-600 rounded animate-pulse"></div>
            <div className="space-y-1">
              <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-300 dark:bg-slate-600 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
    </div>
  );
};

// Skeleton component for weekly routines
const WeeklyRoutinesSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array(7)
        .fill(0)
        .map((_, index) => (
          <div key={index}>
            <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
            <div className="space-y-2 ml-3">
              {Array(2)
                .fill(0)
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-slate-700 animate-pulse"
                  >
                    <div className="h-4 w-3/4 bg-gray-300 dark:bg-slate-600 rounded animate-pulse mb-1"></div>
                    <div className="h-3 w-1/2 bg-gray-300 dark:bg-slate-600 rounded animate-pulse"></div>
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isDayRoutinesModalOpen, setIsDayRoutinesModalOpen] = useState(false);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(
    null
  );
  const [newRoutine, setNewRoutine] = useState({
    title: "",
    description: "",
    dayOfWeek: 0,
    time: "",
    priority: "media",
    category: "estudo",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const { isDarkMode } = useTheme();

  interface Task {
    _id: string;
    title: string;
    description: string;
    weekDay: number;
    time: string;
    category: string;
  }

  useEffect(() => {
    const fetchRoutines = async () => {
      setIsLoading(true); // Set loading to true before fetching
      try {
        const routines = (await getAllRoutines()) ?? [];
        setTasks(routines as unknown as Task[]);
      } catch (error) {
        toast.error("Erro ao carregar rotinas. Tente novamente.");
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    fetchRoutines();
  }, []);

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
  const dayNamesLong = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ];

  const routineCategories = [
    { value: "estudo", label: "Estudo", color: "blue" },
    { value: "exercicio", label: "Exercício", color: "green" },
    { value: "trabalho", label: "Trabalho", color: "purple" },
    { value: "lazer", label: "Lazer", color: "pink" },
    { value: "casa", label: "Casa", color: "orange" },
    { value: "saude", label: "Saúde", color: "red" },
    { value: "outros", label: "Outros", color: "gray" },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const getRoutinesForDate = (day: number | null | undefined) => {
    if (!day) return [];
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dayOfWeek = date.getDay();
    return tasks.filter((task) => task.weekDay === dayOfWeek);
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setNewRoutine({
      title: "",
      description: "",
      dayOfWeek: 0,
      time: "",
      priority: "media",
      category: "estudo",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDayRoutinesModal = (day: number) => {
    setSelectedDay(day);
    setIsDayRoutinesModalOpen(true);
  };

  const handleCloseDayRoutinesModal = () => {
    setIsDayRoutinesModalOpen(false);
    setSelectedDay(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setNewRoutine((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(newRoutine);

    try {
      await createRoutine({
        title: newRoutine.title,
        description: newRoutine.description,
        weekDay: Number(newRoutine.dayOfWeek),
        time: newRoutine.time,
        category: newRoutine.category,
      });

      toast.success("Rotina criada com sucesso!");
      handleCloseModal();
      const routines = (await getAllRoutines()) ?? [];
      setTasks(routines as unknown as Task[]);
    } catch (error) {
      toast.error("Erro ao criar rotina. Tente novamente.");
    }
  };

  const handleRoutine = (routineId: string) => {
    setSelectedRoutineId(selectedRoutineId === routineId ? null : routineId);
  };

  const handleDeleteRoutine = async (routineId: string) => {
    await deleteRoutine(routineId);

    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== routineId));
    setSelectedRoutineId(null);
  };

  const getCategoryColor = (category: string) => {
    const categoryObj = routineCategories.find((cat) => cat.value === category);
    return categoryObj ? categoryObj.color : "gray";
  };

  const getCategoryColorClasses = (category: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-600 border-blue-200",
      green: "bg-green-100 text-green-600 border-green-200",
      purple: "bg-purple-100 text-purple-600 border-purple-200",
      pink: "bg-pink-100 text-pink-600 border-pink-200",
      orange: "bg-orange-100 text-orange-600 border-orange-200",
      red: "bg-red-100 text-red-600 border-red-200",
      gray: "bg-gray-100 text-gray-600 border-gray-200",
    };
    const color = getCategoryColor(category) as keyof typeof colorMap;
    return colorMap[color] || colorMap.gray;
  };

  const days = getDaysInMonth(currentDate);
  const routinesByDay = dayNamesLong.map((dayName, index) => ({
    day: dayName,
    dayIndex: index,
    routines: tasks.filter((task) => task.weekDay === index),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rotinas Semanais</h1>
        <button
          onClick={handleOpenModal}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Rotina</span>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {isLoading ? (
                <div className="h-8 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
              ) : (
                `${
                  monthNames[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`
              )}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                } transition-colors`}
                disabled={isLoading}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className={`p-2 rounded-lg ${
                  isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                } transition-colors`}
                disabled={isLoading}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <CalendarSkeleton />
          ) : (
            <>
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
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dayRoutines = getRoutinesForDate(day);
                  const hasRoutine = dayRoutines.length > 0;
                  const todayClass = isToday(day);

                  return (
                    <div
                      key={index}
                      onClick={() => day && handleOpenDayRoutinesModal(day)}
                      className={`min-h-[100px] p-2 border rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer ${
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
                          {hasRoutine && (
                            <div className="space-y-1">
                              {dayRoutines.slice(0, 3).map((routine) => (
                                <div
                                  key={routine._id}
                                  className={`text-xs p-1 rounded truncate border ${getCategoryColorClasses(
                                    routine.category
                                  )}`}
                                >
                                  <div className="flex items-center space-x-1">
                                    <Repeat className="w-2 h-2" />
                                    <span>{routine.title}</span>
                                  </div>
                                  {routine.time && (
                                    <div className="text-xs opacity-75">
                                      {routine.time}
                                    </div>
                                  )}
                                </div>
                              ))}
                              {dayRoutines.length > 3 && (
                                <div
                                  className={`text-xs ${
                                    isDarkMode
                                      ? "text-slate-400"
                                      : "text-slate-600"
                                  }`}
                                >
                                  +{dayRoutines.length - 3} mais
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
            </>
          )}
        </div>

        {/* Weekly Routines */}
        <div
          className={`${
            isDarkMode ? "bg-slate-800/50" : "bg-white/80"
          } backdrop-blur-xl rounded-2xl p-6 border ${
            isDarkMode ? "border-slate-700" : "border-slate-200"
          }`}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <Repeat className="w-5 h-5" />
            <span>Rotinas da Semana</span>
          </h3>
          {isLoading ? (
            <WeeklyRoutinesSkeleton />
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {routinesByDay.map((dayData) => (
                <div key={dayData.dayIndex}>
                  <h4
                    className={`font-medium text-sm mb-2 ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    }`}
                  >
                    {dayData.day}
                  </h4>
                  {dayData.routines.length > 0 ? (
                    <div className="space-y-2 ml-3">
                      {dayData.routines.map((routine) => (
                        <div
                          key={routine._id}
                          onMouseEnter={() => handleRoutine(routine._id)}
                          onMouseLeave={() => handleRoutine(routine._id)}
                          className={`p-2 rounded-lg border ${getCategoryColorClasses(
                            routine.category
                          )} ${
                            isDarkMode ? "bg-slate-700/30" : "bg-white/50"
                          } hover:scale-[1.02] transition-transform cursor-pointer relative`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-xs">
                              {routine.title}
                            </h5>
                            <div className="flex items-center space-x-1">
                              {routine.time && (
                                <span className="text-xs opacity-75">
                                  {routine.time}
                                </span>
                              )}
                            </div>
                          </div>
                          {routine.description && (
                            <p className="text-xs opacity-75 truncate">
                              {routine.description}
                            </p>
                          )}
                          <div className="flex items-center mt-1">
                            <span className="text-xs opacity-60">
                              {
                                routineCategories.find(
                                  (cat) => cat.value === routine.category
                                )?.label
                              }
                            </span>
                          </div>
                          {selectedRoutineId === routine._id && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRoutine(routine._id);
                              }}
                              className={`absolute top-2 right-2 p-1 rounded-full ${
                                isDarkMode
                                  ? "bg-red-600/80 hover:bg-red-700"
                                  : "bg-red-500 hover:bg-red-600"
                              } text-white transition-colors`}
                              title="Deletar rotina"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p
                      className={`text-xs ${
                        isDarkMode ? "text-slate-500" : "text-slate-400"
                      } ml-3`}
                    >
                      Nenhuma rotina
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Creating New Routine */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${
              isDarkMode ? "bg-slate-800" : "bg-white"
            } rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center space-x-2">
                <Repeat className="w-6 h-6 text-blue-500" />
                <span>Nova Rotina</span>
              </h2>
              <button
                onClick={handleCloseModal}
                className={`p-2 rounded-lg ${
                  isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                } transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Título da Rotina *</span>
                </label>
                <input
                  type="text"
                  value={newRoutine.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  placeholder="Ex: Estudar matemática, Ir à academia, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Descrição</span>
                </label>
                <textarea
                  value={newRoutine.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none`}
                  placeholder="Detalhes sobre a rotina (opcional)"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Dia da Semana *</span>
                  </label>
                  <select
                    value={newRoutine.dayOfWeek}
                    onChange={(e) =>
                      handleInputChange("dayOfWeek", e.target.value)
                    }
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                    required
                  >
                    {dayNamesLong.map((day, index) => (
                      <option key={index} value={index}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Horário</span>
                  </label>
                  <input
                    type="time"
                    value={newRoutine.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-slate-300 text-slate-900"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Categoria</span>
                </label>
                <select
                  value={newRoutine.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                >
                  {routineCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium ${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-slate-200 hover:bg-slate-300 text-slate-900"
                  } transition-colors`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Criar Rotina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Viewing All Routines for a Day */}
      {isDayRoutinesModalOpen && selectedDay && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className={`${
              isDarkMode ? "bg-slate-800" : "bg-white"
            } rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-blue-500" />
                <span>
                  Rotinas de{" "}
                  {
                    dayNamesLong[
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        selectedDay
                      ).getDay()
                    ]
                  }{" "}
                  ({selectedDay}/{currentDate.getMonth() + 1})
                </span>
              </h2>
              <button
                onClick={handleCloseDayRoutinesModal}
                className={`p-2 rounded-lg ${
                  isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                } transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {getRoutinesForDate(selectedDay).length > 0 ? (
                getRoutinesForDate(selectedDay).map((routine) => (
                  <div
                    key={routine._id}
                    className={`p-3 rounded-lg border ${getCategoryColorClasses(
                      routine.category
                    )} ${
                      isDarkMode ? "bg-slate-700/30" : "bg-white/50"
                    } hover:scale-[1.02] transition-transform`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm">{routine.title}</h5>
                      <div className="flex items-center space-x-2">
                        {routine.time && (
                          <span className="text-xs opacity-75">
                            {routine.time}
                          </span>
                        )}
                      </div>
                    </div>
                    {routine.description && (
                      <p className="text-xs opacity-75">
                        {routine.description}
                      </p>
                    )}
                    <div className="flex items-center mt-1">
                      <span className="text-xs opacity-60">
                        {
                          routineCategories.find(
                            (cat) => cat.value === routine.category
                          )?.label
                        }
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  Nenhuma rotina para este dia.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
