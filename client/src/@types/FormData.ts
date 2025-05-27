export type FormData = {
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
};