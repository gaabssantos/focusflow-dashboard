import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string()
    .email({message: "E-mail inválido."}),
  password: z
    .string()
    .min(8, { message: "A sua senha deve ter, pelo menos, 8 caracteres." })
    .optional(),
});
