import { Task } from "@/@types/Task";
import { useTheme } from "@/context/theme.context";
import { Check, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

type TaskCardProps = {
  task: Task;
  onToggle: (id: string | number) => void;
  onDelete: (id: string | number) => void;
};

const TaskCard = ({ task, onToggle, onDelete }: TaskCardProps) => {
  const { isDarkMode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case "alta":
        return isDarkMode 
          ? "bg-red-900/30 text-red-300 border-red-500/30" 
          : "bg-red-50 text-red-600 border-red-200";
      case "media":
        return isDarkMode 
          ? "bg-yellow-900/30 text-yellow-300 border-yellow-500/30" 
          : "bg-yellow-50 text-yellow-600 border-yellow-200";
      default:
        return isDarkMode 
          ? "bg-green-900/30 text-green-300 border-green-500/30" 
          : "bg-green-50 text-green-600 border-green-200";
    }
  };

  return (
    <div
      className={`${
        isDarkMode 
          ? "bg-gradient-to-br from-slate-800/70 to-slate-900/50" 
          : "bg-gradient-to-br from-white/90 to-slate-50/80"
      } backdrop-blur-xl rounded-2xl p-5 border relative ${
        isDarkMode ? "border-slate-700/50" : "border-slate-200/50"
      } hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group shadow-lg`}
    >
      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"} p-6 rounded-xl shadow-lg w-[90%] max-w-sm`}>
            <h3 className="text-lg font-semibold mb-4">Você deseja excluir?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md text-sm bg-slate-200 hover:bg-slate-300 text-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  onDelete(task._id);
                }}
                className="px-4 py-2 rounded-md text-sm bg-red-500 hover:bg-red-600 text-white"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header com checkbox e título */}
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onToggle(task._id)}
          className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            task.status === "done"
              ? "bg-green-500 border-green-500 shadow-green-500/30 shadow-md"
              : `${
                  isDarkMode
                    ? "border-slate-600 hover:border-green-500 hover:shadow-green-500/20 hover:shadow-md"
                    : "border-slate-300 hover:border-green-500 hover:shadow-green-500/20 hover:shadow-md"
                }`
          }`}
        >
          {task.status === "done" && <Check className="w-3 h-3 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4
              className={`font-semibold text-lg mb-2 ${
                task.status === "done" 
                  ? "line-through opacity-60" 
                  : isDarkMode ? "text-white" : "text-slate-800"
              } transition-all duration-300`}
            >
              {task.title}
            </h4>
            <button
              onClick={() => setShowModal(true)}
              className="text-red-500 hover:text-red-600 transition-colors"
              title="Excluir tarefa"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* Descrição elegante */}
          {task.description && (
            <div className="mb-4">
              <div
                className={`${
                  isDarkMode 
                    ? "bg-slate-700/30 border-slate-600/30" 
                    : "bg-slate-50/80 border-slate-200/50"
                } rounded-xl p-4 border backdrop-blur-sm transition-all duration-300`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <FileText 
                    className={`w-4 h-4 ${
                      isDarkMode ? "text-slate-400" : "text-slate-500"
                    }`} 
                  />
                  <span 
                    className={`text-sm font-medium ${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    Descrição
                  </span>
                </div>
                <p 
                  className={`text-sm leading-relaxed ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  } ${task.status === "done" ? "opacity-60" : ""}`}
                >
                  {isExpanded || task.description.length <= 100 
                    ? task.description 
                    : `${task.description.substring(0, 100)}...`
                  }
                </p>
                {task.description.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`mt-2 text-xs font-medium transition-colors duration-200 ${
                      isDarkMode 
                        ? "text-blue-400 hover:text-blue-300" 
                        : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    {isExpanded ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Tags de prioridade e categoria */}
          <div className="flex items-center flex-wrap gap-2">
            <span
              className={`px-3 py-1.5 text-xs font-medium rounded-full border ${getPriorityColors(task.priority)} transition-all duration-200`}
            >
              {task.priority}
            </span>
            <span
              className={`px-3 py-1.5 text-xs font-medium rounded-full border ${
                isDarkMode
                  ? "bg-slate-700/50 text-slate-300 border-slate-600/30"
                  : "bg-slate-100/80 text-slate-600 border-slate-200/50"
              } transition-all duration-200`}
            >
              {task.category}
            </span>
          </div>
        </div>
      </div>

      {/* Data */}
      <div className="mt-4 pt-3 border-t border-slate-200/20">
        <span 
          className={`text-xs ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {task.date}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
