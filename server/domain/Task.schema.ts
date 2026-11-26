import { z } from "zod";

const titulo = z
  .string({ error: "Título é obrigatório" })
  .trim()
  .min(1, "Título é obrigatório")
  .max(120, "O título deve ter no máximo 120 caracteres");

// Optional: empty, null or missing become undefined
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
  // tRPC requires the name "cursor" to work with useInfiniteQuery.
  // On the first page the client sends null; we normalize it to undefined here at the boundary.
  cursor: z
    .string()
    .nullish()
    .transform((value) => value || undefined),
  limit: z.number().int().min(1).max(50).default(10),
});
