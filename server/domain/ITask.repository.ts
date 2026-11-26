import type { CursorPositionInputDto } from "./Pagination";
import type { CreateTaskInputDto, Task, UpdateTaskInputDto } from "./Task";

/**
 * Task persistence contract.
 * Implementations: PrismaTaskRepository (production) and InMemoryTaskRepository (tests).
 */
export interface ITaskRepository {
  /** Tasks ordered by dataCriacao desc, id desc, starting after "after" (exclusive). */
  findAfter(params: {
    after?: CursorPositionInputDto;
    take: number;
  }): Promise<Task[]>;
  findById(id: string): Promise<Task | undefined>;
  create(data: CreateTaskInputDto): Promise<Task>;
  /** Replaces the editable data. Returns undefined if the task does not exist. */
  update(id: string, data: UpdateTaskInputDto): Promise<Task | undefined>;
  /** Throws TaskNotFoundError if the task does not exist. */
  delete(id: string): Promise<void>;
}
