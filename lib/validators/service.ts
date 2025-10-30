import { z } from "zod";
export const newServiceSchema = z.object({
  name: z.string().min(1, "Por favor, preencha o nome do serviço."),
  allowedPaymentMethods: z.array(z.string()).nonempty({
    message: "Selecione pelo menos um método de pagamento."
  }),
  description: z.string().optional(),
  isRecurrent: z.boolean().optional(),
  hasFixedLocation: z.boolean().optional(),
  address: z.string().optional(),
  hasFixedPrice: z.boolean().optional(),
  defaultPrice: z.string().optional(),
  recurrence: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.hasFixedLocation && (!data.address || data.address.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "O endereço deve ser preenchido.",
      path: ["address"]
    });
  }
  if (data.hasFixedPrice && (!data.defaultPrice || data.defaultPrice.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "O preço deve ser preenchido.",
      path: ["defaultPrice"]
    });
  }
  if (data.isRecurrent && (!data.recurrence || data.recurrence === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "A recorrência deve ser selecionada.",
      path: ["recurrence"]
    });
  }
});
export type NewServiceFormData = z.infer<typeof newServiceSchema>;