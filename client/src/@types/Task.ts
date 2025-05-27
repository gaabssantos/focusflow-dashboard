export type TaskStatus = "todo" | "progress" | "done";

export type Task = {
  _id: string | number;
  title: string;
  description?: string | null;
  priority: "baixa" | "media" | "alta";
  category:
    | "trabalho"
    | "estudos"
    | "pessoal"
    | "saude"
    | "casa"
    | "financeiro"
    | "outros";
  status: TaskStatus;
  date: string;
  completed: boolean;
};
