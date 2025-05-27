import { z } from "zod";

const priorityEnum = ["alta", "media", "baixa"] as const;
const categoryEnum = [
  "trabalho",
  "estudos",
  "pessoal",
  "saude",
  "casa",
  "financeiro",
  "outros",
] as const;

export const taskSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Título deve ter pelo menos 5 caracteres" }),
  description: z
    .string()
    .min(10, { message: "Descrição deve ter pelo menos 10 caracteres" })
    .nullable()
    .optional(),
  priority: z.enum(priorityEnum, {
    errorMap: () => ({
      message: "Priority deve ser 'alta', 'media' ou 'baixa'",
    }),
  }),
  category: z.enum(categoryEnum, {
    errorMap: () => ({
      message: "Esta categoria não existe.",
    }),
  }),
});
