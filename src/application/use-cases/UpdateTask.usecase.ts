import { TaskNotFoundError } from "../../domain/Errors";
import type { ITaskRepository } from "../../domain/ITask.repository";
import type { Task, UpdateTaskInputDto } from "../../domain/Task";

export type UpdateTaskUseCaseInputDto = { id: string } & UpdateTaskInputDto;

export class UpdateTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute({ id, ...data }: UpdateTaskUseCaseInputDto): Promise<Task> {
    const task = await this.tasks.update(id, data);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }
}
