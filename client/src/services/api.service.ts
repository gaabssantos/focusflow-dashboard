import { Routine } from "@/@types/Routine";
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

export const updateTask = async (
  targetStatus: TaskStatus,
  id: string | number
) => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/tasks/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: targetStatus,
      }),
    });

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

export const startPomodoroSession = async (): Promise<{
  currentStreak: number;
}> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/api/pomodoro/streak`, {
      method: "POST",
    });

    if (
      typeof response === "object" &&
      response !== null &&
      "currentStreak" in response
    ) {
      const { currentStreak = 0 } = response as {
        currentStreak?: number;
      };
      return { currentStreak };
    }

    return { currentStreak: 0 };
  } catch (error) {
    toast.error("Erro ao iniciar sessão. Tente novamente. " + error);
    return { currentStreak: 0 };
  }
};

export const incrementPomodoro = async (): Promise<{
  count: number;
  currentStreak: number;
}> => {
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

export const getPomodoroStats = async (
  onlyCount: number
): Promise<{
  count: number;
  currentStreak: number;
}> => {
  try {
    const response = await apiFetch(
      `${API_BASE_URL}/api/pomodoro/stats/${onlyCount}`,
      {
        method: "GET",
      }
    );

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
    toast.error(
      "Erro ao buscar estatísticas de Pomodoro. Tente novamente. " + error
    );
    return { count: 0, currentStreak: 0 };
  }
};

export interface PomodoroStats {
  count: number;
  currentStreak: number;
}

export const refreshStats = async (): Promise<PomodoroStats> => {
  try {
    const stats = await getPomodoroStats(0); // já retorna count e streak
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

interface CreateTransactionPayload {
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
}

interface TransactionResponse {
  _id: string;
  type: "income" | "expense";
  description: string;
  amount: number;
  category: string;
  date: string;
}

export const addTransaction = async (data: CreateTransactionPayload) => {
  try {
    const response = (await apiFetch(`${API_BASE_URL}/api/transaction`, {
      method: "POST",
      body: JSON.stringify(data),
    })) as TransactionResponse;

    return response;
  } catch (error) {
    toast.error("Erro ao adicionar transação. Tente novamente. " + error);
    return;
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    const response = (await apiFetch(`${API_BASE_URL}/api/transaction/${id}`, {
      method: "DELETE",
    })) as TransactionResponse;

    return response;
  } catch (error) {
    toast.error("Erro ao deletar transação. Tente novamente. " + error);
    return;
  }
};

export const getRecentTransactions = async (
  period: "week" | "month" | "year"
): Promise<TransactionResponse[] | undefined> => {
  try {
    const response = (await apiFetch(
      `${API_BASE_URL}/api/transaction/recents/${period}`,
      {
        method: "GET",
      }
    )) as TransactionResponse[];

    return response;
  } catch (error) {
    toast.error(
      "Erro ao buscar transações recentes. Tente novamente. " + error
    );
    return;
  }
};

export interface CreateRoutinePayload {
  title: string;
  description?: string;
  weekDay: number;
  time?: string;
  category?: string;
}

export const createRoutine = async (
  data: CreateRoutinePayload
): Promise<void> => {
  try {
    await apiFetch(`${API_BASE_URL}/api/routine`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  } catch (error) {
    toast.error("Erro ao criar rotina. Tente novamente. " + error);
  }
};

export const deleteRoutine = async (
  id: string
): Promise<void> => {
  try {
    await apiFetch(`${API_BASE_URL}/api/routine/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    toast.error("Erro ao deletar rotina. Tente novamente. " + error);
  }
};

export const getAllRoutines = async (): Promise<Routine[] | undefined> => {
  try {
    const response = (await apiFetch(`${API_BASE_URL}/api/routine`, {
      method: "GET",
    })) as Routine[];

    return response;
  } catch (error) {
    toast.error("Erro ao buscar rotinas. Tente novamente. " + error);
    return;
  }
};
