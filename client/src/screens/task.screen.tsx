import { FormData } from "@/@types/FormData";
import { Task, TaskStatus } from "@/@types/Task";
import TaskCard from "@/components/ui/task";
import { usePendingTasks } from "@/context/pending-tasks";
import { useTasks } from "@/context/tasks.context";
import { useTheme } from "@/context/theme.context";
import {
  createTask,
  deleteTasks,
  getPendingTasks,
  updateTask,
} from "@/services/api.service";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const TasksView = () => {
  const { isDarkMode } = useTheme();
  const { tasks, setTasks } = useTasks();
  const { setPendingTasks } = usePendingTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      description: null,
      priority: "baixa",
      category: "trabalho",
    },
  });

  // Função para normalizar a descrição (string vazia vira null)
  const normalizeDescription = (
    value: string | null | undefined
  ): string | null => {
    if (!value || value.trim() === "") {
      return null;
    }
    return value.trim();
  };

  const onSubmit = async (data: FormData) => {
    try {
      const normalizedData = {
        ...data,
        description: normalizeDescription(data.description),
      };

      const newTask = (await createTask(normalizedData)) as Task;

      setPendingTasks((await getPendingTasks()) ?? 0);
      setTasks([...tasks, newTask]);
      reset();
      setIsModalOpen(false);
      toast.success("Tarefa criada com sucesso!");
    } catch (error) {
      toast.error(
        "Erro ao criar tarefa. Tente novamente: " + (error as Error).message
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
    (e.currentTarget as HTMLElement).style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = "1";
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Só remove o dragOverColumn se realmente saiu da área de drop
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask) return;

    // Verificar se realmente houve mudança
    if (draggedTask.status === targetStatus) {
      return;
    }

    try {
      // Atualizar no backend
      await updateTask(targetStatus, draggedTask._id);

      setPendingTasks((await getPendingTasks()) ?? 0);

      // Atualizar no estado local
      setTasks(
        tasks.map((task) =>
          String(task._id) === String(draggedTask._id)
            ? {
                ...task,
                status: targetStatus,
              }
            : task
        )
      );

      toast.success("Tarefa movida com sucesso!");
    } catch (error) {
      toast.error("Erro ao mover tarefa: " + error);
    }

    setDraggedTask(null);
  };

  const handleDeleteTask = async (taskId: string | number) => await deleteTasks(taskId);

  // Função para filtrar tarefas por status - simplificada
  const getTasksByStatus = (status: TaskStatus) => {
    return tasks
      .map((task) => ({
        ...task,
        priority:
          task.priority === "baixa" ||
          task.priority === "media" ||
          task.priority === "alta"
            ? task.priority
            : "baixa",
      }))
      .filter((task) => task.status === status);
  };

  const columns = [
    { key: "todo" as TaskStatus, title: "Todo", color: "bg-gray-400" },
    {
      key: "progress" as TaskStatus,
      title: "Em Progresso",
      color: "bg-yellow-400",
    },
    { key: "done" as TaskStatus, title: "Concluído", color: "bg-green-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.key}
            className={`${
              isDarkMode ? "bg-slate-800/50" : "bg-white/80"
            } backdrop-blur-xl rounded-2xl p-6 border ${
              isDarkMode ? "border-slate-700" : "border-slate-200"
            } transition-all duration-200 ${
              dragOverColumn === column.key
                ? `ring-2 ring-blue-400 ${
                    isDarkMode ? "ring-opacity-60" : "ring-opacity-40"
                  } bg-opacity-80`
                : ""
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.key)}
          >
            <h3 className="font-semibold mb-4 flex items-center">
              <div
                className={`w-3 h-3 rounded-full mr-2 ${column.color}`}
              ></div>
              {column.title}
              <span
                className={`ml-2 text-sm px-2 py-1 rounded-full ${
                  isDarkMode
                    ? "bg-slate-700 text-slate-300"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {getTasksByStatus(column.key).length}
              </span>
            </h3>

            <div
              className={`space-y-3 min-h-[200px] transition-all duration-200 ${
                dragOverColumn === column.key
                  ? "bg-blue-50/10 rounded-lg p-2"
                  : ""
              }`}
            >
              {getTasksByStatus(column.key).map((task) => {
                // Garantir que a tarefa tenha os tipos corretos
                const safeTask = {
                  ...task,
                  priority:
                    task.priority === "baixa" ||
                    task.priority === "media" ||
                    task.priority === "alta"
                      ? task.priority
                      : "baixa",
                } as const;

                return (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    className="cursor-move"
                  >
                    <TaskCard
                      task={safeTask}
                      onToggle={(id) => {
                        // Atualizar para usar status ao invés de completed
                        setTasks(
                          tasks.map((t) =>
                            t._id === id
                              ? {
                                  ...t,
                                  status: t.status === "done" ? "todo" : "done",
                                }
                              : t
                          )
                        );
                      }}
                      onDelete={(id) => {
                        setTasks(tasks.filter((t) => t._id !== id));
                        handleDeleteTask(id);
                      }}
                    />
                  </div>
                );
              })}

              {/* Área de drop visual quando a coluna está vazia */}
              {getTasksByStatus(column.key).length === 0 &&
                dragOverColumn === column.key && (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center ${
                      isDarkMode
                        ? "border-slate-600 text-slate-400"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    <div className="text-sm">Solte a tarefa aqui</div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          <div
            className={`relative w-full max-w-md ${
              isDarkMode ? "bg-slate-800" : "bg-white"
            } rounded-2xl shadow-2xl border ${
              isDarkMode ? "border-slate-700" : "border-slate-200"
            } transform transition-all duration-300 scale-100 opacity-100`}
          >
            <div
              className={`flex items-center justify-between p-6 border-b ${
                isDarkMode ? "border-slate-700" : "border-slate-200"
              }`}
            >
              <h2 className="text-xl font-semibold">Nova Tarefa</h2>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg hover:${
                  isDarkMode ? "bg-slate-700" : "bg-gray-100"
                } transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Título *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Título é obrigatório",
                    minLength: {
                      value: 5,
                      message: "Título deve ter ao menos 5 caracteres",
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Digite o título da tarefa"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Descrição
                </label>
                <textarea
                  {...register("description", {
                    minLength: {
                      value: 10,
                      message: "Descrição deve ter ao menos 10 caracteres",
                    },
                    setValueAs: normalizeDescription, // Aplicar normalização automaticamente
                  })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                  placeholder="Descreva sua tarefa (opcional)"
                  rows={2}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Prioridade
                </label>
                <select
                  {...register("priority")}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  Categorias
                </label>
                <select
                  {...register("category")}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode
                      ? "bg-slate-700 border-slate-600 text-white"
                      : "bg-white border-slate-300 text-slate-900"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                >
                  <option value="trabalho">Trabalho</option>
                  <option value="estudos">Estudos</option>
                  <option value="pessoal">Pessoal</option>
                  <option value="saude">Saúde</option>
                  <option value="casa">Casa</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 px-4 py-3 rounded-xl font-medium ${
                    isDarkMode
                      ? "bg-slate-700 text-white hover:bg-slate-600"
                      : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                  } transition-colors`}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Criando..." : "Criar Tarefa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksView;
