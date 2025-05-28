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

export const incrementPomodoro = async (): Promise<{ count: number; currentStreak: number }> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/pomodoro/increment`, {
      method: "POST",
    });

    if (
      typeof response === "object" &&
      response !== null &&
      "count" in response &&
      "currentStreak" in response
    ) {
      const { count = 0, currentStreak = 0 } = response as {
        count?: number;
        currentStreak?: number;
      };
      return { count, currentStreak };
    }

    return { count: 0, currentStreak: 0 };
  } catch (error) {
    toast.error("Erro ao registrar Pomodoro. Tente novamente. " + error);
    return { count: 0, currentStreak: 0 };
  }
};

export const getPomodoroStats = async (): Promise<{ count: number; currentStreak: number }> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/pomodoro/stats`, {
      method: "GET",
    });

    if (
      typeof response === "object" &&
      response !== null &&
      "count" in response &&
      "currentStreak" in response
    ) {
      const { count = 0, currentStreak = 0 } = response as {
        count?: number;
        currentStreak?: number;
      };
      return { count, currentStreak };
    }

    return { count: 0, currentStreak: 0 };
  } catch (error) {
    toast.error("Erro ao buscar estatísticas de Pomodoro. Tente novamente. " + error);
    return { count: 0, currentStreak: 0 };
  }
};

export interface PomodoroStats {
  count: number;
  currentStreak: number;
}

export const refreshStats = async (): Promise<PomodoroStats> => {
  try {
    const stats = await getPomodoroStats(); // já retorna count e streak
    return {
      count: stats.count || 0,
      currentStreak: stats.currentStreak || 0,
    };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error("Erro ao atualizar estatísticas. Tente novamente.");
    return { count: 0, currentStreak: 0 };
  }
};