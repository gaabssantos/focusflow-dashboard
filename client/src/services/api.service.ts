import { Task, TaskStatus } from "@/@types/Task";
import { apiFetch } from "@/utils/api";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deleteTasks = async (taskId: string | number) => {
  try {
    await apiFetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
      method: "DELETE",
    });
  } catch (error) {
    toast.error("Erro ao deletar tarefa. Tente novamente." + error);
    return;
  }
};

export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    toast.error("Erro ao logar usuário. Tente novamente." + error);
    return;
  }
};

export const createTask = async (normalizedData: {
  description: string | null;
}) => {
  try {
    const response = (await apiFetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      body: JSON.stringify(normalizedData),
    })) as Task;

    return response;
  } catch (error) {
    toast.error("Erro ao logar usuário. Tente novamente." + error);
    return;
  }
};

export const updateTask = async (targetStatus: TaskStatus, id: string | number) => {
  try {
    const response = (await apiFetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: targetStatus,
      }),
    }));

    return response;
  } catch (error) {
    toast.error("Erro ao logar usuário. Tente novamente." + error);
    return;
  }
};

export const getTasks = async () => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/tasks`);

    const tasksArray: Task[] = Array.isArray(response)
      ? (response as Task[])
      : [];
    const normalizedTasks = tasksArray.map((task: Task) => ({
      ...task,
      priority:
        task.priority === "baixa" ||
        task.priority === "media" ||
        task.priority === "alta"
          ? task.priority
          : "baixa",
      // Garantir que o status seja válido, padrão para 'todo' se não existir
      status:
        task.status === "todo" ||
        task.status === "progress" ||
        task.status === "done"
          ? task.status
          : "todo",
    }));

    return normalizedTasks;
  } catch (error) {
    toast.error("Erro ao pegar as tarefas. Tente novamente." + error);
    return;
  }
};

export const getProfile = async () => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/profile`, {
      method: "POST",
      body: JSON.stringify({ email: localStorage.getItem("email") }),
    });

    return response;
  } catch (error) {
    toast.error("Erro ao pegar o perfil. Tente novamente." + error);
    return;
  }
};

export const getPendingTasks = async () => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/tasks/pending`);

    if (
      typeof response === "object" &&
      response !== null &&
      "count" in response
    ) {
      return (response as { count?: number }).count || 0;
    }
    return 0;
  } catch (error) {
    toast.error("Erro ao pegar tarefas pendentes. Tente novamente." + error);
    return;
  }
};

export const getDoneTasks = async () => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/tasks/done`);

    if (
      typeof response === "object" &&
      response !== null &&
      "count" in response
    ) {
      return (response as { count?: number }).count || 0;
    }
    return 0;
  } catch (error) {
    toast.error("Erro ao pegar tarefas finalizadas. Tente novamente." + error);
    return;
  }
};

export const getTodayPomodoros = async (): Promise<number> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/pomodoro/stats`);

    if (
      typeof response === "object" &&
      response !== null &&
      "count" in response
    ) {
      return (response as { count?: number }).count || 0;
    }

    return 0;
  } catch (error) {
    toast.error("Erro ao buscar Pomodoros de hoje. Tente novamente. " + error);
    return 0;
  }
};

export const incrementPomodoro = async (): Promise<number> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/pomodoro/increment`, {
      method: "POST",
    });

    if (
      typeof response === "object" &&
      response !== null &&
      "count" in response
    ) {
      return (response as { count?: number }).count || 0;
    }

    return 0;
  } catch (error) {
    toast.error("Erro ao registrar Pomodoro. Tente novamente. " + error);
    return 0;
  }
};