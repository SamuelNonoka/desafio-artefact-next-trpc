import { z } from "zod";
import type { Task } from "../../../domain/Task";

/**
 * Database boundary: validates the Prisma row and converts null -> undefined.
 * From here outward, the application only deals with undefined.
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
