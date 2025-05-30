import { z } from "zod";

export const routineSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  weekDay: z.number(),
  time: z.string().optional(),
  category: z.string().optional(),
});
