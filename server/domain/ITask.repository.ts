import type { CursorPositionInputDto } from "./Pagination";
import type { CreateTaskInputDto, Task, UpdateTaskInputDto } from "./Task";

/**
 * Contrato de persistência de tarefas.
 * Implementações: PrismaTaskRepository (produção) e InMemoryTaskRepository (testes).
 */
export interface ITaskRepository {
  /** Tarefas ordenadas por dataCriacao desc, id desc, a partir de "after" (exclusivo). */
  findAfter(params: {
    after?: CursorPositionInputDto;
    take: number;
  }): Promise<Task[]>;
  findById(id: string): Promise<Task | undefined>;
  create(data: CreateTaskInputDto): Promise<Task>;
  /** Substitui os dados editáveis. Retorna undefined se a tarefa não existir. */
  update(id: string, data: UpdateTaskInputDto): Promise<Task | undefined>;
  /** Lança TaskNotFoundError se a tarefa não existir. */
  delete(id: string): Promise<void>;
}
