import { z } from "zod";
import type { Task } from "../../domain/Task";

/**
 * Fronteira com o banco: valida a linha do Prisma e converte null -> undefined.
 * Daqui para fora, a aplicação só trabalha com undefined.
 */
export const TaskRowSchema = z.object({
  id: z.string(),
  titulo: z.string(),
  descricao: z
    .string()
    .nullable()
    .transform((value) => value ?? undefined),
  dataCriacao: z.date(),
});

export function toDomain(row: unknown): Task {
  return TaskRowSchema.parse(row);
}
