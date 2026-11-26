import { Prisma, type PrismaClient } from "@prisma/client";
import { TaskNotFoundError } from "../../../domain/Errors";
import type { CursorPositionInputDto } from "../../../domain/Pagination";
import type {
  CreateTaskInputDto,
  Task,
  UpdateTaskInputDto,
} from "../../../domain/Task";
import type { ITaskRepository } from "../../../domain/ITask.repository";
import { toDomain } from "./Task.acl";

/** P2025 = "record not found" (e.g. deleted between the check and the write). */
function isNotFound(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

export class PrismaTaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAfter({
    after,
    take,
  }: {
    after?: CursorPositionInputDto;
    take: number;
  }): Promise<Task[]> {
    const rows = await this.prisma.task.findMany({
      take,
      where: after
        ? {
            OR: [
              { dataCriacao: { lt: after.dataCriacao } },
              { dataCriacao: after.dataCriacao, id: { lt: after.id } },
            ],
          }
        : undefined,
      orderBy: [{ dataCriacao: "desc" }, { id: "desc" }],
    });
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Task | undefined> {
    const row = await this.prisma.task.findUnique({ where: { id } });
    return row ? toDomain(row) : undefined;
  }

  async create(data: CreateTaskInputDto): Promise<Task> {
    const row = await this.prisma.task.create({
      data: { titulo: data.titulo, descricao: data.descricao },
    });
    return toDomain(row);
  }

  async update(
    id: string,
    data: UpdateTaskInputDto,
  ): Promise<Task | undefined> {
    try {
      const row = await this.prisma.task.update({
        where: { id },
        // In Prisma, undefined means "do not change". Since editing replaces
        // the data, a missing descricao must become null to clear the field.
        data: { titulo: data.titulo, descricao: data.descricao ?? null },
      });
      return toDomain(row);
    } catch (error) {
      if (isNotFound(error)) return undefined;
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.task.delete({ where: { id } });
    } catch (error) {
      if (isNotFound(error)) throw new TaskNotFoundError(id);
      throw error;
    }
  }
}
