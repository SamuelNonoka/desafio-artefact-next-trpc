import { randomUUID } from "node:crypto";
import { TaskNotFoundError } from "../../../domain/Errors";
import type { CursorPositionInputDto } from "../../../domain/Pagination";
import type {
  CreateTaskInputDto,
  Task,
  UpdateTaskInputDto,
} from "../../../domain/Task";
import type { ITaskRepository } from "../../../domain/ITask.repository";

/** Same ordering as the database: dataCriacao desc, id desc. Negative = "a" comes before "b". */
function compare(a: CursorPositionInputDto, b: CursorPositionInputDto): number {
  const byDate = b.dataCriacao.getTime() - a.dataCriacao.getTime();
  if (byDate !== 0) return byDate;
  return a.id > b.id ? -1 : a.id < b.id ? 1 : 0;
}

/** In-memory implementation, used in tests (no database). */
export class InMemoryTaskRepository implements ITaskRepository {
  private items: Task[] = [];

  async findAfter({
    after,
    take,
  }: {
    after?: CursorPositionInputDto;
    take: number;
  }): Promise<Task[]> {
    return [...this.items]
      .sort(compare)
      .filter((task) => !after || compare(task, after) > 0)
      .slice(0, take)
      .map((task) => ({ ...task }));
  }

  async findById(id: string): Promise<Task | undefined> {
    const task = this.items.find((t) => t.id === id);
    return task ? { ...task } : undefined;
  }

  async create(data: CreateTaskInputDto): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      titulo: data.titulo,
      descricao: data.descricao,
      dataCriacao: new Date(),
    };
    this.items.push(task);
    return { ...task };
  }

  async update(id: string, data: UpdateTaskInputDto): Promise<Task | undefined> {
    const task = this.items.find((t) => t.id === id);
    if (!task) throw new TaskNotFoundError(id);
    task.titulo = data.titulo;
    task.descricao = data.descricao;
    return { ...task };
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((t) => t.id === id);
    if (index === -1) throw new TaskNotFoundError(id);
    this.items.splice(index, 1);
  }
}
