import { z } from "zod";

export const TITULO_MAX = 120;
export const DESCRICAO_MAX = 1000;

/** Same rules as the backend: the user sees the error before submitting. */
export const taskFormSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "Título é obrigatório")
    .max(TITULO_MAX, `O título deve ter no máximo ${TITULO_MAX} caracteres`),
  descricao: z
    .string()
    .trim()
    .max(
      DESCRICAO_MAX,
      `A descrição deve ter no máximo ${DESCRICAO_MAX} caracteres`,
    ),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export type TaskFormSubmit = {
  titulo: string;
  descricao?: string;
};
