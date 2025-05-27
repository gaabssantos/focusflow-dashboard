export class Task {
  constructor(
    public id: string,
    public title: string,
    public priority: "baixa" | "media" | "alta",
    public status: "todo" | "progress" | "done",
    public category:
      | "trabalho"
      | "estudos"
      | "pessoal"
      | "saude"
      | "casa"
      | "financeiro"
      | "outros",
    public userId: string,
    public description?: string
  ) {}
}
