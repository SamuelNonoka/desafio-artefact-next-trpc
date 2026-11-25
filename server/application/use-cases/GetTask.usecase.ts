import { TaskNotFoundError } from "@/server/domain/Errors";
import { ITaskRepository } from "@/server/domain/ITask.repository";
import { Task } from "@/server/domain/Task";

export class FindTaskUseCase {
  constructor(private readonly tasks: ITaskRepository) {}

  async execute(id: string): Promise<Task> {
    const task = await this.tasks.findById(id);
    if (!task) throw new TaskNotFoundError(id);
    return task;
  }
}
