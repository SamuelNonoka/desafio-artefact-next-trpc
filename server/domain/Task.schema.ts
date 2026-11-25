import { z } from "zod";

const titulo = z
  .string({ error: "Título é obrigatório" })
  .trim()
  .min(1, "Título é obrigatório")
  .max(120, "O título deve ter no máximo 120 caracteres");

// Opcional: vazio, null ou ausente viram undefined
const descricao = z
  .string()
  .trim()
  .max(1000, "A descrição deve ter no máximo 1000 caracteres")
  .nullish()
  .transform((value) => value || undefined);

const id = z.uuid("ID inválido");

export const taskIdInput = z.object({ id });

export const createTaskInput = z.object({ titulo, descricao });

export const updateTaskInput = z.object({ id, titulo, descricao });

export const listTasksInput = z.object({
  // O tRPC exige o nome "cursor" para funcionar com useInfiniteQuery.
  // Na primeira página o cliente envia null; normalizamos para undefined aqui na borda.
  cursor: z
    .string()
    .nullish()
    .transform((value) => value || undefined),
  limit: z.number().int().min(1).max(50).default(10),
});
