import { USER_ROLE } from "@/types/user-role";
import { z } from "zod";

const MIN_PHONE_DIGITS = 10;
const MIN_ADDRESS_LENGTH = 10;

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

const phoneValidator = z
  .string()
  .min(1, "O telefone é obrigatório.")
  .superRefine((val, ctx) => {
    const digits = val.replace(/\D/g, "");
    if (digits.length < MIN_PHONE_DIGITS) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: MIN_PHONE_DIGITS,
        type: "array",
        inclusive: true,
        message: `O telefone deve ter pelo menos ${MIN_PHONE_DIGITS} dígitos (DD + número).`,
      });
    }
  })
  .transform((val) => val.replace(/\D/g, ""));

export const registerSchema = z
  .object({
    username: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),

    role: z.nativeEnum(USER_ROLE, {
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.invalid_type) {
          return { message: "Selecione o tipo de conta" };
        }
        if (issue.code === z.ZodIssueCode.invalid_enum_value) {
          return { message: "Valor de conta inválido" };
        }
        return { message: ctx.defaultError };
      },
    }),

    providerProfile: z
      .object({
        title: z.string().min(3, "O título do serviço é obrigatório."),

        address: z
          .string()
          .min(
            MIN_ADDRESS_LENGTH,
            `O endereço deve ter no mínimo ${MIN_ADDRESS_LENGTH} caracteres.`
          ),

        businessPhone: phoneValidator,

        bio: z
          .string()
          .min(10, "A biografia deve ter no mínimo 10 caracteres."),
      })
      .optional(),

    clientProfile: z
      .object({
        phone: phoneValidator,

        address: z
          .string()
          .min(
            MIN_ADDRESS_LENGTH,
            `O endereço deve ter no mínimo ${MIN_ADDRESS_LENGTH} caracteres.`
          ),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === USER_ROLE.PROVIDER) {
        return !!data.providerProfile;
      }
      if (data.role === USER_ROLE.CLIENT) {
        return !!data.clientProfile;
      }
      return false;
    },
    {
      message: "O perfil é obrigatório",
      path: ["role"],
    }
  );

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
