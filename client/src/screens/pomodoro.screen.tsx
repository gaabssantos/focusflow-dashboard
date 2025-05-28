import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Settings,
  Coffee,
  Target,
  Volume2,
  VolumeX,
  ChevronLeft,
  Zap,
  Award,
} from "lucide-react";

import React from "react";
import { useTheme } from "@/context/theme.context";
import { Task } from "@/@types/Task";
import {
  getPomodoroStats,
  getTasks,
  incrementPomodoro,
} from "@/services/api.service";
import { useNavigate } from "react-router-dom";
const SkeletonBox = ({
  className = "",
  children = null,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <div className={`animate-pulse ${className}`}>
    {children || <div className="bg-gray-300 dark:bg-gray-700 rounded"></div>}
  </div>
);

const SkeletonText = ({ width = "w-full", height = "h-4" }) => (
  <SkeletonBox
    className={`${width} ${height} bg-gray-300 dark:bg-gray-700 rounded`}
  />
);

const SkeletonButton = ({ width = "w-24", height = "h-10" }) => (
  <SkeletonBox
    className={`${width} ${height} bg-gray-300 dark:bg-gray-700 rounded-xl`}
  />
);

const SkeletonCircle = ({ size = "w-8 h-8" }) => (
  <SkeletonBox
    className={`${size} bg-gray-300 dark:bg-gray-700 rounded-full`}
  />
);

const PomodoroSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-800";

  return (
    <div
      className={`min-h-screen ${themeClasses} transition-all duration-500 relative overflow-hidden`}
    >
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header Skeleton */}
      <header
        className={`${
          isDarkMode ? "bg-slate-800/90" : "bg-white/90"
        } backdrop-blur-xl border-b ${
          isDarkMode ? "border-slate-700" : "border-slate-200"
        } p-4 relative z-10`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SkeletonButton width="w-10" height="h-10" />
            <div className="flex items-center space-x-3">
              <SkeletonBox className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl" />
              <div className="space-y-2">
                <SkeletonText width="w-32" height="h-5" />
                <SkeletonText width="w-48" height="h-3" />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <SkeletonButton width="w-12" height="h-12" />
            <SkeletonButton width="w-12" height="h-12" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Section Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Type Selector Skeleton */}
            <div className="flex justify-center space-x-4">
              {[1, 2, 3].map((i) => (
                <SkeletonButton key={i} width="w-32" height="h-12" />
              ))}
            </div>

            {/* Main Timer Skeleton */}
            <div
              className={`${
                isDarkMode ? "bg-slate-800/50" : "bg-white/80"
              } backdrop-blur-xl rounded-3xl p-12 border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              } text-center relative overflow-hidden`}
            >
              {/* Timer Circle Skeleton */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                <SkeletonBox className="w-full h-full rounded-full border-4 border-gray-300 dark:border-gray-700">
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <SkeletonText width="w-40" height="h-16" />
                    <SkeletonText width="w-24" height="h-6" />
                    <SkeletonText width="w-32" height="h-8" />
                  </div>
                </SkeletonBox>
              </div>

              {/* Control Buttons Skeleton */}
              <div className="flex justify-center space-x-4">
                <SkeletonButton width="w-32" height="h-16" />
                <SkeletonButton width="w-16" height="h-16" />
                <SkeletonButton width="w-16" height="h-16" />
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            {/* Stats Skeleton */}
            <div
              className={`${
                isDarkMode ? "bg-slate-800/50" : "bg-white/80"
              } backdrop-blur-xl rounded-2xl p-6 border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div className="flex items-center mb-4">
                <SkeletonCircle size="w-6 h-6" />
                <SkeletonText width="w-24" height="h-6" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <SkeletonText width="w-20" height="h-4" />
                    <SkeletonText width="w-12" height="h-6" />
                  </div>
                ))}
              </div>
            </div>

            {/* Task Selection Skeleton */}
            <div
              className={`${
                isDarkMode ? "bg-slate-800/50" : "bg-white/80"
              } backdrop-blur-xl rounded-2xl p-6 border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div className="flex items-center mb-4">
                <SkeletonCircle size="w-6 h-6" />
                <SkeletonText width="w-28" height="h-6" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl ${
                      isDarkMode ? "bg-slate-700/30" : "bg-slate-100/50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <SkeletonCircle size="w-2 h-2" />
                      <SkeletonText width="w-full" height="h-4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const PomodoroView = () => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [selectedTask, setSelectedTask] = useState<string | undefined>();
  const [tasks, setTasks] = useState<{ title: string }[]>([]);
  const navigation = useNavigate();

  // Settings
  const [focusTime] = useState(25);
  const [shortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Simulate loading
  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setCompletedSessions((await getPomodoroStats()).count);
      setTasks((await getTasks()) as Task[]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  const themeClasses = isDarkMode
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-800";

  const sessionConfigs = {
    focus: {
      duration: focusTime * 60,
      label: "Foco",
      color: "from-purple-500 to-pink-500",
      icon: Target,
    },
    "short-break": {
      duration: shortBreakTime * 60,
      label: "Pausa Curta",
      color: "from-green-500 to-emerald-500",
      icon: Coffee,
    },
    "long-break": {
      duration: longBreakTime * 60,
      label: "Pausa Longa",
      color: "from-blue-500 to-cyan-500",
      icon: Coffee,
    },
  };

  const progress =
    ((sessionConfigs[sessionType].duration - timeLeft) /
      sessionConfigs[sessionType].duration) *
    100;

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    setIsPaused(false);

    if (sessionType === "focus") {
      setCompletedSessions((prev) => prev + 1);
      const nextSessionType =
        (completedSessions + 1) % 4 === 0 ? "long-break" : "short-break";
      setSessionType(nextSessionType);
      setTimeLeft(sessionConfigs[nextSessionType].duration);
    } else {
      setSessionType("focus");
      setTimeLeft(sessionConfigs.focus.duration);
    }

    const newCount = await incrementPomodoro();
    setCompletedSessions(newCount.count);

    if (isSoundEnabled) {
      audioRef.current?.play();
    }
  };

  const startTimer = async () => {
    setIsActive(true);
    setIsPaused(false);

    await incrementPomodoro();
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const stopTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(sessionConfigs[sessionType].duration);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(sessionConfigs[sessionType].duration);
  };

  type SessionType = "focus" | "short-break" | "long-break";

  const switchSession = (type: SessionType) => {
    setSessionType(type);
    setTimeLeft(sessionConfigs[type].duration);
    setIsActive(false);
    setIsPaused(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Show skeleton while loading
  if (isLoading) {
    return <PomodoroSkeleton isDarkMode={isDarkMode} />;
  }

  return (
    <div
      className={`min-h-screen ${themeClasses} transition-all duration-500 relative overflow-hidden`}
    >
      {/* Animated background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header
        className={`${
          isDarkMode ? "bg-slate-800/90" : "bg-white/90"
        } backdrop-blur-xl border-b ${
          isDarkMode ? "border-slate-700" : "border-slate-200"
        } p-4 relative z-10`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 rounded-xl ${
                isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
              } transition-all duration-300`}
              onClick={() => navigation("/")}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Sessão de Foco</h1>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  Mantenha o foco e seja produtivo
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className={`p-3 rounded-xl ${
                isDarkMode
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-100 hover:bg-slate-200"
              } transition-all duration-300`}
            >
              {isSoundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl ${
                isDarkMode
                  ? "bg-slate-700 hover:bg-slate-600"
                  : "bg-slate-100 hover:bg-slate-200"
              } transition-all duration-300`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Type Selector */}
            <div className="flex justify-center space-x-4">
              {Object.entries(sessionConfigs).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => switchSession(type as SessionType)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      sessionType === type
                        ? `bg-gradient-to-r ${config.color} text-white shadow-lg transform scale-105`
                        : `${
                            isDarkMode
                              ? "bg-slate-800/50 hover:bg-slate-700/50"
                              : "bg-white/50 hover:bg-white/80"
                          } hover:scale-105`
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Main Timer */}
            <div
              className={`${
                isDarkMode ? "bg-slate-800/50" : "bg-white/80"
              } backdrop-blur-xl rounded-3xl p-12 border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              } text-center relative overflow-hidden`}
            >
              {/* Progress Ring */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 45 * (1 - progress / 100)
                    }`}
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Timer Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold mb-2 font-mono">
                    {formatTime(timeLeft)}
                  </div>
                  <div
                    className={`text-lg font-medium ${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {sessionConfigs[sessionType].label}
                  </div>
                  {selectedTask && sessionType === "focus" && (
                    <div
                      className={`text-sm mt-2 px-4 py-2 rounded-full ${
                        isDarkMode ? "bg-slate-700" : "bg-slate-100"
                      }`}
                    >
                      📝 {selectedTask}
                    </div>
                  )}
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center space-x-4">
                {!isActive ? (
                  <button
                    onClick={startTimer}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-3"
                  >
                    <Play className="w-6 h-6" />
                    <span>Iniciar</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className={`${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-slate-200 hover:bg-slate-300"
                    } px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 flex items-center space-x-3`}
                  >
                    {isPaused ? (
                      <Play className="w-6 h-6" />
                    ) : (
                      <Pause className="w-6 h-6" />
                    )}
                    <span>{isPaused ? "Continuar" : "Pausar"}</span>
                  </button>
                )}

                <button
                  onClick={stopTimer}
                  className={`${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-slate-200 hover:bg-slate-300"
                  } px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300`}
                >
                  <Square className="w-6 h-6" />
                </button>

                <button
                  onClick={resetTimer}
                  className={`${
                    isDarkMode
                      ? "bg-slate-700 hover:bg-slate-600"
                      : "bg-slate-200 hover:bg-slate-300"
                  } px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300`}
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div
              className={`${
                isDarkMode ? "bg-slate-800/50" : "bg-white/80"
              } backdrop-blur-xl rounded-2xl p-6 border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-purple-500" />
                Estatísticas
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span
                    className={`${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Sessões Hoje
                  </span>
                  <span className="text-2xl font-bold text-purple-500">
                    {completedSessions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`${
                      isDarkMode ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    Tempo Total
                  </span>
                  <span className="text-xl font-semibold">
                    {Math.floor((completedSessions * 25) / 60)}h{" "}
                    {(completedSessions * 25) % 60}m
                  </span>
                </div>
              </div>
            </div>

            {/* Task Selection */}
            <div
              className={`${
                isDarkMode ? "bg-slate-800/50" : "bg-white/80"
              } backdrop-blur-xl rounded-2xl p-6 border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-blue-500" />
                Tarefa Atual
              </h3>
              <div className="space-y-2">
                {tasks.map((task, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTask(task.title)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                      selectedTask === task.title
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                        : `${
                            isDarkMode
                              ? "hover:bg-slate-700/50"
                              : "hover:bg-slate-100"
                          }`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedTask === task.title
                            ? "bg-purple-500"
                            : "bg-slate-400"
                        }`}
                      ></div>
                      <span className="text-sm">{task.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <audio
          ref={audioRef}
          src="/audio/mixkit-happy-bells-notification-937.wav"
        />

        {showSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
              className={`${
                isDarkMode ? "bg-slate-800" : "bg-white"
              } rounded-2xl p-8 max-w-md w-full border ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Configurações</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`p-2 rounded-xl ${
                    isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Pausa Longa (minutos)
                  </label>
                  <input
                    type="number"
                    value={longBreakTime}
                    onChange={(e) => setLongBreakTime(parseInt(e.target.value))}
                    className={`w-full p-3 rounded-xl border ${
                      isDarkMode
                        ? "bg-slate-700 border-slate-600 text-white"
                        : "bg-white border-slate-300"
                    } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    min="1"
                    max="60"
                  />
                </div>

                <button
                  onClick={() => setShowSettings(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                >
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PomodoroView;
