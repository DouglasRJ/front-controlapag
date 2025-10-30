import { z } from "zod";
const MIN_PHONE_DIGITS = 10;
const MIN_ADDRESS_LENGTH = 10;
const phoneValidator = z.string().min(1, "O telefone é obrigatório.").superRefine((val, ctx) => {
  const digits = val.replace(/\D/g, "");
  if (digits.length < MIN_PHONE_DIGITS) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: MIN_PHONE_DIGITS,
      type: "array",
      inclusive: true,
      message: `O telefone deve ter pelo menos ${MIN_PHONE_DIGITS} dígitos (DD + número).`
    });
  }
}).transform(val => val.replace(/\D/g, ""));
export const clientOnboardingSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  username: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  newPassword: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
  phone: phoneValidator,
  address: z.string().min(MIN_ADDRESS_LENGTH, `O endereço deve ter no mínimo ${MIN_ADDRESS_LENGTH} caracteres.`)
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});
export type ClientOnboardingData = z.infer<typeof clientOnboardingSchema>;