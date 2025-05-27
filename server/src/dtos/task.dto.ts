export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority: "baixa" | "media" | "alta";
  status: "todo" | "progress" | "done";
  category:
    | "trabalho"
    | "estudos"
    | "pessoal"
    | "saude"
    | "casa"
    | "financeiro"
    | "outros";
  userId: string;
}
