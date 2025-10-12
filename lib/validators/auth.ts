import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Por favor, insira um e-mail válido."),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
});
